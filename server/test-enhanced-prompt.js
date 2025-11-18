// Test the enhanced Gemini prompt
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GOOGLE_AI_API_KEY = "AIzaSyDnT3q5dy1LtB6oRIift5aMPdUqGEsRNRI";
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

async function testEnhancedPrompt() {
  try {
    console.log("🧪 Testing Enhanced RescueEye Gemini Prompt...\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Test different scenarios
    const testCases = [
      {
        name: "Normal Weather Query",
        message: "What's the weather like in New York?",
        location: "New York",
        weatherData: {
          temp: 22,
          feels_like: 25,
          description: "partly cloudy",
          humidity: 60,
          wind_speed: 3.5,
        },
      },
      {
        name: "Severe Weather Alert",
        message: "Is there a storm coming?",
        location: "Miami",
        weatherData: {
          temp: 28,
          feels_like: 32,
          description: "heavy rain",
          humidity: 85,
          wind_speed: 15.2,
        },
        disasterData: [{ event: "Hurricane Warning" }],
      },
    ];

    for (const testCase of testCases) {
      console.log(`\n🔍 Testing: ${testCase.name}`);
      console.log(`Query: "${testCase.message}"`);
      console.log("=" * 50);

      let prompt = `You are the AI Weather Assistant for RescueEye Global, a professional disaster management and emergency response platform. Your role is to provide accurate weather information, disaster alerts, and safety guidance to help communities stay safe.

PERSONALITY & TONE:
- Professional yet friendly and approachable
- Clear, concise, and actionable advice
- Prioritize safety above all else
- Use encouraging language while being serious about risks

USER QUERY: "${testCase.message}"
LOCATION: ${testCase.location}`;

      if (testCase.weatherData) {
        prompt += `
CURRENT WEATHER DATA:
- Temperature: ${testCase.weatherData.temp}°C (feels like ${testCase.weatherData.feels_like}°C)
- Conditions: ${testCase.weatherData.description}
- Humidity: ${testCase.weatherData.humidity}%
- Wind Speed: ${testCase.weatherData.wind_speed} m/s`;
      }

      if (testCase.disasterData) {
        prompt += `
ACTIVE DISASTER ALERTS:
${testCase.disasterData.map((d) => `- ${d.event}`).join("\n")}`;
      }

      prompt += `

INSTRUCTIONS:
1. Provide a natural, conversational response about the weather conditions
2. If there are any weather risks or concerns, include specific safety advice
3. For severe weather or disasters, prioritize emergency safety instructions
4. Include practical tips relevant to the current conditions
5. Keep responses informative but concise (2-4 sentences)
6. End with "Stay safe!" if there are any weather risks

RESPONSE FORMAT: Provide a natural, helpful response as RescueEye Global's weather assistant.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("🤖 AI Response:");
      console.log(text);
      console.log("=" * 50);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testEnhancedPrompt();
