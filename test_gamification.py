import requests

BASE_URL = "http://localhost:8003/api/user"

def print_profile():
    r = requests.get(f"{BASE_URL}/profile")
    print("Profile:", r.json())

def test_gamification():
    print("--- Initial Profile ---")
    print_profile()
    
    print("\n--- Simulating: User followed schedule for Washing Machine (Savings INR 8.50) ---")
    r1 = requests.post(f"{BASE_URL}/report-usage", json={
        "appliance_name": "Washing Machine",
        "followed_schedule": True,
        "estimated_savings": 8.50
    })
    print(r1.json())
    
    print("\n--- Simulating: User missed schedule for Geyser ---")
    r2 = requests.post(f"{BASE_URL}/report-usage", json={
        "appliance_name": "Geyser",
        "followed_schedule": False,
        "estimated_savings": 5.00 # shouldn't be added
    })
    print(r2.json())
    
    print("\n--- Final Profile ---")
    print_profile()

if __name__ == "__main__":
    test_gamification()
