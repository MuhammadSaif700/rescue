const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { OpenAI } = require("openai");

const app = express();
app.use(
  cors({
    origin:
      "https://34e92023-0b05-4d8b-9002-4cf5c781f1f0-00-2zlqfi3h8skfb.pike.replit.dev",
    credentials: true,
  })
);
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); // Replace with your key

let alerts = [];
let users = [{ username: "admin", password: "admin" }];

// --- Disaster API ---
app.get("/disaster", async (req, res) => {
  const location = req.query.location;
  // Dummy logic: if location contains "flood", "fire", etc.
  if (!location) return res.json({ status: null });
  const lower = location.toLowerCase();
  if (lower.includes("flood")) return res.json({ status: "Flood reported" });
  if (lower.includes("fire")) return res.json({ status: "Fire reported" });
  if (lower.includes("earthquake"))
    return res.json({ status: "Earthquake reported" });
  if (lower.includes("landslide"))
    return res.json({ status: "Landslide reported" });
  // Otherwise, normal
  return res.json({ status: null });
});

// --- Weather Proxy (optional) ---
app.get("/weather", async (req, res) => {
  const location = req.query.location;
  const apiKey = "21af7453a5b5eea1f18565bb32fb31af";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${apiKey}&units=metric`;
  const weatherRes = await fetch(url);
  const weatherData = await weatherRes.json();
  res.json(weatherData);
});

// --- Alert Reporting ---
app.post("/analyze", (req, res) => {
  const { text, username } = req.body;
  // Dummy location and type extraction
  let type = "unknown";
  if (text.toLowerCase().includes("flood")) type = "flood";
  if (text.toLowerCase().includes("fire")) type = "fire";
  if (text.toLowerCase().includes("earthquake")) type = "earthquake";
  if (text.toLowerCase().includes("landslide")) type = "landslide";
  // Dummy coordinates (Pakistan center)
  const coordinates = [30.3753, 69.3451];
  const alert = {
    id: Date.now(),
    text,
    type,
    location: text,
    coordinates,
    timestamp: new Date(),
    icon: "⚠️",
    status: "pending",
    username: username || "guest",
  };
  alerts.unshift(alert);
  res.json(alert);
});

// --- Alert Listing ---
app.get("/alerts", (req, res) => {
  res.json(alerts);
});

// --- Alert Status Update ---
app.patch("/alerts/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const alert = alerts.find((a) => a.id === id);
  if (alert) {
    alert.status = status;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Alert not found" });
  }
});

// --- Simple Auth ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) return res.json({ success: true });
  res.status(401).json({ error: "Invalid credentials" });
});
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username exists" });
  }
  users.push({ username, password });
  res.json({ success: true });
});

app.post("/ai-chat", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a weather and disaster expert. Only answer questions about weather alerts, floods, earthquakes, landslides, and give safety advice.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    console.error(e); // This will show the error in your terminal
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
