import { useState } from 'react'
import RewardCatalog from '../components/rewards/RewardCatalog'
import RedemptionTable from '../components/rewards/RedemptionTable'

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

const initialRewardItems = [
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

const initialRewardForm = {
	title: '',
	provider: '',
	category: 'Telecom',
	points: '',
	stockCount: '',
	icon: '',
}

const categoryOptions = ['Telecom', 'Grocery', 'Retail']

function UserRewards() {
	const [rewards, setRewards] = useState(initialRewardItems)
	const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false)
	const [rewardForm, setRewardForm] = useState(initialRewardForm)

	const handleAddReward = () => {
		setIsAddRewardModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsAddRewardModalOpen(false)
		setRewardForm(initialRewardForm)
	}

	const handleRewardFieldChange = (event) => {
		const { name, value } = event.target
		setRewardForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}))
	}

	const handleSubmitNewReward = (event) => {
		event.preventDefault()

		const pointsValue = Number(rewardForm.points)
		const stockValue = Number(rewardForm.stockCount)
		const computedStock = stockValue <= 0 ? 'Out of stock' : `${stockValue} left`

		const newReward = {
			id: Date.now(),
			title: rewardForm.title.trim(),
			provider: rewardForm.provider.trim(),
			category: rewardForm.category,
			points: Number.isNaN(pointsValue) ? 0 : pointsValue,
			stock: computedStock,
			icon: rewardForm.icon.trim() || rewardForm.title.trim().slice(0, 2).toUpperCase(),
		}

		setRewards((currentRewards) => [newReward, ...currentRewards])
		handleCloseModal()
	}

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

			<RewardCatalog rewards={rewards} onAddReward={handleAddReward} />

			<RedemptionTable requests={redemptionRequests} />

			{isAddRewardModalOpen ? (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
					<form
						onSubmit={handleSubmitNewReward}
						className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
					>
						<div className="mb-5 flex items-start justify-between gap-3">
							<div>
								<h3 className="text-xl font-bold text-slate-900">Add New Reward</h3>
								<p className="mt-1 text-sm text-slate-600">
									Create a reward item for the catalog.
								</p>
							</div>

							<button
								type="button"
								onClick={handleCloseModal}
								className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
							>
								Close
							</button>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<label className="text-sm font-medium text-slate-700">
								Title
								<input
									required
									name="title"
									value={rewardForm.title}
									onChange={handleRewardFieldChange}
									className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Provider
								<input
									required
									name="provider"
									value={rewardForm.provider}
									onChange={handleRewardFieldChange}
									className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Category
								<select
									name="category"
									value={rewardForm.category}
									onChange={handleRewardFieldChange}
									className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
								>
									{categoryOptions.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Points
								<input
									required
									type="number"
									min="0"
									name="points"
									value={rewardForm.points}
									onChange={handleRewardFieldChange}
									className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Stock Count
								<input
									required
									type="number"
									min="0"
									name="stockCount"
									value={rewardForm.stockCount}
									onChange={handleRewardFieldChange}
									className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Icon (2 letters)
								<input
									name="icon"
									maxLength="2"
									value={rewardForm.icon}
									onChange={handleRewardFieldChange}
									className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm uppercase outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
								/>
							</label>
						</div>

						<div className="mt-6 flex items-center justify-end gap-2.5">
							<button
								type="button"
								onClick={handleCloseModal}
								className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
							>
								Add Reward
							</button>
						</div>
					</form>
				</div>
			) : null}
		</section>
	)
}

export default UserRewards
