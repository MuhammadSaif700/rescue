// Test script to check AI functionality
const testAI = async () => {
  try {
    const response = await fetch("http://localhost:5001/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "What's the weather like in London?",
        location: "London",
        weatherData: null,
        disasterData: null,
      }),
    });

    const data = await response.json();
    console.log("AI Response:", data.response);
    return data;
  } catch (error) {
    console.error("Error testing AI:", error);
    return { error: error.message };
  }
};

// Export for use in browser console
if (typeof module !== "undefined" && module.exports) {
  module.exports = testAI;
} else {
  window.testAI = testAI;
}
