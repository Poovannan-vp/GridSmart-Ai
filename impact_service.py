class ImpactService:
    def calculate_life_impact(self, kwh_saved: float):
        """
        Converts kWh saved into relatable 'Life-Impact' metrics to gamify the experience.
        Goal: Make the user feel like a climate superhero.
        
        Assumptions per 1 kWh saved:
        - 3 days of oxygen from a Banyan tree
        - 66 smartphone charges
        - 4.25 KM driven in a petrol car
        """
        import math
        if math.isnan(kwh_saved):
            kwh_saved = 0.0
            
        tree_days = int(kwh_saved * 3)
        phone_charges = int(kwh_saved * 66)
        car_km = round(kwh_saved * 4.25, 1)

        return {
            "kwh_saved": round(kwh_saved, 2),
            "metrics": {
                "tree_oxygen_days": tree_days,
                "smartphone_charges": phone_charges,
                "car_km_avoided": car_km
            },
            "superhero_messages": [
                f"🦸‍♂️ You just saved enough CO2 to equal {tree_days} days of oxygen from a Banyan tree!",
                f"📱 That's enough clean energy to charge your smartphone {phone_charges} times.",
                f"🚗 You've avoided the emissions of driving a petrol car for {car_km} km."
            ]
        }
