import json
import os

class UserService:
    def __init__(self, db_path="db.json"):
        self.db_path = db_path
        self._ensure_db_exists()

    def _ensure_db_exists(self):
        """Creates the mock DB file if it doesn't exist."""
        if not os.path.exists(self.db_path):
            self._save_data({
                "score": 0,
                "total_savings_inr": 0.0,
                "history": []
            })

    def _load_data(self):
        with open(self.db_path, "r") as f:
            return json.load(f)

    def _save_data(self, data):
        with open(self.db_path, "w") as f:
            json.dump(data, f, indent=4)

    def get_profile(self):
        """Returns the user's current score and savings."""
        data = self._load_data()
        return {
            "score": data.get("score", 0),
            "total_savings_inr": data.get("total_savings_inr", 0.0)
        }

    def report_usage(self, appliance_name: str, followed_schedule: bool, estimated_savings: float):
        """
        Updates the user's score and savings based on whether they followed the AI schedule.
        """
        data = self._load_data()
        
        if followed_schedule:
            # Reward: Increase score and add savings
            data["score"] += 100
            data["total_savings_inr"] += estimated_savings
            message = f"Great job! You saved INR {estimated_savings:.2f} by running the {appliance_name} on solar."
        else:
            # Penalty: Decrease score, no savings added
            data["score"] = max(0, data["score"] - 50) # Don't go below 0
            message = f"Oops! Running the {appliance_name} outside the solar window cost you points."

        # Keep a history log
        data.setdefault("history", []).append({
            "appliance": appliance_name,
            "followed": followed_schedule,
            "savings": estimated_savings if followed_schedule else 0.0
        })

        self._save_data(data)

        return {
            "success": True,
            "message": message,
            "new_score": data["score"],
            "new_total_savings_inr": data["total_savings_inr"]
        }
