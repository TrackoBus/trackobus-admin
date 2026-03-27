const kpiCards = [
	{
		label: 'Pending Requests',
		value: '4',
		cardClassName: 'bg-amber-50 border-amber-100',
		valueClassName: 'text-amber-600',
	},
	{
		label: 'Fulfilled',
		value: '3',
		cardClassName: 'bg-emerald-50 border-emerald-100',
		valueClassName: 'text-emerald-600',
	},
	{
		label: 'Rejected',
		value: '1',
		cardClassName: 'bg-rose-50 border-rose-100',
		valueClassName: 'text-rose-600',
	},
	{
		label: 'Points Redeemed',
		value: '10,200',
		cardClassName: 'bg-violet-50 border-violet-100',
		valueClassName: 'text-violet-700',
	},
]

const rewardItems = [
	{
		id: 1,
		icon: 'DR',
		title: 'Dialog Rs. 100 Data Reload',
		provider: 'Dialog Axiata',
		category: 'Telecom',
		points: 500,
		stock: '48 left',
		bgClassName: 'bg-slate-100 border-slate-200',
	},
	{
		id: 2,
		icon: 'KV',
		title: 'Keells Rs. 500 Voucher',
		provider: 'Keells Super',
		category: 'Grocery',
		points: 2500,
		stock: '12 left',
		bgClassName: 'bg-emerald-50 border-emerald-100',
	},
	{
		id: 3,
		icon: 'MC',
		title: 'Mobitel Rs. 150 Credit',
		provider: 'Mobitel',
		category: 'Telecom',
		points: 750,
		stock: '35 left',
		bgClassName: 'bg-purple-50 border-purple-100',
	},
	{
		id: 4,
		icon: 'CV',
		title: 'Cargills Rs. 250 Voucher',
		provider: 'Cargills Food City',
		category: 'Grocery',
		points: 1200,
		stock: '20 left',
		bgClassName: 'bg-amber-50 border-amber-100',
	},
	{
		id: 5,
		icon: 'AD',
		title: 'Airtel Rs. 200 Data',
		provider: 'Airtel Lanka',
		category: 'Telecom',
		points: 1000,
		stock: 'Out of stock',
		bgClassName: 'bg-rose-50 border-rose-100',
	},
	{
		id: 6,
		icon: 'AV',
		title: 'Arpico Rs. 300 Voucher',
		provider: 'Arpico Supercentre',
		category: 'Retail',
		points: 1500,
		stock: '8 left',
		bgClassName: 'bg-cyan-50 border-cyan-100',
	},
]

const redemptionRequests = [
	{
		id: 1,
		user: 'Kasun Perera',
		email: 'kasun.p@gmail.com',
		reward: 'Dialog Rs. 100 Data Reload',
		points: 500,
		date: '2026-03-19',
		status: 'Pending',
	},
	{
		id: 2,
		user: 'Nimali Fernando',
		email: 'nimali.f@yahoo.com',
		reward: 'Keells Rs. 500 Voucher',
		points: 2500,
		date: '2026-03-18',
		status: 'Fulfilled',
	},
	{
		id: 3,
		user: 'Ravindu Peris',
		email: 'ravindu.p@gmail.com',
		reward: 'Airtel Rs. 200 Data',
		points: 1000,
		date: '2026-03-17',
		status: 'Rejected',
	},
	{
		id: 4,
		user: 'Tharushi Jayasinghe',
		email: 'tharushi.j@outlook.com',
		reward: 'Arpico Rs. 300 Voucher',
		points: 1500,
		date: '2026-03-16',
		status: 'Pending',
	},
]

const categoryClassByName = {
	Telecom: 'bg-blue-100 text-blue-700',
	Grocery: 'bg-emerald-100 text-emerald-700',
	Retail: 'bg-violet-100 text-violet-700',
}

const statusClassByName = {
	Pending: 'bg-amber-100 text-amber-700',
	Fulfilled: 'bg-emerald-100 text-emerald-700',
	Rejected: 'bg-rose-100 text-rose-700',
}

function formatPoints(points) {
	return points.toLocaleString('en-US')
}

function UserRewards() {
	return (
		<section className="space-y-6">
			<div>
				
				<p className="mt-1.5 text-sm text-slate-600 sm:text-base">
					Manage the reward catalog and process redemption requests
				</p>
			</div>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{kpiCards.map((card) => (
					<article
						key={card.label}
						className={`rounded-2xl border p-5 shadow-sm ${card.cardClassName}`}
					>
						<p className="text-sm font-medium text-slate-600">{card.label}</p>
						<p className={`mt-3 text-4xl font-bold tracking-tight ${card.valueClassName}`}>
							{card.value}
						</p>
					</article>
				))}
			</section>

			<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
				<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="text-2xl font-bold text-slate-900">Reward Catalog</h2>
						<p className="mt-1 text-sm text-slate-500">6 items</p>
					</div>

					<button
						type="button"
						className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
					>
						Add Reward
					</button>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{rewardItems.map((item) => {
						const isOutOfStock = item.stock === 'Out of stock'

						return (
							<article
								key={item.id}
								className={`rounded-2xl border p-4 ${item.bgClassName}`}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="flex min-w-0 items-start gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-700 shadow-sm">
											{item.icon}
										</div>

										<div className="min-w-0">
											<h3 className="truncate text-base font-semibold text-slate-900">
												{item.title}
											</h3>
											<p className="mt-0.5 text-sm text-slate-600">{item.provider}</p>
										</div>
									</div>

									<span
										className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryClassByName[item.category]}`}
									>
										{item.category}
									</span>
								</div>

								<div className="mt-4 flex items-center justify-between gap-3 border-t border-white/60 pt-3 text-sm">
									<p className="font-semibold text-slate-900">{formatPoints(item.points)} pts</p>
									<p
										className={`font-semibold ${
											isOutOfStock ? 'text-rose-600' : 'text-emerald-600'
										}`}
									>
										{item.stock}
									</p>
								</div>
							</article>
						)
					})}
				</div>
			</section>

			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div className="border-b border-slate-200 px-5 py-4 sm:px-6">
					<h2 className="text-2xl font-bold text-slate-900">Redemption Requests</h2>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
							<tr>
								<th className="px-5 py-3 font-semibold sm:px-6">User</th>
								<th className="px-5 py-3 font-semibold sm:px-6">Email</th>
								<th className="px-5 py-3 font-semibold sm:px-6">Reward</th>
								<th className="px-5 py-3 font-semibold sm:px-6">Points</th>
								<th className="px-5 py-3 font-semibold sm:px-6">Date</th>
								<th className="px-5 py-3 font-semibold sm:px-6">Status</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-200 text-slate-700">
							{redemptionRequests.map((request) => (
								<tr key={request.id} className="hover:bg-slate-50">
									<td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
										{request.user}
									</td>
									<td className="px-5 py-3.5 text-slate-600 sm:px-6">{request.email}</td>
									<td className="px-5 py-3.5 sm:px-6">{request.reward}</td>
									<td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
										{formatPoints(request.points)}
									</td>
									<td className="px-5 py-3.5 text-slate-600 sm:px-6">{request.date}</td>
									<td className="px-5 py-3.5 sm:px-6">
										<span
											className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassByName[request.status]}`}
										>
											{request.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="border-t border-slate-200 px-5 py-3 sm:px-6">
					<button
						type="button"
						className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
					>
						Export CSV
					</button>
				</div>
			</section>
		</section>
	)
}

export default UserRewards
