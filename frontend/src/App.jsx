import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPanel from './components/AlertsPanel';

import { fetchSolarForecast, fetchSchedule, fetchUserProfile, fetchImpactMetrics, fetchGhostPower, fetchSlabWarning } from './services/api';

// A simple navigation bar component
function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show nav on the landing page
  if (currentPath === '/') return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <nav className="flex gap-4 mb-8 border-b border-slate-800 pb-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors",
            currentPath === item.path 
              ? "bg-amber-500/10 text-amber-500" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState({
    solar: null,
    schedule: null,
    profile: null,
    impact: null,
    ghostPower: null,
    slabWarning: null
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('high');

  useEffect(() => {
    const loadData = async () => {
      try {
        const solar = await fetchSolarForecast();
        const schedule = await fetchSchedule();
        const profile = await fetchUserProfile();
        
        const savings = schedule.estimated_savings_inr || 0;
        const impact = await fetchImpactMetrics(savings / 8.5);
        const ghostPower = await fetchGhostPower();
        const slabWarning = await fetchSlabWarning();

        setData({ solar, schedule, profile, impact, ghostPower, slabWarning });
        
        if (solar.current_state === 'low') {
          setTheme('low');
        } else {
          setTheme('high');
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">Loading GridSmart...</div>;

  return (
    <Router>
      <div className={clsx(
        "min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-1000",
        theme === 'high' ? "bg-slate-950" : "bg-slate-900"
      )}>
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-2">
                <span className="text-amber-500">Grid</span>Smart
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Zero-Hardware Energy Intelligence</p>
            </Link>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme(t => t === 'high' ? 'low' : 'high')}
                className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Theme
              </button>
              {isLoggedIn && (
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              )}
            </div>
          </header>

          {/* Router Navigation */}
          {isLoggedIn && <Navigation />}

          {/* Global Alerts (Show on Dashboard & Analytics) */}
          <Routes>
             <Route path="/" element={null} />
             <Route path="*" element={
               isLoggedIn ? (
                 <AlertsPanel 
                    slabWarning={data.slabWarning} 
                    ghostPower={data.ghostPower} 
                    solarAlerts={data.solar?.alerts}
                  />
               ) : null
             } />
          </Routes>

          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<LandingPage onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/dashboard" element={isLoggedIn ? <DashboardPage data={data} theme={theme} /> : <LandingPage onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/analytics" element={isLoggedIn ? <AnalyticsPage data={data} theme={theme} /> : <LandingPage onLogin={() => setIsLoggedIn(true)} />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;
