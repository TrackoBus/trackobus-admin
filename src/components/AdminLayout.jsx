import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

// --- Icons (Kept exactly as your friend's original) ---
function DashboardIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M4 13.5C4 11.38 4 10.32 4.66 9.66C5.32 9 6.38 9 8.5 9H15.5C17.62 9 18.68 9 19.34 9.66C20 10.32 20 11.38 20 13.5V16.5C20 18.62 20 19.68 19.34 20.34C18.68 21 17.62 21 15.5 21H8.5C6.38 21 5.32 21 4.66 20.34C4 19.68 4 18.62 4 16.5V13.5Z" stroke="currentColor" strokeWidth="1.8" /><path d="M7 9V7.8C7 5.7 8.7 4 10.8 4H13.2C15.3 4 17 5.7 17 7.8V9" stroke="currentColor" strokeWidth="1.8" /></svg> }
function RoutesIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M5 6H19M5 12H14M5 18H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="17" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" /></svg> }
function RewardsIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M12 3L14.85 8.77L21 9.67L16.5 14.05L17.56 20.2L12 17.27L6.44 20.2L7.5 14.05L3 9.67L9.15 8.77L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg> }
function LogsIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M7 4H17V20H7V4Z" stroke="currentColor" strokeWidth="1.8" /><path d="M9.5 8H14.5M9.5 12H14.5M9.5 16H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> }
function SettingsIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M19 12C19 12.37 18.97 12.73 18.9 13.08L21 14.72L19 18.18L16.52 17.43C15.98 17.88 15.37 18.25 14.7 18.5L14.15 21H9.85L9.3 18.5C8.63 18.25 8.02 17.88 7.48 17.43L5 18.18L3 14.72L5.1 13.08C5.03 12.73 5 12.37 5 12C5 11.63 5.03 11.27 5.1 10.92L3 9.28L5 5.82L7.48 6.57C8.02 6.12 8.63 5.75 9.3 5.5L9.85 3H14.15L14.7 5.5C15.37 5.75 15.98 6.12 16.52 6.57L19 5.82L21 9.28L18.9 10.92C18.97 11.27 19 11.63 19 12Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg> }
function LogoutIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M9 4H6.5C5.67 4 5 4.67 5 5.5V18.5C5 19.33 5.67 20 6.5 20H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M13 8L17 12L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 12H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> }
function BrandLogo() { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-blue-400"><rect x="3" y="7" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M7 11H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M15 11H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="8" cy="18" r="1.5" fill="currentColor" /><circle cx="16" cy="18" r="1.5" fill="currentColor" /><path d="M6 7V5.8C6 5.36 6.36 5 6.8 5H17.2C17.64 5 18 5.36 18 5.8V7" stroke="currentColor" strokeWidth="1.8" /></svg> }

const mainMenuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: DashboardIcon },
  { label: 'Route Management', to: '/route-management', icon: RoutesIcon },
  { label: 'User Rewards', to: '/user-rewards', icon: RewardsIcon },
  { label: 'System Logs', to: '/system-logs', icon: LogsIcon },
  { label: 'Settings', to: '/settings', icon: SettingsIcon },
]

const pageTitleByPath = {
  '/dashboard': 'Dashboard Overview',
  '/route-management': 'Manage Bus Routes',
  '/user-rewards': 'User Rewards & Gamification',
  '/system-logs': 'System Logs',
  '/settings': 'Settings',
};

function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDashboard = pathname === '/dashboard';
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  const pageTitle = useMemo(() => {
    return pageTitleByPath[pathname] || 'Admin Panel';
  }, [pathname]);

  const lastRefreshedText = useMemo(
    () => lastRefreshedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' }),
    [lastRefreshedAt],
  );

  const handleRefresh = () => setLastRefreshedAt(new Date());

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <h1 className="text-xl font-semibold tracking-tight">TrackoBus</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">Admin Console</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Main Menu</p>
          <nav className="mt-3 space-y-1.5">
            {mainMenuItems.map((item) => {
              const isActive = pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to))
              const ItemIcon = item.icon
              return (
                <Link key={item.label} to={item.to} className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}>
                  <span className="inline-flex items-center gap-2.5"><ItemIcon /><span>{item.label}</span></span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 px-3 py-4">
          <button 
            type="button" 
            onClick={() => window.location.href = "/"}
            className="group inline-flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-red-500"
          >
            <div className="group-hover:text-red-500 transition-colors"><LogoutIcon /></div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="ml-[250px] flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-7 py-3.5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-5">
            <div className="max-w-xl flex-1">
              <input type="text" placeholder="Search routes, users, events..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white" />
            </div>

            {/* RESTORED: Notification and Profile Section */}
            <div className="flex items-center gap-4">
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50">
                <span className="text-base">🔔</span>
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">AS</div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">Ashan Silva</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-7">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">{pageTitle}</h2>
              {isDashboard && <p className="mt-1 text-sm text-slate-500">Last refreshed: {lastRefreshedText}</p>}
            </div>
            {isDashboard && (
              <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                ↻ Refresh
              </button>
            )}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;