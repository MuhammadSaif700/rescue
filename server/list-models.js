// List available Google AI models
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GOOGLE_AI_API_KEY = "AIzaSyDqzaDPcwYZsdprVssybbGM59c5sTvTF6M";
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

async function listModels() {
  try {
    console.log("🔍 Listing available models...");

    // This should list available models
    const models = await genAI.listModels();
    console.log("Available models:", models);
  } catch (error) {
    console.error("❌ Error listing models:", error);

    // Try to get more specific error information
    if (error.status === 403) {
      console.log(
        "🔑 API Key issue: The API key might be invalid or doesn't have access to the Gemini API"
      );
    } else if (error.status === 404) {
      console.log(
        "🚫 Service not found: The Gemini API might not be available for this key"
      );
    }

    console.log("\n💡 Possible solutions:");
    console.log("1. Check if the API key is correct");
    console.log("2. Make sure Gemini API is enabled in Google Cloud Console");
    console.log("3. Verify billing is set up for the project");
    console.log("4. Try using a different API key");
  }
}

listModels();
