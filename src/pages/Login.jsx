import mbg from '../assets/mbg.png'; // Change 'login-bg.jpg' to your filename
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, ArrowRight, Bus } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Week 1: Dev Bypass Logic
  const handleDevBypass = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
  <div 
    className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: `url(${mbg})` }}
  >
    
      
     
      <div className="w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl z-10">
        {/* Blue Header Section */}
        <div className="bg-[#1e4ed8] p-8 text-center text-white">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Bus size={28} />
            <h1 className="text-2xl font-bold tracking-tight">TrackoBus</h1>
          </div>
          <p className="text-blue-100 text-sm opacity-90">Admin Console · Secure Sign-In</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to access the admin dashboard</p>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email"
                  placeholder="admin@trackobus.lk"
                  className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Eye className="absolute right-3 top-3 text-gray-400 cursor-pointer" size={18} />
              </div>
              <button className="text-blue-600 text-xs font-bold float-right mt-3 hover:underline">Forgot Password?</button>
            </div>

            {/* Sign In Button */}
            <button 
              className="w-full bg-[#1e4ed8] hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-200 mt-12"
              onClick={() => navigate('/routes')}
            >
              Sign In <ArrowRight size={18} />
            </button>
          </div>

          {/* Demo Credentials Box */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="text-blue-700 text-xs font-bold mb-1">Demo Credentials</h3>
            <p className="text-blue-600 text-xs leading-relaxed">
              Email: admin@trackobus.lk <br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-gray-500 text-xs opacity-70">
        TrackoBus v2.4 · Community Transit Intelligence Platform
      </p>

      {/* DEV BYPASS BUTTON */}
      <button 
        onClick={handleDevBypass}
        className="mt-4 text-gray-600 text-[10px] hover:text-blue-400 transition-colors uppercase tracking-widest font-bold"
      >
        [ Developer Bypass ]
      </button>
    </div>
  );
};

export default Login;