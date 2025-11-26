// Simple Google AI Test
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GOOGLE_AI_API_KEY = "AIzaSyDqzaDPcwYZsdprVssybbGM59c5sTvTF6M";
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

async function testGoogleAI() {
  try {
    console.log("🧪 Testing Google AI connection...");

    // Try different model names
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro"];

    for (const modelName of models) {
      try{
        console.log(`\n🔄 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Hello, can you help me?");
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${modelName} works!`);
        console.log(`Response: ${text.substring(0, 100)}...`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testGoogleAI();
