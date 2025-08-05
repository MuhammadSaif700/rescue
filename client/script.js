// Define map
const map = L.map("map").setView([30.3753, 69.3451], 5); // Center on Pakistan
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Custom icons
const fireIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/482/482058.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const floodIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4205/4205305.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

let currentMarker = null;

async function analyze() {
  const inputText = document.getElementById("inputText").value;
  const responseBox = document.getElementById("responseBox");

  const response = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: inputText }),
  });

  const data = await response.json();
  console.log("Response:", data);

  // Show JSON result
  responseBox.innerText = JSON.stringify(data, null, 2);

  if (data.location && data.location.lat && data.location.lon) {
    const lat = data.location.lat;
    const lon = data.location.lon;

    // Choose icon
    let selectedIcon = L.icon({});
    if (data.alert_type === "fire") {
      selectedIcon = fireIcon;
    } else if (data.alert_type === "flood") {
      selectedIcon = floodIcon;
    }

    // Remove previous marker
    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    // Add new marker
    currentMarker = L.marker([lat, lon], { icon: selectedIcon })
      .addTo(map)
      .bindPopup(`<b>${data.alert_text}</b><br>${data.location_name}`)
      .openPopup();

    // Center map on alert
    map.setView([lat, lon], 10);
  }
}
