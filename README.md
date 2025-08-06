# RescueEye Global

**AI-powered disaster intelligence for real-time emergency detection, reporting, and personalized safety guidance.**

---

## 🚀 Elevator Pitch

RescueEye Global turns crisis into clarity by combining AI and real-time data to help individuals and communities prepare for, report, and respond to emergencies and natural disasters—potentially saving lives when every second counts.

---

## 🛠️ Project Overview

RescueEye Global is a comprehensive platform designed to:

- **Detect and report emergencies** (accidents, fires, medical events) via an interactive map
- **Check location status** for weather and disaster alerts using global data sources
- **Provide AI-powered safety advice** through a smart chatbot
- **Personalize emergency preparedness** with tailored recommendations

---

## ✨ Features

- **Emergency Reporting:** Instantly report incidents and view them on a live map.
- **Location Status Check:** Get real-time weather and disaster info for any location.
- **AI Weather Assistant:** Chatbot answers safety and weather questions, offers advice.
- **Smart PrepKit™:** Custom emergency kit and evacuation plans for your household, with personalization powered by the Qloo API.
- **Global Data Integration:** Uses OpenWeatherMap, GDACS, USGS, ReliefWeb, OpenAI, and Qloo.

---

## 🏁 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x
- API keys for OpenAI, OpenWeatherMap, and Qloo

### Installation & Startup

1. **Start the backend server:**

   ```sh
   cd D:\Downloads\rescueeye-global\server
   node index.js
   ```

2. **Start the React client:**

   ```sh
   cd D:\Downloads\rescueeye-global\client
   npm run dev
   ```

3. **Start the AI chatbot (weather assistant):**
   ```sh
   cd D:\Downloads\rescueeye-global\chat
   python weatherbot_client.py
   ```

---

## 🗺️ Architecture

- **Frontend:** React, Leaflet (maps)
- **Backend:** Express.js (Node)
- **Chatbot:** Python (OpenAI integration)
- **APIs:** OpenWeatherMap, OpenAI, Qloo, disaster data sources

---

## 💡 Use Cases

- Individuals seeking disaster and weather info
- Community emergency reporting
- Personalized family safety planning
- Emergency response coordination

---

## 📄 Scripts

- `npm start` — Run client in development mode
- `npm run build` — Build client for production
- `npm test` — Run client tests

---

## 📚 Learn More

- [Create React App Docs](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [OpenAI API](https://platform.openai.com/docs)
- [Qloo API](https://qloo.com/docs/getting-started/)

---

## 🤝 Contributing

Pull requests and feedback are welcome! Please open an issue to discuss changes.

---

## 📝 License

This project is licensed under the MIT License.

---

**RescueEye Global — Empowering communities to stay safe, prepared, and informed.**
