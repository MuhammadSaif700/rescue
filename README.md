<!-- # RescueEye Global

Emergency reporting and disaster information platform for communities.

## What is this?

RescueEye Global helps people report emergencies and check weather/disaster conditions in their area. I built this because during emergencies, it's hard to get quick, reliable information about what's happening around you.

## Features

- Report emergencies on an interactive map
- Check weather and disaster alerts for any location
- Chat with an AI assistant for weather questions
- Get emergency preparedness recommendations

## How to run it

You need Node.js and Python installed.

**Backend server:**

```bash
cd server
node index.js
```

**Frontend:**

```bash
cd client
npm install
npm start
```

**AI Chat (optional):**

```bash
cd chat
python weatherbot_client.py
```

Open http://localhost:3000 in your browser.

## Tech stack

**Frontend:**

- React.js for the UI
- Leaflet.js for maps
- HTML/CSS/JavaScript

**Backend:**

- Node.js with Express
- JSON files for data storage

**APIs used:**

- OpenWeatherMap (weather data)
- OpenAI (chatbot)
- Qloo (personalization)
- GDACS, USGS, ReliefWeb (disaster alerts)

## Project structure

```
├── client/    # React frontend
├── server/    # Express backend
├── chat/      # Python chatbot
└── README.md
```

## What works

- Emergency reporting with map markers
- Weather status checking for any location
- AI chatbot for weather questions
- Basic emergency preparedness tips

## Demo

- ## Demo

[![Watch the video](demo-thumbnail.png)](https://github.com/user-attachments/assets/77bab367-0c9f-4b75-a96d-f6a9bb7b7d37)

## Contributing

Feel free to fork this repo and submit pull requests. Open an issue if you find bugs or have suggestions.

## License

MIT License - use this code however you want. -->

**RescueEye Global**

A community-oriented platform that simplifies the process of reporting emergencies and provides real-time updates on disaster and weather conditions.

### 🌍 What is this project about?

RescueEye Global was created to help people easily report emergencies and stay informed during critical times. When crises occur, it can be difficult to find accurate information or share what’s happening in your area. This project is all about making that process smoother and more reliable.

### ✅ What you can do with it

- 🗺️ **Report emergencies**: Quickly and easily report incidents using an interactive map, ensuring that vital information gets where it needs to go.
- 🌦️ **Check weather and disaster alerts**: Stay updated on the latest weather conditions and disaster warnings for any location, helping you make informed decisions.
- 🤖 **Chat with an AI assistant**: Use the AI chatbot to ask questions about weather conditions and safety tips, making it easier to find the answers you need.
- 📌 **Get preparedness tips**: Access helpful advice on how to prepare for different types of emergencies, so you and your loved ones know how to stay safe.

### 🚀 Getting it running locally

To set up RescueEye Global on your computer, you'll need Node.js and Python installed.

1. **Backend (Node.js)**:

   ```bash
   cd server
   node index.js
   ```

2. **Frontend (React)**:

   ```bash
   cd client
   npm install
   npm start
   ```

3. **(Optional) AI Chatbot**:
   ```bash
   cd chat
   python weatherbot_client.py
   ```

Once everything is set up, open your web browser and go to:  
👉 [http://localhost:3000](http://localhost:3000)

### 🛠 Tech Stack

**Frontend:**

- **React.js**: A popular library for building user interfaces.
- **Leaflet.js**: A powerful tool for creating interactive maps.
- **HTML/CSS/JavaScript**: The core technologies for web development.

**Backend:**

- **Node.js + Express**: A robust framework for building server-side applications.
- **JSON**: Used for data storage.

**APIs used:**

- **OpenWeatherMap**: For accurate weather information.
- **OpenAI**: Powers the interactive chatbot.
- **Qloo**: Provides personalization features.
- **GDACS / USGS / ReliefWeb**: Sources for real-time disaster alerts.

### 📁 Project Structure

```
├── client/    # React frontend
├── server/    # Express backend
├── chat/      # Python chatbot
└── README.md
```

### ✅ What’s already working

- **Emergency reports**: Users can mark incidents on an interactive map for better visibility.
- **Weather lookups**: Easily check weather details for any location.
- **AI chatbot**: Get answers to weather questions and safety tips.
- **Preparedness information**: Access essential tips for staying safe during emergencies.

### 🎥 Demo

Demo.mp4 (add your GIF/file link here)

### 🤝 Contributing

If you have ideas or suggestions for improvements, we'd love to hear them! Feel free to fork the repository, submit a pull request, or report any issues you encounter.

### 📄 License

This project is under the MIT License — feel free to use, modify, and share it as you like.
