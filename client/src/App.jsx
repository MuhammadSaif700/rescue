import React, { useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// Map of alert types to icons
const iconMap = {
  Flood: "https://i.imgur.com/WK1OmS4.png",
  Fire: "https://i.imgur.com/yQ1YmfX.png",
  Earthquake: "https://i.imgur.com/WbdRSmy.png",
  Storm: "https://i.imgur.com/GICfHTb.png",
  Unknown: "https://i.imgur.com/u4Y2M7d.png",
};

// Create a Leaflet icon from alert type
const getCustomIcon = (alertType) => {
  return L.icon({
    iconUrl: iconMap[alertType] || iconMap.Unknown,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });
};
function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [alerts, setAlerts] = useState([]);
  
  // --- START: ADD THIS NEW CODE ---
  const [chatMessage, setChatMessage] = useState("");
  const [chatReply, setChatReply] = useState("");

  const handleChatSubmit = async () => {
    if (!chatMessage) return;
    setChatReply("AI is thinking...");
    try {
      const response = await fetch("https://34e92023-0b05-4d8b-9002-4cf5c781f1f0-00-2zlqfi3h8skfb.pike.replit.dev/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMessage }),
      });
      const data = await response.json();
      setChatReply(data.response);
    } catch (error) {
      console.error("Chatbot error:", error);
      setChatReply("Error: Could not connect to the chatbot backend.");
    }
  };
  // --- END: ADD THIS NEW CODE ---

  const handleAnalyze = async () => {
    try {
      const response = await fetch("https://34e92023-0b05-4d8b-9002-4cf5c781f1f0-00-2zlqfi3h8skfb.pike.replit.dev/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setResult(data);
      fetchAlerts(); // refresh alerts list
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to connect to backend." });
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch("https://34e92023-0b05-4d8b-9002-4cf5c781f1f0-00-2zlqfi3h8skfb.pike.replit.dev/alerts");
      const data = await res.json();
      setAlerts(data.reverse()); // newest first
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  // Update the function that handles map markers
  const addAlertToMap = (alert) => {
    // Use OpenStreetMap Nominatim service for proper geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(alert.location)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          // Get coordinates from the first result
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          
          console.log(`Geocoded ${alert.location} to: ${lat}, ${lng}`);
          
          // Create marker at the correct location
          const marker = L.marker([lat, lng]).addTo(map);
          marker.bindPopup(`<b>${alert.title}</b><br>${alert.description}<br>Location: ${alert.location}`);
        } else {
          console.error(`Could not geocode location: ${alert.location}`);
        }
      })
      .catch(error => {
        console.error("Error geocoding location:", error);
      });
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="App">
      <h1>RescueEye Global</h1>
      <textarea
        placeholder="Enter text for climate/emergency detection..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={handleAnalyze}>Analyze</button>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>

          {result.location && result.location.lat && result.location.lon && (
            <MapContainer
              center={[result.location.lat, result.location.lon]}
              zoom={13}
              style={{ height: "400px", width: "100%", marginTop: "20px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[result.location.lat, result.location.lon]}>
                <Popup>{result.alert_text}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      )}

      {/* --- START: ADD THIS NEW CHATBOX --- */}
      <div className="chatbot-section" style={{ marginTop: "40px", padding: "20px", background: "#2a2a4a", borderRadius: "8px" }}>
        <h2>Weather Chatbot</h2>
        <p>Ask the AI about the weather!</p>
        <textarea
          placeholder="e.g., What is the weather in London?"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          style={{ width: '90%', marginTop: '10px' }}
        />
        <br />
        <button onClick={handleChatSubmit} style={{ marginTop: '10px' }}>Ask Weather AI</button>
        {chatReply && (
          <div className="result">
            <h3>AI Reply:</h3>
            <p>{chatReply}</p>
          </div>
        )}
      </div>
      {/* --- END: ADD THIS NEW CHATBOX --- */}

      <div className="alert-history" style={{ marginTop: "40px", textAlign: "left" }}>
        <h2>📜 Alert History</h2>
        {alerts.length === 0 ? (
          <p>No alerts recorded yet.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {alerts.map((alert, idx) => (
              <li
                key={idx}
                style={{
                  background: "#f9f9f9",
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              >
                <p><strong>Alert:</strong> {alert.alert_text || "N/A"}</p>
                <p><strong>Location:</strong> Lat {alert.location.lat}, Lon {alert.location.lon}</p>
                <p><strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
