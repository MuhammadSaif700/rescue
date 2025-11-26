// Test different Gemini models to find one that works
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDqzaDPcwYZsdprVssybbGM59c5sTvTF6M");

async function findWorkingModel() {
  console.log("🔍 Searching for available Gemini models...\n");

  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-1.0-pro",
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      const response = await result.response;
      const text = response.text();

      console.log(`✅ ${modelName} WORKS!`);
      console.log(`   Response: "${text}"\n`);
      console.log(`🎉 Use this model in your server: "${modelName}"`);
      return modelName;
    } catch (error) {
      if (error.message.includes("429")) {
        console.log(`⏳ ${modelName} - Rate limited\n`);
      } else if (error.message.includes("404")) {
        console.log(`❌ ${modelName} - Not available\n`);
      } else {
        console.log(
          `❌ ${modelName} - Error: ${error.message.substring(0, 80)}...\n`
        );
      }
    }
  }

  console.log("\n❌ No working models found at this moment.");
  console.log("💡 Your API key is valid but all models are rate-limited.");
  console.log("⏰ Wait 1-2 minutes for the quota to reset.\n");
}

findWorkingModel();
