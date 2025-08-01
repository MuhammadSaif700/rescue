const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs/promises");
const path = require("path");
const fetch = require("node-fetch");
const xml2js = require("xml2js"); // npm install node-fetch xml2js
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix the CORS issue by allowing multiple origins
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

// Load alerts from JSON file
const ALERTS_FILE = path.join(__dirname, "alerts.json");

// Check if alerts.json exists, if not, create it
(async function initAlerts() {
  try {
    await fs.access(ALERTS_FILE);
  } catch (e) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(ALERTS_FILE, JSON.stringify([]));
    console.log("Created empty alerts.json file");
  }
})();

// Routes
app.get("/", (req, res) => {
  res.send("RescueEye Backend API is running");
});

// Get all alerts
app.get("/alerts", async (req, res) => {
  try {
    const data = await fs.readFile(ALERTS_FILE, "utf8");
    const alerts = JSON.parse(data);
    res.json(alerts);
  } catch (error) {
    console.error("Error reading alerts:", error);
    res.status(500).json({ error: "Failed to load alerts" });
  }
});

// --- Alert Reporting ---
app.post("/analyze", async (req, res) => {
  const { text, location, type, severity, peopleAffected, username } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Description is required" });
  }

  // Process emergency type
  const emergencyType = type || "other";

  // Determine icon based on type
  let icon = "⚠️"; // Default
  switch (emergencyType) {
    case "accident":
      icon = "🚗";
      break;
    case "fire":
      icon = "🔥";
      break;
    case "flood":
      icon = "🌊";
      break;
    case "medical":
      icon = "🚑";
      break;
    case "earthquake":
      icon = "🏗️";
      break;
  }

  // Extract coordinates from location or text
  let coordinates = [30.3753, 69.3451]; // Default Pakistan coordinates
  let locationName = location || "Unknown Location";

  // Try to extract known locations
  if (
    locationName.toLowerCase().includes("lahore") ||
    text.toLowerCase().includes("lahore")
  ) {
    coordinates = [31.5656822, 74.3141829];
    if (!location) locationName = "Lahore";
  } else if (
    locationName.toLowerCase().includes("islamabad") ||
    text.toLowerCase().includes("islamabad")
  ) {
    coordinates = [33.6938118, 73.0651511];
    if (!location) locationName = "Islamabad";
  } else if (
    locationName.toLowerCase().includes("karachi") ||
    text.toLowerCase().includes("karachi")
  ) {
    coordinates = [24.8546842, 67.0207055];
    if (!location) locationName = "Karachi";
  }

  // Create the emergency alert
  const alert = {
    id: Date.now(),
    type: emergencyType,
    text: text,
    location: locationName,
    coordinates: coordinates,
    timestamp: new Date().toISOString(),
    status: "pending",
    severity: severity || "medium",
    peopleAffected: peopleAffected || 0,
    icon: icon,
    reporter: username || "anonymous",
  };

  // Save to database or alerts array
  try {
    const data = await fs.readFile(ALERTS_FILE, "utf8");
    const alerts = JSON.parse(data);
    alerts.push(alert);
    await fs.writeFile(ALERTS_FILE, JSON.stringify(alerts, null, 2));
  } catch (e) {
    console.error("Error saving alert:", e);
  }

  res.json(alert);
});

// Handle disaster API requests
app.get("/disaster", async (req, res) => {
  const location = req.query.location;
  if (!location) return res.json({ status: null });

  let statuses = [];

  // GDACS
  try {
    const rssUrl = "https://www.gdacs.org/xml/rss.xml";
    const rssRes = await fetch(rssUrl);
    const rssText = await rssRes.text();
    await xml2js.parseStringPromise(rssText).then((result) => {
      const alerts = result.rss.channel[0].item;
      const found = alerts.find((alert) =>
        alert.title[0].toLowerCase().includes(location.toLowerCase())
      );
      if (found) statuses.push(found.title[0]);
    });
  } catch (e) {}

  // USGS Earthquake API
  try {
    const usgsUrl =
      "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=20";
    const usgsRes = await fetch(usgsUrl);
    const usgsData = await usgsRes.json();
    const eq = usgsData.features.find((f) =>
      f.properties.place.toLowerCase().includes(location.toLowerCase())
    );
    if (eq) {
      statuses.push(eq.properties.title);
    }
  } catch (e) {}

  // ReliefWeb API - Only show current/ongoing/alert disasters
  try {
    const rwUrl = `https://api.reliefweb.int/v1/disasters?appname=rescueeye&profile=full&preset=latest&query[value]=${encodeURIComponent(
      location
    )}`;
    const rwRes = await fetch(rwUrl);
    const rwData = await rwRes.json();
    if (rwData.data && rwData.data.length > 0) {
      const current = rwData.data.find(
        (d) => d.fields.status === "alert" || d.fields.status === "ongoing"
      );
      if (current) {
        statuses.push(`${current.fields.name} (${current.fields.status})`);
      }
    }
  } catch (e) {}

  if (statuses.length > 0) {
    return res.json({ status: statuses.join(" | ") });
  }
  return res.json({ status: "No disaster reported. Area is normal." });
});

// Simple auth routes
app.post("/login", (req, res) => {
  // For demo purposes, accept any username/password
  res.json({ success: true });
});

app.post("/signup", (req, res) => {
  // For demo purposes, always succeed
  res.json({ success: true });
});

// --- Chatbot Route ---
app.post("/chatbot", (req, res) => {
  const { message, enhancedMode } = req.body;

  let response = "I'm sorry, I didn't understand that.";

  if (enhancedMode) {
    // This is a request with Qloo cultural context
    // Parse the context from the message and generate a more personalized response
    response = generate_cultural_response(message);
  } else {
    // Regular response generation
    response = "This is a regular response to your message: " + message;
  }

  res.json({ response: response });
});

function generate_cultural_response(context_message) {
  // Extract information from the structured context message
  // and generate a personalized response that includes cultural considerations

  // For the hackathon, you could simulate this with predefined responses
  // based on extracted disaster type and location

  // Return a culturally aware response
  return "Based on your preference for Italian cuisine and outdoor activities, here are culturally appropriate safety recommendations...";
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
