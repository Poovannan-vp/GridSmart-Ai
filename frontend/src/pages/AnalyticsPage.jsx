import Scoreboard from '../components/Scoreboard';

export default function AnalyticsPage({ data, theme }) {
  if (!data.profile || !data.schedule) return null;
  const totalSavings = data.schedule.estimated_savings_inr || 0;

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Analytics</h2>
        <p className="text-slate-400 text-sm mt-1">Track your impact and historical savings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Scoreboard & Gamification */}
        <div className="h-full">
          <Scoreboard profile={data.profile} impact={data.impact} theme={theme} />
        </div>
        
        {/* Financial Impact Comparison */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-6">Financial Impact: AI vs. Manual</h2>
            
            <div className="space-y-6">
              {/* Comparison Bars */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Manual (No AI)</span>
                    <span>₹{Math.round(totalSavings * 4)} / mo</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 w-[100%]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-emerald-500 uppercase">
                    <span>GridSmart AI</span>
                    <span>₹{Math.round(totalSavings * 1.2)} / mo</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-emerald-500/20">
                    <div className="h-full bg-emerald-500 w-[30%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Monthly Savings</p>
                    <p className="text-2xl font-black text-emerald-400">₹{Math.round(totalSavings * 2.8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">ROI (Months)</p>
                    <p className="text-2xl font-black text-white">0.0</p>
                    <p className="text-[8px] text-emerald-500 italic uppercase font-black">Zero Hardware Cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-red-500/20 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-1">The "Lazy Tax"</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-6">Wasted Money per Year</p>
            
            <div className="flex flex-col items-center justify-center">
              <p className="text-5xl font-black text-white tracking-tighter">₹{Math.round(totalSavings * 34)}</p>
              <p className="text-[10px] font-black text-red-500 uppercase mt-2 tracking-widest">Without AI Optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
