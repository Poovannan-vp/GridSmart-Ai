import Scoreboard from '../components/Scoreboard';

export default function AnalyticsPage({ data, theme }) {
  if (!data.profile) return null;

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
        
        {/* Future expansion: Historical Charts, Settings, etc */}
        <div className="bg-slate-800/20 border border-slate-700/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-lg font-bold text-slate-300">Detailed Analytics</h3>
          <p className="text-sm text-slate-500 mt-2">Historical charts and appliance-level breakdown coming soon!</p>
        </div>
      </div>
    </div>
  );
}
