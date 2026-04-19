// api.js

const API_BASE_URL = "http://localhost:8007";

// We are using mock data initially to perfect the UI design as requested.
// Once ready, we can switch to fetching from the real FastAPI backend.

export const fetchSolarForecast = async (lat = 13.0827, lon = 80.2707) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solar/forecast?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    
    // Add a helper for the frontend theme based on first hour radiation
    const firstHourRadiation = data.hourly_forecast?.[0]?.radiation_w_m2 || 0;
    data.current_state = firstHourRadiation > 500 ? "high" : "low";
    
    return data;
  } catch (error) {
    console.error("Error fetching solar forecast:", error);
    return { success: false, error: "Failed to connect to solar service" };
  }
};

export const fetchSchedule = async (lat = 13.0827, lon = 80.2707, appliances) => {
  try {
    const defaultAppliances = [
      { name: "Washing Machine", power_watts: 500, duration_hours: 1.5 },
      { name: "Geyser", power_watts: 2000, duration_hours: 0.5 },
      { name: "AC", power_watts: 1500, duration_hours: 2.0 }
    ];
    
    const finalAppliances = appliances || defaultAppliances;

    const response = await fetch(`${API_BASE_URL}/api/schedule/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, appliances: finalAppliances })
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating schedule:", error);
    return { schedule: [] };
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { score: 0, total_savings_inr: 0.0 };
  }
};

export const fetchImpactMetrics = async (kwh) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/impact/convert?kwh=${kwh}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching impact metrics:", error);
    return { metrics: { tree_oxygen_days: 0, smartphone_charges: 0, car_km_avoided: 0 } };
  }
};

export const fetchGhostPower = async (watts = 200) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/advisor/ghost-power?current_load_watts=${watts}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching ghost power:", error);
    return { active: false };
  }
};

export const fetchSlabWarning = async (consumption = 492) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/advisor/slab-warning?consumption_kwh=${consumption}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching slab warning:", error);
    return { active: false };
  }
};

export const sendOtp = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: "Failed to connect to notification service" };
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber, otp: otp }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Failed to connect to verification service" };
  }
};

export const sendWelcomeNotification = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: "Failed to connect to notification service" };
  }
};

export const sendScheduleNotification = async (phoneNumber, scheduleItems, savings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/send-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phone_number: phoneNumber,
        schedule_items: scheduleItems,
        savings: savings
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending schedule:", error);
    return { success: false, error: "Failed to connect to notification service" };
  }
};
