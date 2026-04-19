import React from 'react';
import { Thermometer, Droplets, Wind, Sunrise, Sunset, Sun } from 'lucide-react';
import clsx from 'clsx';

export default function WeatherReportCard({ weather, theme }) {
  if (!weather) return null;

  const { current_conditions, daily_summary, source } = weather;

  return (
    <div className={clsx(
      "p-6 rounded-3xl border transition-all duration-500 h-full",
      theme === 'high' 
        ? "bg-slate-900/50 border-slate-800 hover:border-amber-500/50" 
        : "bg-slate-800/50 border-slate-700 hover:border-blue-500/50"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Original Weather Report
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{source}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-widest border border-slate-700">
          Live Status
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Temp */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Thermometer className="w-3 h-3" />
            CURRENT
          </div>
          <div className="text-2xl font-black text-white">{current_conditions.temperature}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Feels like {current_conditions.feels_like}</div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Droplets className="w-3 h-3" />
            HUMIDITY
          </div>
          <div className="text-2xl font-black text-white">{current_conditions.humidity}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">{current_conditions.description}</div>
        </div>

        {/* Wind */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Wind className="w-3 h-3" />
            WIND SPEED
          </div>
          <div className="text-xl font-black text-white">{current_conditions.wind_speed}</div>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Sun className="w-3 h-3" />
            MAX UV
          </div>
          <div className="text-xl font-black text-white">{daily_summary.uv_index_max}</div>
        </div>
      </div>

      {/* Daily Times */}
      <div className="mt-6 flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <Sunrise className="w-4 h-4 text-amber-500" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Sunrise</div>
            <div className="text-xs font-bold text-slate-300">{daily_summary.sunrise.split('T')[1]}</div>
          </div>
        </div>
        <div className="w-12 h-[1px] bg-slate-800" />
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Sunset</div>
            <div className="text-xs font-bold text-slate-300">{daily_summary.sunset.split('T')[1]}</div>
          </div>
          <Sunset className="w-4 h-4 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
