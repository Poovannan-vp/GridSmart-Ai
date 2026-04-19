import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class AIScheduler:
    def __init__(self):
        self.model = None
        if api_key:
            try:
                # Discover the best available model automatically
                models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
                # Priority: 1.5-flash -> 1.5-pro -> 1.0-pro
                for preferred in ['models/gemini-1.5-flash', 'models/gemini-1.5-pro', 'models/gemini-pro']:
                    if preferred in models:
                        self.model = genai.GenerativeModel(preferred)
                        break
                
                if not self.model and models:
                    self.model = genai.GenerativeModel(models[0])
            except Exception as e:
                print(f"Model Discovery Error: {e}")
                self.model = None

    def generate_schedule(self, solar_forecast: dict, appliances: list, tariff_rates: dict = None):
        """
        Prompts Gemini to generate an optimal running schedule for appliances.
        """
        if not api_key or not self.model:
             # Fallback to a hardcoded schedule for demo if API key is missing or model failed to load
             return {
                 "schedule": [
                     {
                         "appliance_name": app.get("name", "Unknown"),
                         "recommended_start_time": "11:30 AM",
                         "estimated_duration_hours": app.get("duration_hours", 1.0),
                         "reason": "Demo Mode: Optimized for peak solar hours."
                     } for app in appliances
                 ],
                 "estimated_savings_inr": 25.0,
                 "daily_summary_message": "GridSmart Demo Mode: Set your GEMINI_API_KEY for live AI optimization!"
             }

        # Default tariffs if none provided (mocking Indian ToU style tariffs)
        if not tariff_rates:
            tariff_rates = {
                "peak_hours": "06:00 PM - 10:00 PM",
                "peak_rate_inr": 8.50,
                "normal_rate_inr": 5.50
            }

        prompt = f"""
        You are 'GridSmart', an AI Energy Manager for a home in India with a solar rooftop.
        Your goal is to schedule heavy appliances to maximize solar energy usage and minimize grid costs.
        
        Here is the solar radiation forecast for today (higher radiation = more free energy):
        {json.dumps(solar_forecast.get('hourly_forecast', []), indent=2)}
        
        Here is the list of appliances the user wants to run today:
        {json.dumps(appliances, indent=2)}
        
        Here are the local electricity tariff rates:
        {json.dumps(tariff_rates, indent=2)}
        
        Analyze the data and create a schedule. Avoid running heavy appliances during peak grid hours.
        Schedule them during periods of high solar radiation.
        
        Respond ONLY with a valid JSON object matching this schema:
        {{
            "schedule": [
                {{
                    "appliance_name": "string",
                    "recommended_start_time": "string (e.g., 11:00 AM)",
                    "estimated_duration_hours": "float",
                    "reason": "string (brief reason for this time slot)"
                }}
            ],
            "estimated_savings_inr": "float",
            "daily_summary_message": "string (A friendly, short message summarizing the plan)"
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
            
            # The response.text should be the JSON string
            return json.loads(response.text)
            
        except Exception as e:
            return {"error": f"Failed to generate schedule: {str(e)}"}
