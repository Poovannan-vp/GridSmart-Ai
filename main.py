from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from solar_service import SolarService
from ai_scheduler import AIScheduler
from notification_service import NotificationService
from user_service import UserService
from impact_service import ImpactService
from advisor_service import AdvisorService
from ghost_power_service import GhostPowerService

app = FastAPI(title="GridSmart API", description="Backend for the GridSmart Energy Platform")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

solar_service = SolarService()
ai_scheduler = AIScheduler()
notification_service = NotificationService()
user_service = UserService()
impact_service = ImpactService()
advisor_service = AdvisorService()
ghost_power_service = GhostPowerService()

class Appliance(BaseModel):
    name: str
    power_watts: int
    duration_hours: float

class NotificationRequest(BaseModel):
    phone_number: str

class OTPVerifyRequest(BaseModel):
    phone_number: str
    otp: str

class ScheduleRequest(BaseModel):
    latitude: float
    longitude: float
    appliances: List[Appliance]

class UsageReportRequest(BaseModel):
    appliance_name: str
    followed_schedule: bool
    estimated_savings: float

class ScheduleNotificationRequest(BaseModel):
    phone_number: str
    schedule_items: List[dict]
    savings: float

@app.post("/api/notifications/send-schedule")
def send_schedule(request: ScheduleNotificationRequest):
    """
    Sends the AI-generated schedule to the user's WhatsApp.
    """
    try:
        result = notification_service.send_schedule_notification(
            to_number=request.phone_number,
            schedule_items=request.schedule_items,
            savings=request.savings
        )
        if not result.get("success"):
            raise Exception(result.get("error"))
        return result
    except Exception as e:
        print(f"DEBUG ERROR [Schedule-WhatsApp]: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/solar/forecast")
def get_forecast(lat: float, lon: float):
    """
    Fetch the solar radiation forecast for a specific location.
    """
    result = solar_service.get_solar_forecast(latitude=lat, longitude=lon)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    return result

@app.post("/api/schedule/generate")
def generate_schedule(request: ScheduleRequest):
    """
    Generate an AI-optimized schedule for appliances based on solar forecast.
    """
    try:
        # 1. Fetch Solar Data
        solar_data = solar_service.get_solar_forecast(
            latitude=request.latitude, 
            longitude=request.longitude
        )
        
        if not solar_data.get("success"):
            raise Exception(f"Solar Data Error: {solar_data.get('error')}")

        # 2. Prepare appliance list for AI
        appliance_dicts = [app.model_dump() for app in request.appliances]

        # 3. Call AI Scheduler
        schedule_result = ai_scheduler.generate_schedule(
            solar_forecast=solar_data,
            appliances=appliance_dicts
        )

        if "error" in schedule_result:
             raise Exception(f"AI Error: {schedule_result['error']}")

        return schedule_result
    except Exception as e:
        print(f"DEBUG ERROR [Schedule]: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notifications/send-otp")
def send_otp(request: NotificationRequest):
    """
    Sends a 6-digit OTP via WhatsApp.
    """
    try:
        result = notification_service.send_otp(request.phone_number)
        if not result.get("success"):
            raise Exception(result.get("error"))
        return result
    except Exception as e:
        print(f"DEBUG ERROR [OTP]: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notifications/verify-otp")
def verify_otp(request: OTPVerifyRequest):
    """
    Verifies the provided OTP.
    """
    result = notification_service.verify_otp(request.phone_number, request.otp)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    
    # On success, send the final welcome message
    notification_service.send_welcome_message(request.phone_number)
    return result

@app.post("/api/notifications/verify")
def send_verification_notification(request: NotificationRequest):
    """
    Sends a welcome/verification WhatsApp notification to the user.
    """
    result = notification_service.send_welcome_message(request.phone_number)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    return result

@app.get("/api/user/profile")
def get_user_profile():
    """
    Get the user's current gamification score and total savings.
    """
    return user_service.get_profile()

@app.post("/api/user/report-usage")
def report_appliance_usage(request: UsageReportRequest):
    """
    Report appliance usage to update the user's score and savings.
    """
    return user_service.report_usage(
        appliance_name=request.appliance_name,
        followed_schedule=request.followed_schedule,
        estimated_savings=request.estimated_savings
    )

@app.get("/api/impact/convert")
def convert_impact(kwh: float):
    """
    Convert a given kWh value into vivid life-impact metrics.
    """
    return impact_service.calculate_life_impact(kwh)

@app.get("/api/advisor/slab-warning")
def check_slab_warning(consumption_kwh: float):
    """
    Acts as a Financial Advisor to warn if the user is nearing a higher tariff slab.
    """
    return advisor_service.check_slab_warning(consumption_kwh)

@app.get("/api/advisor/ghost-power")
def check_ghost_power(current_load_watts: float, hour_of_day: Optional[int] = None):
    """
    Analyzes current load to detect 'Ghost Power' (standby power) at night.
    """
    return ghost_power_service.analyze_base_load(current_load_watts, hour_of_day)

# Run the app locally for development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
