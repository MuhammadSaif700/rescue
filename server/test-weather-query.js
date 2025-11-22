// Direct test of gemini-2.0-flash model
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

async function testWeatherQuery() {
  try {
    console.log("🧪 Testing gemini-2.5-flash with weather query...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are RescueEye Global's weather assistant. You help people with weather information, disaster alerts, and safety advice.

User Query: "What's the weather like in Lahore?"
Location: Lahore
Current Weather: Temperature 28°C, feels like 32°C, partly cloudy, humidity 65%, wind 2.5 m/s

Provide helpful, accurate weather information and safety advice. Keep responses concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS! gemini-2.5-flash is working!");
    console.log("📝 Response:");
    console.log("=" * 50);
    console.log(text);
    console.log("=" * 50);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testWeatherQuery();
