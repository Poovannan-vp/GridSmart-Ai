import SolarGauge from '../components/SolarGauge';
import ScheduleCard from '../components/ScheduleCard';
import WeatherReportCard from '../components/WeatherReportCard';
import { sendWelcomeNotification, sendScheduleNotification, fetchSolarForecast, fetchSchedule } from '../services/api';
import { Zap, MessageSquare, Clock, Home, MapPin, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const CITIES = {
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Delhi": { lat: 28.6139, lon: 77.2090 },
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Bangalore": { lat: 12.9716, lon: 77.5946 }
};

const COMMON_APPLIANCES = [
  { name: "Washing Machine", power_watts: 500, duration_hours: 1.5 },
  { name: "Geyser", power_watts: 2000, duration_hours: 0.5 },
  { name: "AC", power_watts: 1500, duration_hours: 2.0 },
  { name: "Dishwasher", power_watts: 1200, duration_hours: 1.0 },
  { name: "EV Charger", power_watts: 3000, duration_hours: 4.0 }
];

export default function DashboardPage({ data: initialData, theme: initialTheme }) {
  const [data, setData] = useState(initialData);
  const [theme, setTheme] = useState(initialTheme);
  const [loading, setLoading] = useState(false);
  
  // User Inputs State
  const [city, setCity] = useState("Chennai");
  const [systemSize, setSystemSize] = useState(3); // Default 3kW
  const [myAppliances, setMyAppliances] = useState([
    COMMON_APPLIANCES[0],
    COMMON_APPLIANCES[1],
    COMMON_APPLIANCES[2]
  ]);

  const [sending, setSending] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  // Re-fetch when city or appliances change
  const refreshOptimization = async () => {
    setLoading(true);
    try {
      const coords = CITIES[city];
      const solar = await fetchSolarForecast(coords.lat, coords.lon);
      const schedule = await fetchSchedule(coords.lat, coords.lon, myAppliances);
      setData({ ...data, solar, schedule });
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAlert = async () => {
    const phone = prompt("Enter your phone number (e.g. +91XXXXXXXXXX) to receive the demo alert:");
    if (!phone) return;
    
    setSending(true);
    try {
      const result = await sendWelcomeNotification(phone);
      if (result.success) {
        setLastMessage(result.body);
        alert("Hackathon Alert Sent! Check your WhatsApp. ⚡");
      }
    } catch (err) {
      alert("Failed to send alert. Check console.");
    } finally {
      setSending(false);
    }
  };

  const handleSendSchedule = async () => {
    const phone = prompt("Enter your phone number to receive your full AI Schedule:");
    if (!phone) return;
    
    setSending(true);
    try {
      const result = await sendScheduleNotification(
        phone, 
        data.schedule.schedule, 
        data.schedule.estimated_savings_inr
      );
      if (result.success) {
        setLastMessage(result.body);
        alert("Schedule sent to WhatsApp! 📅");
      }
    } catch (err) {
      alert("Failed to send schedule.");
    } finally {
      setSending(false);
    }
  };

  if (!data.solar) return null;
  const currentRadiation = data.solar.current_radiation || 0;
  
  // Find the peak radiation of the day for the demo
  const maxRadiation = Math.max(...(data.solar.hourly_forecast?.map(h => h.radiation_w_m2) || [0]));

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-900/80 border border-slate-700/50 rounded-3xl backdrop-blur-md">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <MapPin className="w-4 h-4" />
            SELECT REGION
          </div>
          <select 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="text-[10px] text-slate-500 italic">Adjusts solar radiation forecasts based on geography.</p>
        </div>

        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Home className="w-4 h-4" />
              MY APPLIANCES
            </div>
            <button 
              onClick={refreshOptimization}
              disabled={loading}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <RefreshCw className={clsx("w-3 h-3", loading && "animate-spin")} />
              {loading ? 'Optimizing...' : 'Re-Optimize Now'}
            </button>
          </div>
          
          <div className="space-y-3">
            {myAppliances.map((app, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="flex-1 text-xs text-white font-medium">{app.name}</span>
                <div className="flex items-center gap-2">
                  <select 
                    value={app.preferred_window || "Flexible"}
                    onChange={(e) => {
                      const newApps = [...myAppliances];
                      newApps[idx].preferred_window = e.target.value;
                      setMyAppliances(newApps);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-400 font-bold focus:outline-none"
                  >
                    <option value="Flexible">Flexible</option>
                    <option value="Morning">Morning (6-10AM)</option>
                    <option value="Afternoon">Afternoon (12-4PM)</option>
                    <option value="Night">Night (10PM-6AM)</option>
                  </select>
                  <input 
                    type="number"
                    value={app.power_watts}
                    onChange={(e) => {
                      const newApps = [...myAppliances];
                      newApps[idx].power_watts = parseInt(e.target.value) || 0;
                      setMyAppliances(newApps);
                    }}
                    className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-amber-500 font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">W</span>
                </div>
                <button 
                  onClick={() => setMyAppliances(myAppliances.filter((_, i) => i !== idx))}
                  className="p-1.5 hover:text-red-500 text-slate-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
              <span className="w-full text-[10px] text-slate-500 font-bold uppercase mb-1">Add Common:</span>
              {COMMON_APPLIANCES.filter(ca => !myAppliances.some(ma => ma.name === ca.name)).map((app) => (
                <button
                  key={app.name}
                  onClick={() => setMyAppliances([...myAppliances, { ...app }])}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-400 hover:border-slate-600 transition-all"
                >
                  + {app.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Hackathon Demo Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Zap className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hackathon Mode Active</h4>
              <p className="text-[10px] text-slate-400">Trigger manual WhatsApp alerts for judges</p>
            </div>
          </div>
          <div className="flex gap-2">
          <button 
            onClick={handleDemoAlert}
            disabled={sending}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-amber-500/30 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            <MessageSquare className="w-3 h-3" />
            {sending ? 'Sending...' : 'Trigger Welcome'}
          </button>
          <button 
            onClick={handleSendSchedule}
            disabled={sending}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            <Clock className="w-3 h-3" />
            {sending ? 'Sending...' : 'Send Schedule to WhatsApp'}
          </button>
        </div>
        </div>

        {lastMessage && (
          <div className="mt-2 p-3 bg-slate-950/80 border border-amber-500/30 rounded-xl animate-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 mb-1 italic">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              LAST SENT TO WHATSAPP:
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              "{lastMessage}"
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column: Solar Gauge */}
        <div className="flex flex-col h-full">
          <SolarGauge theme={theme} radiation={currentRadiation} />
        </div>

        {/* Right Column: Solar Harvest & Weather Report */}
        <div className="space-y-6">
          {/* Solar Harvest Breakdown */}
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-amber-500 uppercase tracking-widest">Live Solar Harvest</h2>
              <select 
                value={systemSize}
                onChange={(e) => setSystemSize(parseFloat(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-amber-500 font-black focus:outline-none"
              >
                <option value="1">1kW (Small)</option>
                <option value="3">3kW (Standard)</option>
                <option value="5">5kW (Large)</option>
                <option value="10">10kW (Commercial)</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Radiation</p>
                <p className="text-xl font-black text-white">{currentRadiation}<span className="text-[10px] ml-1">W/m²</span></p>
              </div>
              <div className="space-y-1 border-x border-slate-800 px-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Generation</p>
                <p className="text-xl font-black text-emerald-400">{(currentRadiation * (systemSize / 1000)).toFixed(2)}<span className="text-[10px] ml-1">kW</span></p>
              </div>
              <div className="space-y-1 pl-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Value</p>
                <p className="text-xl font-black text-amber-400">₹{(currentRadiation * (systemSize / 1000) * 8.5).toFixed(2)}<span className="text-[10px] ml-1">/hr</span></p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-[9px] text-slate-500 italic">
                * Simulated for a {systemSize}kW rooftop installation at ₹8.5/unit grid tariff.
              </p>
            </div>
          </div>

          <WeatherReportCard weather={data.solar.weather_report} theme={theme} />
        </div>
      </div>

      {/* Full Width Row: Schedule */}
      <div className="w-full">
        <ScheduleCard scheduleData={data.schedule} theme={theme} />
      </div>
    </div>
  );
}
