import { Sun, CloudRain } from 'lucide-react';
import clsx from 'clsx';

export default function SolarGauge({ theme, radiation, maxRadiation }) {
  const isHigh = theme === 'high';
  
  return (
    <div className={clsx(
      "relative p-8 rounded-3xl backdrop-blur-xl border flex flex-col items-center justify-center overflow-hidden transition-all duration-700 h-full",
      isHigh 
        ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_50px_rgba(255,184,0,0.15)]" 
        : "bg-slate-800/40 border-slate-700/50"
    )}>
      {/* Background glow */}
      {isHigh && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent blur-3xl rounded-full" />
      )}
      
      <div className="relative z-10 flex flex-col items-center">
        {isHigh ? (
          <Sun className="w-16 h-16 text-amber-400 mb-4 animate-pulse duration-3000" />
        ) : (
          <CloudRain className="w-16 h-16 text-slate-400 mb-4" />
        )}
        
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">Live Solar Output</h2>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={clsx(
            "text-6xl font-black tracking-tighter transition-colors duration-700",
            isHigh ? "text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 drop-shadow-[0_0_15px_rgba(255,184,0,0.5)]" : "text-slate-300"
          )}>
            {radiation}
          </span>
          <span className="text-xl text-slate-500 font-medium">W/m²</span>
        </div>

        {/* Added Peak Radiation for Hackathon Demo visibility at night */}
        {maxRadiation > 0 && (
          <div className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-500/50" />
            Today's Peak: <span className="text-slate-400">{maxRadiation} W/m²</span>
          </div>
        )}
        
        <div className={clsx(
          "mt-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-colors",
          isHigh ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
        )}>
          {isHigh ? 'Optimum Generation' : 'Low Generation'}
        </div>
      </div>
    </div>
  );
}
