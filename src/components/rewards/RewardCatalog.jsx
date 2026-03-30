import RewardCard from './RewardCard'

function RewardCatalog({ rewards = [], onAddReward }) {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2.5">
					<h2 className="text-2xl font-bold text-slate-900">Reward Catalog</h2>
					<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
						{rewards.length} items
					</span>
				</div>

				<button
					type="button"
					onClick={onAddReward}
					className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
				>
					Add Reward
				</button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{rewards.map((reward) => (
					<RewardCard
						key={reward.id ?? `${reward.title}-${reward.provider}`}
						title={reward.title}
						provider={reward.provider}
						category={reward.category}
						points={reward.points}
						stock={reward.stock}
						icon={reward.icon}
					/>
				))}
			</div>
		</section>
	)
}

export default RewardCatalog
