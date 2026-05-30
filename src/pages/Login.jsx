import mbg from '../assets/mbg.png'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Bus } from 'lucide-react'; // Added EyeOff
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for visibility
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const systemFont = 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

  const handleDevBypass = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isAuthenticated', 'true');
      console.log('Signed in successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${mbg})`, fontFamily: systemFont }}
    >
      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl z-10 overflow-hidden border border-white/20">
        
        {/* Blue Header Section */}
        <div className="bg-[#1e60ff] p-7 text-center text-white">
          <div className="flex justify-center items-center gap-3 mb-1">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bus size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TrackoBus</h1>
          </div>
          <p className="text-blue-100 text-[11px] font-medium opacity-80">
            Admin Console • Secure Sign-In
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 py-7 bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-400 text-sm font-medium">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Admin email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-slate-300" size={18} />
                <input 
                  type="email"
                  placeholder="admin@trackobus.lk"
                  className="w-full border border-slate-100 bg-slate-50/50 rounded-xl py-2.5 pl-12 pr-4 text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field with Toggle Logic */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-slate-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} // Switches type
                  placeholder="Enter your password"
                  className="w-full border border-slate-100 bg-slate-50/50 rounded-xl py-2.5 pl-12 pr-12 text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                {/* Eye Toggle Button */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="text-blue-600 text-xs font-bold float-right mt-2 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button 
              className="w-full bg-[#1e60ff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-100 mt-10 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleFirebaseLogin}
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : (
                <>Sign in <ArrowRight size={18} /></>
              )}
            </button>
          </div>

          {/* Demo Credentials Box */}
          <div className="mt-8 bg-blue-50/40 border border-blue-100/50 rounded-xl p-4">
            <h3 className="text-blue-700 text-[11px] font-bold mb-1.5 uppercase tracking-wider">Demo Credentials</h3>
            <div className="space-y-0.5">
              <p className="text-blue-600 text-[11px] font-medium">Email: <span className="font-bold">admin@trackobus.lk</span></p>
              <p className="text-blue-600 text-[11px] font-medium">Password: <span className="font-bold">admin123</span></p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="w-full bg-slate-50 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded-md">
            v2.4
          </span>
          <p className="text-[10px] text-slate-400 font-bold tracking-tight">
            TrackoBus • Community Transit Intelligence Platform
          </p>
        </div>
      </div>

      {/* Developer Bypass */}
      <button 
        onClick={handleDevBypass}
        className="mt-6 text-white/20 text-[10px] hover:text-white transition-colors font-bold tracking-widest"
      >
        [ DEVELOPER BYPASS ]
      </button>
    </div>
  );
};

export default Login;