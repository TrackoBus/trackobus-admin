const cardThemeByCategory = {
	Telecom: 'bg-blue-50 border-blue-100',
	Grocery: 'bg-emerald-50 border-emerald-100',
	Retail: 'bg-violet-50 border-violet-100',
}

const badgeThemeByCategory = {
	Telecom: 'bg-blue-100 text-blue-700',
	Grocery: 'bg-emerald-100 text-emerald-700',
	Retail: 'bg-violet-100 text-violet-700',
}

function formatPoints(points) {
	if (typeof points === 'number') {
		return points.toLocaleString('en-US')
	}

	return points
}

function RewardCard({ title, provider, category, points, stock, icon }) {
	const isOutOfStock = typeof stock === 'string' && stock.toLowerCase().includes('out of stock')
	const cardTheme = cardThemeByCategory[category] ?? 'bg-slate-50 border-slate-200'
	const badgeTheme = badgeThemeByCategory[category] ?? 'bg-slate-100 text-slate-700'

	return (
		<article className={`rounded-xl border p-4 ${cardTheme}`}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-start gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-base font-bold text-slate-700 shadow-sm">
						{icon}
					</div>

					<div className="min-w-0">
						<h3 className="truncate text-base font-semibold text-slate-900">{title}</h3>
						<p className="mt-0.5 truncate text-sm text-slate-600">{provider}</p>
					</div>
				</div>

				<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTheme}`}>
					{category}
				</span>
			</div>

			<div className="mt-4 flex items-center justify-between gap-3 border-t border-white/70 pt-3 text-sm">
				<p className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
					<span className="text-amber-500" aria-hidden="true">
						★
					</span>
					{formatPoints(points)} pts
				</p>

				<p className={`font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
					{stock}
				</p>
			</div>
		</article>
	)
}

export default RewardCard
