// Simple Google AI Test
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

async function testGoogleAI() {
  try {
    console.log("🧪 Testing Google AI connection...");

    if (!GOOGLE_AI_API_KEY) {
        console.error("❌ No API KEY found in environment variables.");
        return;
    }

    // Test the specific model requested by user first
    const models = [
      "gemini-2.5-flash", // User requested
      "gemini-2.0-flash", // Likely alternative
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash", // Stable fallback
      "gemini-pro",
    ];

    for (const modelName of models) {
      try {
        console.log(`\n🔄 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Hello, can you help me?");
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${modelName} works!`);
        console.log(`Response: ${text.substring(0, 100)}...`);
        // We continue testing to see which ones work
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testGoogleAI();
