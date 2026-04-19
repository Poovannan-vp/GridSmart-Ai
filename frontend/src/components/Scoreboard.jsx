import { Trophy, Leaf, Smartphone, Car } from 'lucide-react';
import clsx from 'clsx';

export default function Scoreboard({ profile, impact, theme }) {
  const isHigh = theme === 'high';

  return (
    <div className={clsx(
      "p-6 rounded-3xl backdrop-blur-xl border transition-all duration-700 h-full flex flex-col",
      isHigh ? "bg-slate-900/60 border-amber-500/20" : "bg-slate-800/40 border-slate-700/50"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={clsx(
          "p-2 rounded-xl",
          isHigh ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
        )}>
          <Trophy className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Your Impact</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Score</span>
          <div className={clsx("text-3xl font-black mt-1", isHigh ? "text-amber-400" : "text-white")}>{profile?.score || 0}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Savings</span>
          <div className="text-3xl font-black mt-1 text-emerald-400">₹{profile?.total_savings_inr || 0}</div>
        </div>
      </div>

      {impact && (
        <div className="space-y-3 flex-1 flex flex-col justify-end">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-2">Climate Superhero Stats</h4>
          <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl">
            <Leaf className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm text-slate-300">Equivalent to <strong className="text-white">{impact.metrics.tree_oxygen_days} days</strong> of oxygen from a Banyan tree.</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl">
            <Smartphone className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-sm text-slate-300"><strong className="text-white">{impact.metrics.smartphone_charges}</strong> smartphone charges.</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl">
            <Car className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-sm text-slate-300">Avoided <strong className="text-white">{impact.metrics.car_km_avoided} km</strong> of petrol car emissions.</span>
          </div>
        </div>
      )}
    </div>
  );
}
