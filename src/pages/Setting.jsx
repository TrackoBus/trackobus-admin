import React, { useState } from 'react';
import { 
  Globe, Cpu, Bell, Shield, Save, 
  ChevronDown, Mail, Lock, Eye, EyeOff 
} from 'lucide-react';

// --- Reusable Section Wrapper ---
const SettingSection = ({ icon: Icon, title, children, iconColor }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
    <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-4 bg-white">
      <div className={`p-2.5 rounded-xl ${iconColor}`}>
        <Icon size={22} />
      </div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const Settings = () => {
  // States for Toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [autoPromotion, setAutoPromotion] = useState(true);

  // States for Password Visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const systemFont = 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

  return (
    <div className="pt-2 pr-10 pb-32 pl-0 bg-[#f8fafc] min-h-screen" style={{ fontFamily: systemFont }}>
      
      {/* Page Header */}
      <div className="-mt-3 mb-10"> 
  <p className="text-sm font-medium text-slate-500 leading-none">
    Configure TrackoBus platform behaviour
  </p>
</div>

      <div className="max-w-5xl">
        
        {/* 1. GENERAL SECTION */}
        <SettingSection icon={Globe} title="General" iconColor="text-blue-600 bg-blue-50">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">System Name</label>
              <input type="text" defaultValue="TrackoBus" className="w-full border border-slate-200 bg-white rounded-xl py-3 px-5 text-[15px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Admin Email</label>
              <input type="email" defaultValue="admin@trackobus.lk" className="w-full border border-slate-200 bg-white rounded-xl py-3 px-5 text-[15px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Timezone</label>
                <div className="relative">
                  <select className="w-full appearance-none border border-slate-200 bg-white rounded-xl py-3 px-5 text-[15px] outline-none cursor-pointer pr-12">
                    <option>Asia/Colombo</option>
                    <option>UTC (London)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Language</label>
                <div className="relative">
                  <select className="w-full appearance-none border border-slate-200 bg-white rounded-xl py-3 px-5 text-[15px] outline-none cursor-pointer pr-12">
                    <option>English</option>
                    <option>Sinhala</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>
        </SettingSection>

        {/* 2. TRACKING ENGINE */}
        <SettingSection icon={Cpu} title="Tracking Engine" iconColor="text-emerald-600 bg-emerald-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">GPS Timeout (seconds)</label>
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Mark sharer offline after N seconds</p>
              <input type="number" defaultValue="120" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Min. Sharers per Route</label>
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Trigger alert below this threshold</p>
              <input type="number" defaultValue="2" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Points per Minute Active</label>
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Reward rate for active sharers</p>
              <input type="number" defaultValue="5" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Promotion Cooldown (min)</label>
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Wait before re-promoting a backup</p>
              <input type="number" defaultValue="10" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[15px] font-bold text-slate-700">Auto-Promotion</p>
              <p className="text-xs text-slate-400 font-medium">Automatically promote backup sharer when primary drops</p>
            </div>
            <button onClick={() => setAutoPromotion(!autoPromotion)} className={`w-12 h-6 rounded-full p-1 transition-all ${autoPromotion ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-all ${autoPromotion ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </SettingSection>

        {/* 3. NOTIFICATIONS */}
        <SettingSection icon={Bell} title="Notifications" iconColor="text-purple-600 bg-purple-50">
          <div className="space-y-8">
            {[
              { label: 'Email Notifications', desc: 'Receive alerts for critical events via email', state: emailNotif, setter: setEmailNotif },
              { label: 'Push Alerts', desc: 'Browser push notifications for live events', state: pushAlerts, setter: setPushAlerts },
              { label: 'Weekly Summary Report', desc: 'Get a weekly digest every Monday morning', state: weeklyReport, setter: setWeeklyReport },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-slate-700">{item.label}</p>
                  <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                </div>
                <button onClick={() => item.setter(!item.state)} className={`w-12 h-6 rounded-full p-1 transition-all ${item.state ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${item.state ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </SettingSection>

        {/* 4. SECURITY */}
        <SettingSection icon={Shield} title="Security" iconColor="text-rose-600 bg-rose-50">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? "text" : "password"} defaultValue="password123" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-3.5 text-slate-400">
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} placeholder="••••••••" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
                  <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-3.5 text-slate-400">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl py-3 px-5 text-[15px]" />
              </div>
            </div>
          </div>
        </SettingSection>

      </div>

      {/* Floating Save Changes Button */}
      <div className="fixed bottom-10 right-10 z-30">
        <button className="bg-[#1e60ff] hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
          <Save size={20} />
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default Settings;