import { AlertTriangle, Ghost } from 'lucide-react';
import clsx from 'clsx';

export default function AlertsPanel({ slabWarning, ghostPower, solarAlerts }) {
  const hasAlerts = slabWarning?.active || ghostPower?.active || (solarAlerts && solarAlerts.length > 0);

  if (!hasAlerts) return null;

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Slab Warning */}
      {slabWarning?.active && (
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-red-500/20 rounded-xl text-red-400 mt-1">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-1">Critical Gold Warning</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{slabWarning.nudge}</p>
          </div>
        </div>
      )}

      {/* Solar Drop Alerts */}
      {solarAlerts && solarAlerts.length > 0 && solarAlerts.map((alert, idx) => (
        <div key={idx} className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-4">
           <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 mt-1">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-amber-100 text-sm leading-relaxed font-medium mt-2">{alert}</p>
        </div>
      ))}

      {/* Ghost Power */}
      {ghostPower?.active && (
        <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
              <Ghost className="w-5 h-5" />
            </div>
            <h4 className="text-purple-300 font-bold text-lg">{ghostPower.title}</h4>
          </div>
          <p className="text-slate-300 text-sm mb-4">{ghostPower.message}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ghostPower.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
