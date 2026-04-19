import requests
from datetime import datetime

class SolarService:
    def __init__(self):
        # Open-Meteo is free and requires no API key
        self.base_url = "https://api.open-meteo.com/v1/forecast"
        self.wmo_codes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Drizzle: Light intensity",
            53: "Drizzle: Moderate intensity",
            55: "Drizzle: Dense intensity",
            56: "Freezing Drizzle: Light",
            57: "Freezing Drizzle: Dense",
            61: "Rain: Slight intensity",
            63: "Rain: Moderate intensity",
            65: "Rain: Heavy intensity",
            66: "Freezing Rain: Light",
            67: "Freezing Rain: Heavy",
            71: "Snow fall: Slight intensity",
            73: "Snow fall: Moderate intensity",
            75: "Snow fall: Heavy intensity",
            77: "Snow grains",
            80: "Rain showers: Slight",
            81: "Rain showers: Moderate",
            82: "Rain showers: Violent",
            85: "Snow showers: Slight",
            86: "Snow showers: Heavy",
            95: "Thunderstorm: Slight or moderate",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        }

    def get_solar_forecast(self, latitude: float, longitude: float):
        """
        Fetches hourly solar radiation data and a comprehensive weather report.
        Using shortwave_radiation as a proxy for solar energy potential.
        """
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ["shortwave_radiation", "cloud_cover", "temperature_2m", "relative_humidity_2m", "weather_code"],
            "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "weather_code", "wind_speed_10m"],
            "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "uv_index_max"],
            "timezone": "auto",
            "forecast_days": 1
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            raw_data = response.json()
            
            # 1. Format Hourly Forecast
            hourly_data = raw_data.get("hourly", {})
            times = hourly_data.get("time", [])
            radiation = hourly_data.get("shortwave_radiation", [])
            clouds = hourly_data.get("cloud_cover", [])
            temps = hourly_data.get("temperature_2m", [])
            humidity = hourly_data.get("relative_humidity_2m", [])
            
            forecast_summary = []
            for i in range(len(times)):
                dt = datetime.fromisoformat(times[i])
                hour_str = dt.strftime("%I:%M %p")
                
                forecast_summary.append({
                    "time": hour_str,
                    "radiation_w_m2": radiation[i],
                    "cloud_cover_percent": clouds[i],
                    "temperature_c": temps[i] if i < len(temps) else None,
                    "humidity_percent": humidity[i] if i < len(humidity) else None
                })

            # 2. Format "Original Weather Report" (Current & Daily)
            current = raw_data.get("current", {})
            daily = raw_data.get("daily", {})
            
            weather_desc = self.wmo_codes.get(current.get("weather_code"), "Unknown")
            
            original_report = {
                "source": "Open-Meteo (Original Meteorological Data)",
                "current_conditions": {
                    "temperature": f"{current.get('temperature_2m')}°C",
                    "feels_like": f"{current.get('apparent_temperature')}°C",
                    "description": weather_desc,
                    "humidity": f"{current.get('relative_humidity_2m')}%",
                    "wind_speed": f"{current.get('wind_speed_10m')} km/h",
                    "is_day": bool(current.get("is_day"))
                },
                "daily_summary": {
                    "max_temp": f"{daily.get('temperature_2m_max', [None])[0]}°C",
                    "min_temp": f"{daily.get('temperature_2m_min', [None])[0]}°C",
                    "sunrise": daily.get('sunrise', [None])[0],
                    "sunset": daily.get('sunset', [None])[0],
                    "uv_index_max": daily.get('uv_index_max', [None])[0]
                }
            }

            # 3. Urgency Alert Logic
            alerts = []
            now = datetime.now()
            current_hour_idx = -1
            for i, time_str in enumerate(times):
                dt = datetime.fromisoformat(time_str)
                if dt.day == now.day and dt.hour == now.hour:
                    current_hour_idx = i
                    break
            
            if current_hour_idx != -1 and current_hour_idx + 1 < len(times):
                now_rad = radiation[current_hour_idx]
                next_rad = radiation[current_hour_idx + 1]
                
                if now_rad > 100:
                    drop_percent = ((now_rad - next_rad) / now_rad) * 100
                    if drop_percent > 40:
                        dt_next = datetime.fromisoformat(times[current_hour_idx + 1])
                        next_time_str = dt_next.strftime("%I:%M %p")
                        alerts.append(
                            f"⚠️ Incoming clouds at {next_time_str}. Your solar output will drop. Quick—run the heavy loads in the next 20 minutes to stay on free power!"
                        )

            # 4. Identify Current Hour Radiation
            current_radiation = 0
            if current_hour_idx != -1:
                current_radiation = radiation[current_hour_idx]

            return {
                "success": True,
                "location": {"lat": latitude, "lon": longitude},
                "current_radiation": current_radiation,
                "weather_report": original_report,
                "hourly_forecast": forecast_summary,
                "alerts": alerts,
                "raw_weather_report": raw_data
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
