import React from 'react';

// --- Small helper for the placeholder pages ---
function PlaceholderPage({ title, description }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </section>
  );
}

// --- This is your actual Dashboard Content ---
function Dashboard() {
  const statCards = [
    {
      title: 'Active Tracked Buses',
      value: '47',
      change: '+3 vs last hour',
      changeColor: 'text-emerald-600',
      accent: 'LIVE',
    },
    {
      title: 'Community Sharers',
      value: '128',
      change: '+12 vs last hour',
      changeColor: 'text-emerald-600',
    },
    {
      title: 'Primary—Backup Promotions',
      value: '14',
      change: '-2 vs last hour',
      changeColor: 'text-rose-500',
    },
    {
      title: 'Total Points Rewarded',
      value: '9,832',
      change: '+541 vs last hour',
      changeColor: 'text-emerald-600',
    },
  ];

  return (
    <section className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-700">{card.title}</h3>
                {card.accent ? (
                  <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                    {card.accent}
                  </p>
                ) : null}
              </div>
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
            </div>

            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className={`mt-5 text-sm font-medium ${card.changeColor}`}>{card.change}</p>
          </article>
        ))}
      </div>

      {/* Map Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-xl font-bold text-slate-900">
            Live System Map — Colombo, Sri Lanka
          </h3>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              6 buses visible
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
              4 active routes
            </span>
          </div>
        </div>

        <div className="relative h-[360px] bg-slate-100">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute left-[18%] top-0 h-full w-[11%] bg-blue-100/70" />

          <div className="absolute left-[26%] top-[18%] h-1 w-[25%] rounded-full bg-emerald-500" />
          <div className="absolute left-[50%] top-[18%] h-[28%] w-1 rounded-full bg-emerald-500" />
          <div className="absolute left-[28%] top-[42%] h-1 w-[28%] rounded-full bg-blue-500" />
          <div className="absolute left-[56%] top-[42%] h-1 w-[26%] rounded-full bg-blue-500" />
          <div className="absolute left-[39%] top-[22%] h-[45%] w-1 rotate-[38deg] rounded-full bg-violet-500" />
          <div className="absolute left-[30%] top-[68%] h-1 w-[14%] rotate-[32deg] rounded-full bg-amber-500" />

          <div className="absolute left-[44%] top-[46%] flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg">139</div>
          <div className="absolute left-[56%] top-[55%] flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg">120</div>
          <div className="absolute left-[63%] top-[38%] flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white shadow-lg">177</div>
          <div className="absolute left-[32%] top-[72%] flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-lg">184</div>
          <div className="absolute left-[74%] top-[64%] flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg">400</div>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;