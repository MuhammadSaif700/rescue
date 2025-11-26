// Test with different API versions and models
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDqzaDPcwYZsdprVssybbGM59c5sTvTF6M");

async function testAllPossibleModels() {
  console.log("🔍 Testing ALL possible Gemini model variations...\n");

  const modelsToTry = [
    // Standard names
    "gemini-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    
    // With models/ prefix
    "models/gemini-pro",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-2.0-flash-exp",
    
    // Latest versions
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "models/gemini-1.5-flash-latest",
    
    // 8B variants
    "gemini-1.5-flash-8b",
    "models/gemini-1.5-flash-8b",
    
    // Old versions
    "gemini-1.0-pro",
    "models/gemini-1.0-pro",
  ];

  let workingModels = [];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent("Reply with just: OK");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS! Response: "${text.trim()}"\n`);
      workingModels.push(modelName);
      
    } catch (error) {
      const errorMsg = error.message || error.toString();
      
      if (errorMsg.includes("429") || errorMsg.includes("quota")) {
        console.log(`⏳ ${modelName} - Rate limited (model exists but quota exceeded)\n`);
        workingModels.push(`${modelName} (rate-limited)`);
      } else if (errorMsg.includes("404") || errorMsg.includes("not found")) {
        console.log(`❌ ${modelName} - Not found\n`);
      } else if (errorMsg.includes("403")) {
        console.log(`🔒 ${modelName} - Permission denied\n`);
      } else {
        console.log(`❌ ${modelName} - Error: ${errorMsg.substring(0, 60)}...\n`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY:");
  console.log("=".repeat(60));
  
  if (workingModels.length > 0) {
    console.log("\n✅ Available models:");
    workingModels.forEach(m => console.log(`   - ${m}`));
  } else {
    console.log("\n❌ No working models found");
    console.log("\n💡 POSSIBLE ISSUES:");
    console.log("   1. API key may not have Gemini API enabled");
    console.log("   2. Free tier quota exhausted (wait 1-2 minutes)");
    console.log("   3. API key needs to be activated in Google AI Studio");
    console.log("   4. Billing may need to be set up");
    console.log("\n🔗 Check your API key at: https://aistudio.google.com/apikey");
  }
}

testAllPossibleModels();
