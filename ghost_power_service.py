from datetime import datetime

class GhostPowerService:
    def analyze_base_load(self, current_load_watts: float, hour_of_day: int = None):
        """
        Analyzes current load at night to detect 'Ghost Power' (standby power).
        Returns a gamified checklist if high base load is detected.
        """
        if hour_of_day is None:
            hour_of_day = datetime.now().hour
            
        # Define night as 11 PM (23) to 5 AM (5)
        is_night = hour_of_day >= 23 or hour_of_day <= 5
        
        # Define high base load threshold (e.g., > 150 watts)
        if is_night and current_load_watts > 150:
            # Roughly estimating 100W wasted * 8 hours * 30 days = 24 kWh * Rs 8 = ~Rs 200
            
            return {
                "active": True,
                "title": "👻 Find the power leeches!",
                "message": f"Your house is sleeping, but your meter is spinning! You are drawing {current_load_watts}W right now. Unplug these 'vampire' devices to save ~₹200 this month:",
                "checklist": [
                    "📺 TV & Set-Top Box (Standby)",
                    "🔌 Leftover Phone/Laptop Chargers",
                    "🖥️ Desktop Computer (Sleep Mode)",
                    "♨️ Microwave/Oven Clock",
                    "🛜 Router (if not needed at night)"
                ]
            }
            
        return {
            "active": False,
            "message": "Base load is optimized. No power leeches detected."
        }
