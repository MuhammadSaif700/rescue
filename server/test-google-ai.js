// Simple Google AI Test
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GOOGLE_AI_API_KEY = "AIzaSyDnT3q5dy1LtB6oRIift5aMPdUqGEsRNRI";
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

async function testGoogleAI() {
  try {
    console.log("🧪 Testing Google AI connection...");

    // Test the specific model requested by user first
    const models = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-pro",
      "models/gemini-2.0-flash",
      "models/gemini-1.5-flash",
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
        return modelName; // Return the working model
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }

    console.log("❌ No working models found!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testGoogleAI();
