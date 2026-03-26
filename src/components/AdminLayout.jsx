import { Link, Outlet, useLocation } from 'react-router-dom'

const mainMenuItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Manage Routes', to: '/manage-routes' },
  { label: 'User Rewards' },
  { label: 'System Logs' },
  { label: 'Settings' },
]

function AdminLayout() {
  const { pathname } = useLocation()
  const isDashboard = pathname === '/'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
        <div className="border-b border-slate-800 px-5 py-5">
          <h1 className="text-xl font-semibold tracking-tight">TrackoBus</h1>
          <p className="mt-1 text-sm text-slate-400">Admin Console</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Main Menu
          </p>

          <nav className="mt-3 space-y-1.5">
            {mainMenuItems.map((item) => {
              const isActive =
                item.to &&
                (pathname === item.to ||
                  (item.to !== '/' && pathname.startsWith(item.to)))

              const itemClasses = `block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`

              if (item.to) {
                return (
                  <Link key={item.label} to={item.to} className={itemClasses}>
                    {item.label}
                  </Link>
                )
              }

              return (
                <div key={item.label} className={itemClasses}>
                  {item.label}
                </div>
              )
            })}
          </nav>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              System
            </p>
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
              <p className="text-sm font-semibold text-emerald-400">System Online</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                47 buses tracked live across 12 active routes.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-3 py-4">
          <button
            type="button"
            className="w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="ml-[250px] flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-7 py-3.5 backdrop-blur">
          <div className="flex items-center justify-between gap-5">
            <div className="max-w-xl flex-1">
              <input
                type="text"
                placeholder="Search routes, users, events..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <span className="text-base">🔔</span>
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  AS
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">Ashan Silva</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-7">
          <div className="mb-5">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              {isDashboard ? 'Dashboard Overview' : 'Manage Routes'}
            </h2>
            {isDashboard ? (
              <p className="mt-1 text-sm text-slate-500">Last refreshed: 6:16:12 PM</p>
            ) : null}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
