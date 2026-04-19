import { Zap, Clock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function ScheduleCard({ scheduleData, theme }) {
  const isHigh = theme === 'high';

  if (!scheduleData || !scheduleData.schedule) return null;

  return (
    <div className={clsx(
      "p-6 rounded-3xl backdrop-blur-xl border transition-all duration-700",
      isHigh ? "bg-slate-900/60 border-amber-500/20" : "bg-slate-800/40 border-slate-700/50"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={clsx(
          "p-2 rounded-xl",
          isHigh ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"
        )}>
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">AI Recommended Schedule</h3>
      </div>

      <div className="space-y-4">
        {scheduleData.schedule.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-2xl bg-slate-900/50 border border-slate-700/30">
            <div>
              <h4 className="font-semibold text-slate-200">{item.appliance_name}</h4>
              <p className="text-sm text-slate-400 mt-1">{item.reason}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex flex-col items-end">
                <span className="text-sm text-slate-500 uppercase tracking-wider text-[10px] font-bold">Start Time</span>
                <span className={clsx(
                  "font-mono font-bold text-lg",
                  isHigh ? "text-amber-400" : "text-slate-300"
                )}>{item.recommended_start_time}</span>
              </div>
              <button className={clsx(
                "ml-auto sm:ml-4 p-2.5 rounded-full transition-colors",
                isHigh ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : "bg-slate-700 hover:bg-slate-600 text-white"
              )}>
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-between">
        <span className="text-slate-400 text-sm">{scheduleData.daily_summary_message}</span>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Zap className="w-4 h-4" />
          <span>Save ₹{scheduleData.estimated_savings_inr}</span>
        </div>
      </div>
    </div>
  );
}
