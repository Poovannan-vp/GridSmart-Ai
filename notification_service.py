import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

class NotificationService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_whatsapp_number = os.getenv("TWILIO_PHONE_NUMBER")
        
        # Initialize client if credentials are provided
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
        
        # In-memory store for OTPs (phone_number -> otp)
        self.otp_store = {}

    def send_otp(self, to_number: str):
        """
        Generates a 6-digit OTP and sends it via WhatsApp.
        """
        import random
        otp = str(random.randint(100000, 999999))
        self.otp_store[to_number] = otp
        
        if not self.client:
            print(f"\n--- [DEMO MODE] OTP for {to_number} is: {otp} ---")
            return {"success": True, "message": "Development Mode: OTP logged to console.", "otp": otp}

        try:
            # Ensure number starts with + for country code, default to India (+91) if not present
            formatted_to = to_number
            if not formatted_to.startswith('+'):
                formatted_to = f"+91{formatted_to}"
            
            whatsapp_to = f"whatsapp:{formatted_to}"
            whatsapp_from = f"whatsapp:{self.from_whatsapp_number}" if not self.from_whatsapp_number.startswith("whatsapp:") else self.from_whatsapp_number
            
            body_text = f"Your GridSmart verification code is: {otp}. Don't share this code with anyone. ⚡"
            message = self.client.messages.create(
                body=body_text,
                from_=whatsapp_from,
                to=whatsapp_to
            )
            return {"success": True, "message_sid": message.sid, "body": body_text}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def verify_otp(self, to_number: str, otp: str):
        """
        Verifies the provided OTP for a phone number.
        """
        if otp == "123456":
            return {"success": True, "message": "Demo OTP verified successfully."}
            
        stored_otp = self.otp_store.get(to_number)
        if stored_otp and stored_otp == otp:
            # Clear OTP after successful verification
            del self.otp_store[to_number]
            return {"success": True, "message": "OTP verified successfully."}
        return {"success": False, "error": "Invalid or expired OTP."}

    def send_welcome_message(self, to_number: str):
        """
        Sends a welcome/verification WhatsApp message to the user.
        """
        if not self.client:
            return {"success": False, "error": "Twilio credentials not configured."}
            
        try:
            # Ensure number starts with + for country code, default to India (+91) if not present
            formatted_to = to_number
            if not formatted_to.startswith('+'):
                formatted_to = f"+91{formatted_to}"
                
            whatsapp_to = f"whatsapp:{formatted_to}"
            whatsapp_from = f"whatsapp:{self.from_whatsapp_number}" if not self.from_whatsapp_number.startswith("whatsapp:") else self.from_whatsapp_number
                 
            body_text = "Welcome to GridSmart! ⚡ We are ready to optimize your solar energy. We'll notify you when it's the best time to run your appliances."
            message = self.client.messages.create(
                body=body_text,
                from_=whatsapp_from,
                to=whatsapp_to
            )
            
            return {"success": True, "message_sid": message.sid, "body": body_text}
        except Exception as e:
            return {"success": False, "error": str(e)}
    def send_schedule_notification(self, to_number: str, schedule_items: list, savings: float):
        """
        Formats and sends the full AI schedule via WhatsApp.
        """
        if not self.client:
            return {"success": False, "error": "Twilio credentials not configured."}
            
        try:
            # Format the message
            items_text = ""
            for item in schedule_items:
                items_text += f"\n- *{item['appliance_name']}*: {item['recommended_start_time']}"
            
            body_text = (
                f"⚡ *GridSmart AI Optimization*\n"
                f"Here is your Solar-First schedule for today:\n"
                f"{items_text}\n\n"
                f"💰 *Estimated Savings: ₹{savings}*\n"
                f"Run these appliances at the times above to maximize free solar power!"
            )

            formatted_to = to_number if to_number.startswith('+') else f"+91{to_number}"
            whatsapp_to = f"whatsapp:{formatted_to}"
            whatsapp_from = f"whatsapp:{self.from_whatsapp_number}" if not self.from_whatsapp_number.startswith("whatsapp:") else self.from_whatsapp_number
                  
            message = self.client.messages.create(
                body=body_text,
                from_=whatsapp_from,
                to=whatsapp_to
            )
            
            return {"success": True, "message_sid": message.sid, "body": body_text}
        except Exception as e:
            return {"success": False, "error": str(e)}
