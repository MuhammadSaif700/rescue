// server/index.js

const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const xml2js = require("xml2js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Use correct API base (localhost for dev, Railway URL for production)
const API_BASE =
  process.env.NODE_ENV === "production"
    ? `https://${
        process.env.RAILWAY_STATIC_URL || `your-railway-app-name.up.railway.app`
      }`
    : `http://localhost:${PORT}`;

// Allowed origins from env
const allowedOrigins = [
  "https://rescueeye.me",
  "https://www.rescueeye.me",
  "http://localhost:3000", // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps, curl, etc.
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- File Setup ----
const ALERTS_FILE = path.join(__dirname, "alerts.json");

(async function initAlerts() {
  try {
    await fs.access(ALERTS_FILE);
  } catch {
    await fs.writeFile(ALERTS_FILE, JSON.stringify([]));
    console.log("✅ Created empty alerts.json file");
  }
})();

// ---- Weather Endpoint ----
app.get("/weather", async (req, res) => {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=30.3753&longitude=69.3451&current_weather=true";
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ---- Routes ----
app.get("/", (req, res) => {
  res.send("RescueEye Backend API is running");
});

// ---- Get All Alerts ----
app.get("/alerts", async (req, res) => {
  try {
    const data = await fs.readFile(ALERTS_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read alerts" });
  }
});

app.get("/alerts/:id", async (req, res) => {
  try {
    const data = await fs.readFile(ALERTS_FILE, "utf8");
    const alerts = JSON.parse(data);
    const id = parseInt(req.params.id);
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      res.json(alert);
    } else {
      res.status(404).json({ message: "Alert not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read alerts" });
  }
});

// ---- Geocoding Queue System ----
const geocodeQueue = [];
let isProcessingQueue = false;

async function processGeocodingQueue() {
  if (isProcessingQueue || geocodeQueue.length === 0) return;

  isProcessingQueue = true;
  const { locationName, resolve } = geocodeQueue.shift();

  try {
    console.log(`Geocoding location: ${locationName}`);
    // First try Nominatim for better global coverage
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        locationName
      )}&limit=1`;
      const nominatimResponse = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "RescueEye Emergency App",
        },
      });

      if (nominatimResponse.ok) {
        const data = await nominatimResponse.json();
        if (data && data.length > 0) {
          console.log(
            `Found coordinates for ${locationName}: [${data[0].lat}, ${data[0].lon}]`
          );
          return resolve([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      }
    } catch (nominatimError) {
      console.error("Nominatim geocoding failed:", nominatimError);
    }

    // Fallback to Maps.co API
    const encodedLocation = encodeURIComponent(locationName);
    const url = `https://geocode.maps.co/search?q=${encodedLocation}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      console.log(
        `Maps.co found coordinates for ${locationName}: [${data[0].lat}, ${data[0].lon}]`
      );
      resolve([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    } else {
      console.warn(`No coordinates found for ${locationName}, using default`);
      resolve(null); // Return null instead of default coordinates
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    resolve(null); // Return null instead of default coordinates
  } finally {
    setTimeout(() => {
      isProcessingQueue = false;
      processGeocodingQueue();
    }, 1000);
  }
}

function geocodeLocation(locationName) {
  return new Promise((resolve) => {
    geocodeQueue.push({ locationName, resolve });
    processGeocodingQueue();
  });
}

// ---- Create Alert ----
app.post("/analyze", async (req, res) => {
  const {
    text,
    location,
    coordinates: clientCoords,
    type,
    severity,
    peopleAffected,
    username,
  } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Description is required" });
  }

  const emergencyType = type || "other";
  const icons = {
    accident: "🚗",
    fire: "🔥",
    flood: "🌊",
    medical: "🚑",
    earthquake: "🏗️",
  };
  const icon = icons[emergencyType] || "⚠️";

  const locationName = location || "Unknown Location";

  // First try using client-provided coordinates if they exist
  let coordinates;
  if (
    clientCoords &&
    Array.isArray(clientCoords) &&
    clientCoords.length === 2
  ) {
    console.log(
      `Using client-provided coordinates for ${locationName}: [${clientCoords[0]}, ${clientCoords[1]}]`
    );
    coordinates = clientCoords;
  } else {
    // Otherwise geocode on the server
    console.log(`Geocoding location on server: ${locationName}`);
    coordinates = await geocodeLocation(locationName);

    // If geocoding fails, don't use default Pakistan coordinates
    if (!coordinates) {
      console.log(`Geocoding failed for ${locationName}, using world center`);
      coordinates = [0, 0]; // Use world center instead of Pakistan
    }
  }

  const alert = {
    id: Date.now(),
    type: emergencyType,
    text,
    location: locationName,
    coordinates,
    timestamp: new Date().toISOString(),
    status: "pending",
    severity: severity || "medium",
    peopleAffected: peopleAffected || 0,
    icon,
    reporter: username || "anonymous",
  };

  try {
    const data = await fs.readFile(ALERTS_FILE, "utf8");
    const alerts = JSON.parse(data);
    alerts.push(alert);
    await fs.writeFile(ALERTS_FILE, JSON.stringify(alerts, null, 2));
    res.json(alert);
  } catch (error) {
    console.error("Error saving alert:", error);
    res.status(500).json({ error: "Failed to save alert" });
  }
});

// ---- Disaster Info ----
app.get("/disaster", async (req, res) => {
  const location = req.query.location;
  if (!location) return res.json({ status: null });

  let statuses = [];

  try {
    const rssRes = await fetch("https://www.gdacs.org/xml/rss.xml");
    const rssText = await rssRes.text();
    const result = await xml2js.parseStringPromise(rssText);
    const alerts = result.rss.channel[0].item;
    const found = alerts.find((alert) =>
      alert.title[0].toLowerCase().includes(location.toLowerCase())
    );
    if (found) statuses.push(found.title[0]);
  } catch {}

  try {
    const usgsRes = await fetch(
      "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=20"
    );
    const usgsData = await usgsRes.json();
    const eq = usgsData.features.find((f) =>
      f.properties.place.toLowerCase().includes(location.toLowerCase())
    );
    if (eq) statuses.push(eq.properties.title);
  } catch {}

  try {
    const rwRes = await fetch(
      `https://api.reliefweb.int/v1/disasters?appname=rescueeye&profile=full&preset=latest&query[value]=${encodeURIComponent(
        location
      )}`
    );
    const rwData = await rwRes.json();
    if (rwData.data && rwData.data.length > 0) {
      const current = rwData.data.find(
        (d) => d.fields.status === "alert" || d.fields.status === "ongoing"
      );
      if (current) {
        statuses.push(`${current.fields.name} (${current.fields.status})`);
      }
    }
  } catch {}

  if (statuses.length > 0) {
    return res.json({ status: statuses.join(" | ") });
  }
  return res.json({ status: "No disaster reported. Area is normal." });
});

// ---- Auth ----
app.post("/login", (req, res) => {
  res.json({ success: true });
});

app.post("/signup", (req, res) => {
  res.json({ success: true });
});

// ---- Chatbot ----
app.post("/chatbot", (req, res) => {
  const { message, enhancedMode } = req.body;
  let response = "I'm sorry, I didn't understand that.";

  if (enhancedMode) {
    response = generateCulturalResponse(message);
  } else {
    response = "This is a regular response to your message: " + message;
  }

  res.json({ response });
});

function generateCulturalResponse(contextMessage) {
  return "Based on your preference for Italian cuisine and outdoor activities, here are culturally appropriate safety recommendations...";
}

// ---- Qloo Proxy ----
app.post("/proxy-qloo", async (req, res) => {
  try {
    const { apiKey, payload } = req.body;
    const response = await fetch("https://api.qloo.com/v1/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Qloo API Proxy Error:", error);
    res.status(500).json({
      error: "Failed to proxy request to Qloo API",
      recommendations: [],
    });
  }
});

// ---- Catch-all Handler ----
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
