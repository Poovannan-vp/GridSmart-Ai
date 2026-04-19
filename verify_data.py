import requests
import json
from datetime import datetime

def check_solar_data():
    lat, lon = 13.0827, 80.2707
    url = f"http://localhost:8007/api/solar/forecast?lat={lat}&lon={lon}"
    print(f"Checking data for {lat}, {lon}...")
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if not data.get("success"):
            print(f"Error from API: {data.get('error')}")
            return

        forecast = data.get("hourly_forecast", [])
        print(f"Fetched {len(forecast)} hours of data.")
        
        # Check current hour radiation
        current_hour = datetime.now().hour
        print(f"Current Local Hour: {current_hour}")
        
        # Find peak in the entire set
        max_rad = max([h['radiation_w_m2'] for h in forecast])
        print(f"Max Radiation in data: {max_rad} W/m²")
        
        # Print first few hours
        for i in range(min(5, len(forecast))):
            print(f"Hour {forecast[i]['time']}: {forecast[i]['radiation_w_m2']} W/m²")

    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    check_solar_data()
