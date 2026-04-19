import requests

def test_solar_forecast():
    print("Testing /api/solar/forecast...")
    try:
        response = requests.get("http://localhost:8001/api/solar/forecast?lat=13.0827&lon=80.2707")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Success: {data.get('success')}")
        if data.get('success'):
             print(f"Received {len(data.get('hourly_forecast', []))} hourly records.")
        else:
             print(f"Error: {data.get('error')}")
    except Exception as e:
        print(f"Request failed: {e}")

def test_notification():
    print("\nTesting /api/notifications/verify...")
    try:
        response = requests.post("http://localhost:8001/api/notifications/verify", json={"phone_number": "+1234567890"})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
         print(f"Request failed: {e}")

if __name__ == "__main__":
    test_solar_forecast()
    test_notification()
