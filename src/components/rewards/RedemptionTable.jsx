import { useMemo, useState } from 'react'

const statusClassByName = {
	Pending: 'bg-amber-100 text-amber-700',
	Fulfilled: 'bg-emerald-100 text-emerald-700',
	Rejected: 'bg-rose-100 text-rose-700',
}

function formatPoints(points) {
	if (typeof points === 'number') {
		return points.toLocaleString('en-US')
	}

	return points
}

function getInitial(name) {
	if (!name || typeof name !== 'string') {
		return '?'
	}

	return name.trim().charAt(0).toUpperCase()
}

function RedemptionTable({ requests = [] }) {
	const [query, setQuery] = useState('')

	const filteredRequests = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()

		if (!normalizedQuery) {
			return requests
		}

		return requests.filter((request) => {
			const user = request.user?.toLowerCase() ?? ''
			const reward = request.reward?.toLowerCase() ?? ''

			return user.includes(normalizedQuery) || reward.includes(normalizedQuery)
		})
	}, [requests, query])

	return (
		<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
				<h2 className="text-2xl font-bold text-slate-900">Redemption Requests</h2>

				<label className="relative w-full max-w-sm">
					<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
						🔍
					</span>
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search users or rewards..."
						className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
					/>
				</label>
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
						{filteredRequests.map((request) => (
							<tr key={request.id} className="transition hover:bg-slate-50">
								<td className="px-5 py-3.5 sm:px-6">
									<div className="flex items-center gap-3">
										<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
											{getInitial(request.user)}
										</div>
										<p className="font-semibold text-slate-900">{request.user}</p>
									</div>
								</td>
								<td className="px-5 py-3.5 text-slate-600 sm:px-6">{request.email}</td>
								<td className="px-5 py-3.5 sm:px-6">{request.reward}</td>
								<td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
									{formatPoints(request.points)}
								</td>
								<td className="px-5 py-3.5 text-slate-600 sm:px-6">{request.date}</td>
								<td className="px-5 py-3.5 sm:px-6">
									<span
										className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassByName[request.status] ?? 'bg-slate-100 text-slate-700'}`}
									>
										{request.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default RedemptionTable
