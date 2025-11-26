// Test the chatbot endpoint
const fetch = require("node-fetch");

async function testChatbot() {
  try {
    console.log("🧪 Testing chatbot endpoint...\n");

    const response = await fetch("http://localhost:5001/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "What's the weather like today?",
        location: "New York",
        weatherData: {
          temp: 20,
          feels_like: 18,
          description: "Partly cloudy",
          humidity: 65,
          wind_speed: 3.5,
        },
      }),
    });

    const data = await response.json();
    console.log("📨 Response received:");
    console.log("─".repeat(60));
    console.log(data.response);
    console.log("─".repeat(60));

    // Analyze response type
    if (data.response.includes("🤖 **RescueEye AI Assistant**")) {
      console.log("\n❌ USING MANUAL FALLBACK");
      console.log("The response is from the manual system, not Google AI");
    } else {
      console.log("\n✅ USING GOOGLE AI");
      console.log("The response is natural and from Gemini API");
    }
  } catch (error) {
    console.error("❌ Error testing chatbot:", error.message);
  }
}

testChatbot();
