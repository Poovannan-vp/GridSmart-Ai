import { useState } from 'react';
import { ArrowRight, Zap, Phone, Loader2, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../services/api';

export default function LandingPage({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setLoading(true);
      try {
        const result = await sendOtp(phone);
        if (result.success) {
          setShowOtpInput(true);
          alert(`OTP sent to ${phone}. (Check server console if not configured)`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setLoading(true);
      try {
        const result = await verifyOtp(phone, otp);
        if (result.success) {
          alert("Success! Your account is verified.");
          if (onLogin) onLogin();
          navigate('/dashboard');
        } else {
          alert(`Verification Error: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 max-w-lg mx-auto">
      <div className="p-4 bg-amber-500/10 rounded-3xl mb-8 border border-amber-500/20 shadow-[0_0_40px_rgba(255,184,0,0.1)]">
        <Zap className="w-16 h-16 text-amber-400" />
      </div>
      
      <h1 className="text-5xl font-black tracking-tighter text-white mb-4">
        Meet <span className="text-amber-500">Grid</span>Smart
      </h1>
      
      <p className="text-lg text-slate-400 mb-12">
        India's first "Zero-Hardware" energy intelligence platform. Connect via WhatsApp and start optimizing your heavy appliances automatically.
      </p>

      <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp} className="w-full space-y-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
        {!showOtpInput ? (
          <div className="text-left animate-in slide-in-from-left-4 duration-300">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Connect your WhatsApp</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
          </div>
        ) : (
          <div className="text-left animate-in slide-in-from-right-4 duration-300">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Enter 6-digit Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white tracking-[1em] font-mono text-center placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
            <button 
              type="button" 
              onClick={() => setShowOtpInput(false)}
              className="text-xs text-amber-500 mt-2 hover:underline"
            >
              Change number?
            </button>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>{showOtpInput ? 'Verify Code' : 'Start Saving'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
