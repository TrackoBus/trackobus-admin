import React, { useState } from 'react';
import { Globe, Cpu, Bell, Shield, Save, ChevronDown, Eye, EyeOff } from 'lucide-react';

const SettingSection = ({ icon: Icon, title, children, iconColor }) => (
  <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-white">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon size={20} />
      </div>
      <h2 className="font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Settings = () => {
  const [autoPromotion, setAutoPromotion] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* The "Push Right" Container 
          We use a huge left padding (pl-[300px]) to move the design 
          away from the sidebar area.
      */}
      <div className="py-10 pr-10 pl-[320px]">
        
        {/* Constrain width so it matches the screenshot's proportions */}
        <div className="max-w-[1000px]">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Configure TrackoBus platform behaviour</p>
          </div>

          {/* 1. General */}
          <SettingSection icon={Globe} title="General" iconColor="text-blue-500 bg-blue-50">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">System Name</label>
                <input type="text" defaultValue="TrackoBus" className="w-full border border-slate-100 bg-white rounded-xl py-2.5 px-4 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Admin Email</label>
                <input type="email" defaultValue="admin@trackobus.lk" className="w-full border border-slate-100 bg-white rounded-xl py-2.5 px-4 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Timezone</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-slate-100 bg-white rounded-xl py-2.5 px-4 text-sm outline-none">
                      <option>Asia/Colombo</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-2.5 text-slate-400" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Language</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-slate-100 bg-white rounded-xl py-2.5 px-4 text-sm outline-none">
                      <option>English</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-2.5 text-slate-400" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </SettingSection>

          {/* 2. Tracking Engine */}
          <SettingSection icon={Cpu} title="Tracking Engine" iconColor="text-emerald-500 bg-emerald-50">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800">GPS Timeout (seconds)</label>
                <p className="text-[11px] text-slate-400 mb-2">Mark sharer offline after N seconds</p>
                <input type="text" defaultValue="120" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800">Min. Sharers per Route</label>
                <p className="text-[11px] text-slate-400 mb-2">Trigger alert below this threshold</p>
                <input type="text" defaultValue="2" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800">Points per Minute Active</label>
                <p className="text-[11px] text-slate-400 mb-2">Reward rate for active sharers</p>
                <input type="text" defaultValue="5" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800">Promotion Cooldown (min)</label>
                <p className="text-[11px] text-slate-400 mb-2">Wait before re-promoting a backup</p>
                <input type="text" defaultValue="10" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
              <div>
                <p className="text-sm font-bold text-slate-700">Auto-Promotion</p>
                <p className="text-xs text-slate-400">Automatically promote backup sharer when primary drops</p>
              </div>
              <button onClick={() => setAutoPromotion(!autoPromotion)} className={`w-11 h-6 rounded-full transition-all ${autoPromotion ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${autoPromotion ? 'ml-6' : 'ml-1'}`} />
              </button>
            </div>
          </SettingSection>

          {/* 3. Notifications */}
          <SettingSection icon={Bell} title="Notifications" iconColor="text-purple-500 bg-purple-50">
            <div className="space-y-6">
              {[
                { label: 'Email Notifications', desc: 'Receive alerts for critical events via email', active: emailNotif, setter: setEmailNotif },
                { label: 'Push Alerts', desc: 'Browser push notifications for live events', active: pushAlerts, setter: setPushAlerts },
                { label: 'Weekly Summary Report', desc: 'Get a weekly digest every Monday morning', active: weeklyReport, setter: setWeeklyReport },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button onClick={() => item.setter(!item.active)} className={`w-11 h-6 rounded-full transition-all ${item.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'ml-6' : 'ml-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </SettingSection>

          {/* 4. Security */}
          <SettingSection icon={Shield} title="Security" iconColor="text-rose-500 bg-rose-50">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Current Password</label>
                <div className="relative">
                  <input type="password" defaultValue="password123" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
                  <Eye className="absolute right-4 top-2.5 text-slate-300" size={18} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">New Password</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
                    <Eye className="absolute right-4 top-2.5 text-slate-300" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
                </div>
              </div>
            </div>
          </SettingSection>

          {/* The Save Button 
              Sitting at the bottom-right of the final card.
          */}
          <div className="flex justify-end mt-4">
            <button className="bg-[#1e60ff] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center gap-2 transition-all">
              <Save size={18} />
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;