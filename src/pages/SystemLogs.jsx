import { useMemo, useState } from 'react'
import { AlertCircle, AlertTriangle, Filter, Info, Search } from 'lucide-react'

const weekOneLogs = [
  {
    id: 'log-001',
    time: 'Mon 09:12',
    level: 'info',
    message: 'Backup sharer pool synchronized for Route 120.',
    source: 'Sharer Service',
  },
  {
    id: 'log-002',
    time: 'Mon 13:45',
    level: 'warning',
    message: 'High reward redemption volume detected near Pettah terminal.',
    source: 'Rewards Engine',
  },
  {
    id: 'log-003',
    time: 'Tue 08:03',
    level: 'error',
    message: 'GPS API request failed for bus 177: timeout from upstream provider.',
    source: 'Tracking Gateway',
  },
  {
    id: 'log-004',
    time: 'Wed 17:20',
    level: 'info',
    message: 'Daily route cache refreshed and dispatched to admin clients.',
    source: 'Route Cache',
  },
  {
    id: 'log-005',
    time: 'Thu 11:34',
    level: 'warning',
    message: 'Redemption webhook retried after delayed confirmation from payment partner.',
    source: 'Webhook Worker',
  },
]

const levelMeta = {
  info: {
    label: 'Info',
    icon: Info,
    classes: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    classes: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  },
}

function LevelBadge({ level }) {
  const meta = levelMeta[level]
  const Icon = meta.icon

  return (
    <span
      className={
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ' +
        meta.classes
      }
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  )
}

function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return weekOneLogs
    }

    return weekOneLogs.filter((log) => {
      const searchable = [log.time, log.level, log.message, log.source].join(' ').toLowerCase()
      return searchable.includes(query)
    })
  }, [searchQuery])

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Logs</h2>
        <p className="text-sm text-slate-600">
          Track audit trails, platform alerts, and operational events from Week 1 development.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search logs by message, source, level, or time..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Time
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Level
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
                    {log.time}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <LevelBadge level={log.level} />
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">{log.message}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {log.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="border-t border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
            No logs matched your search.
          </div>
        ) : null}
      </section>
    </section>
  )
}

export default SystemLogs
