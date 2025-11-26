// Quick API test
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDqzaDPcwYZsdprVssybbGM59c5sTvTF6M");

async function quickTest() {
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-2.0-flash-exp",
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\n✅ Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in one word");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} WORKS! Response: ${text}`);
      console.log(`\n🎉 SUCCESS! Use this model: ${modelName}`);
      break;
    } catch (error) {
      console.log(`❌ ${modelName} failed:`, error.message);
    }
  }
}

quickTest();
