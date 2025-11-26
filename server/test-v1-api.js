// Test with v1 API
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDqzaDPcwYZsdprVssybbGM59c5sTvTF6M");

async function testV1Models() {
  console.log("Testing models that work with free tier API keys...\n");

  const modelsToTest = [
    "models/gemini-1.5-flash-latest",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash-8b-latest",
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`🔄 Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(
        "What is the weather like? Answer in 5 words."
      );
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`   Response: "${text}"\n`);
      console.log(`\n🎉 SUCCESS! Working model found: ${modelName}\n`);
      return modelName;
    } catch (error) {
      if (error.message.includes("429")) {
        console.log(
          `⏳ ${modelName} - Rate limited (will work after cooldown)\n`
        );
      } else if (error.message.includes("404")) {
        console.log(`❌ ${modelName} - Not found\n`);
      } else {
        console.log(`❌ ${modelName} - Error: ${error.message}\n`);
      }
    }
  }

  console.log(
    "❌ No working models found. May need to wait for rate limit to reset."
  );
}

testV1Models();
