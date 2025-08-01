from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Weather API configuration
WEATHER_API_KEY = "21af7453a5b5eea1f18565bb32fb31af"
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"

# Your backend server for disaster data
DISASTER_API_URL = "http://localhost:5000/disaster"

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    
    if not user_message:
        return jsonify({"response": "Hello! I'm RescueEye's assistant. Ask me about weather or disasters in any location."})
    
    try:
        # Extract location from user message
        location = extract_location(user_message)
        
        if not location:
            return jsonify({"response": "I need a location to check. Could you please specify a city or region?"})
        
        # 1. Get weather data
        weather_data = get_weather(location)
        
        # 2. Get disaster data
        disaster_data = get_disaster_status(location)
        
        # 3. Generate complete response
        response = generate_response(location, weather_data, disaster_data, user_message)
        
        return jsonify({"response": response})
        
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({
            "response": "I'm having trouble accessing weather and disaster data right now. Please try again in a moment."
        })

def extract_location(message):
    """Extract location from user message using keyword indicators"""
    message = message.lower()
    
    # Common location prefixes
    location_prefixes = [
        "in ", "at ", "for ", "about ", "around ", "near ", 
        "weather in ", "weather at ", "weather for ", 
        "conditions in ", "conditions at ", "conditions for "
    ]
    
    # Try to find location after these prefixes
    for prefix in location_prefixes:
        if prefix in message:
            parts = message.split(prefix, 1)
            if len(parts) > 1:
                # Clean up the location
                location = parts[1].strip()
                # Remove any trailing punctuation or words
                for end_word in ["?", ".", "now", "today", "currently", "right now"]:
                    if location.endswith(end_word):
                        location = location[:-len(end_word)].strip()
                return location
    
    # Look for disaster-specific phrases
    disaster_phrases = [
        "flood in ", "flooding in ", "earthquake in ", "fire in ",
        "hurricane in ", "tornado in ", "storm in ", "tsunami in ",
        "landslide in ", "disaster in "
    ]
    
    for phrase in disaster_phrases:
        if phrase in message:
            return message.split(phrase, 1)[1].split("?")[0].strip()
    
    # Check if message is just a place name
    if len(message.split()) <= 3 and "weather" not in message and "disaster" not in message:
        return message
    
    return None

def get_weather(location):
    """Get weather data from OpenWeatherMap API"""
    params = {
        "q": location,
        "appid": WEATHER_API_KEY,
        "units": "metric"
    }
    
    response = requests.get(WEATHER_API_URL, params=params)
    
    if response.status_code == 200:
        return response.json()
    return None

def get_disaster_status(location):
    """Get disaster status from your backend"""
    params = {"location": location}
    response = requests.get(DISASTER_API_URL, params=params)
    
    if response.status_code == 200:
        return response.json()
    return {"status": "No disaster data available"}

def generate_response(location, weather_data, disaster_data, original_query):
    """Generate a natural language response based on weather and disaster data"""
    
    # Start building response
    response_parts = []
    
    # Add location header
    response_parts.append(f"📍 Information for {location.title()}")
    
    # Add weather information if available
    if weather_data and "weather" in weather_data and "main" in weather_data:
        weather_desc = weather_data["weather"][0]["description"]
        temp = weather_data["main"]["temp"]
        feels_like = weather_data["main"]["feels_like"]
        humidity = weather_data["main"].get("humidity", "N/A")
        wind_speed = weather_data.get("wind", {}).get("speed", "N/A")
        
        response_parts.append(f"\n\n🌦️ Current Weather:")
        response_parts.append(f"• Conditions: {weather_desc}")
        response_parts.append(f"• Temperature: {temp}°C (feels like {feels_like}°C)")
        response_parts.append(f"• Humidity: {humidity}%")
        response_parts.append(f"• Wind Speed: {wind_speed} m/s")
    else:
        response_parts.append("\n\nI couldn't retrieve current weather information for this location.")
    
    # Add disaster information if available
    has_disaster = False
    if disaster_data and "status" in disaster_data:
        status = disaster_data["status"]
        
        if status and "No disaster" not in status and "normal" not in status:
            has_disaster = True
            disaster_type = get_disaster_type(status)
            
            response_parts.append(f"\n\n⚠️ ALERT:")
            response_parts.append(f"{status}")
            
            # Add specific advice based on disaster type
            advice = get_disaster_advice(disaster_type)
            if advice:
                response_parts.append(f"\n\n🔔 SAFETY ADVICE:")
                response_parts.append(advice)
        else:
            response_parts.append(f"\n\n✅ No disasters reported in {location.title()}. The area appears to be safe at this time.")
    else:
        response_parts.append(f"\n\nI couldn't retrieve disaster information for this location.")
    
    # Add a positive closing if no disasters
    if not has_disaster:
        closings = [
            f"Stay safe and enjoy your time in {location.title()}!",
            f"The situation in {location.title()} looks normal. Stay prepared nonetheless!",
            f"No current alerts for {location.title()}. A good day to be outdoors!",
            f"All clear in {location.title()}. Remember that conditions can change, so stay informed."
        ]
        response_parts.append(f"\n\n{random.choice(closings)}")
    
    return "\n".join(response_parts)

def get_disaster_type(status):
    """Extract disaster type from status string"""
    status_lower = status.lower()
    
    if "flood" in status_lower:
        return "flood"
    elif "fire" in status_lower:
        return "fire"
    elif "earthquake" in status_lower:
        return "earthquake"
    elif "hurricane" in status_lower or "cyclone" in status_lower or "typhoon" in status_lower:
        return "hurricane"
    elif "tornado" in status_lower:
        return "tornado"
    elif "tsunami" in status_lower:
        return "tsunami"
    elif "landslide" in status_lower:
        return "landslide"
    else:
        return "general"

def get_disaster_advice(disaster_type):
    """Get safety advice based on disaster type"""
    advice = {
        "flood": """
• Move to higher ground immediately if you're in a flood-prone area
• Avoid walking or driving through flood waters
• Stay away from power lines and electrical wires
• Prepare an emergency kit with food, water, and medications
• Follow evacuation orders from local authorities
• Turn off utilities at main switches if instructed""",

        "fire": """
• Evacuate immediately if authorities recommend it
• Close all doors and windows if you can't evacuate
• Wet towels and place them under doors to keep smoke out
• Stay low to the ground if there's smoke
• Cover your mouth with a wet cloth
• Do not return until authorities say it's safe""",

        "earthquake": """
• Drop, cover, and hold on - get under sturdy furniture
• Stay away from windows and exterior walls
• If outdoors, move to an open area away from buildings
• If in a vehicle, pull over away from buildings and power lines
• Be prepared for aftershocks
• Check for injuries and damage after shaking stops""",

        "hurricane": """
• Follow evacuation orders immediately
• Board up windows and secure loose outdoor items
• Prepare emergency supplies for at least 3 days
• Stay indoors during the hurricane
• Keep away from windows
• Be aware of potential flooding and storm surge""",

        "tornado": """
• Go to the lowest floor, small center room with no windows
• Get under sturdy furniture and protect your head
• In a vehicle, drive to the closest shelter; if not possible, get out and lie flat in a low area
• Watch for flying debris
• Stay away from windows and corners""",

        "tsunami": """
• Move immediately inland to higher ground
• Follow evacuation routes
• Stay away from the coast until officials declare it safe
• If you cannot escape, go to the upper floors of a sturdy building
• If caught in water, grab floating debris and hold on""",
        
        "landslide": """
• Evacuate immediately if you notice signs like tilting trees or cracks in the ground
• Stay alert when driving - watch for collapsed pavement and mud
• Listen for unusual sounds like trees cracking
• Move away from the path of the landslide
• Stay away from the slide area after it has occurred""",

        "general": """
• Follow instructions from local emergency officials
• Have an emergency kit ready with water, food, medications, and important documents
• Keep your phone charged and have a backup power source if possible
• Stay informed through official channels and local news
• Help vulnerable neighbors if you can do so safely"""
    }
    
    return advice.get(disaster_type, advice["general"])

if __name__ == "__main__":
    app.run(port=5001, debug=True)