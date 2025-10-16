# RescueEye Global

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

MIT License - use this code however you want.
