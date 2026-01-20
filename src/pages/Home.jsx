import { useEffect, useMemo, useState } from 'react'
import { listMyRecipes } from '../utils/storage.js'
import RecipeCard from '../components/RecipeCard.jsx'

export default function Home() {
	const [query, setQuery] = useState('')
	const [items, setItems] = useState([])

	useEffect(() => {
		setItems(listMyRecipes({ query }))
	}, [query])

	const counts = useMemo(() => ({
		all: items.length,
		video: items.filter(i => i.type === 'video').length,
		photo: items.filter(i => i.type === 'photo').length,
		text: items.filter(i => i.type === 'text').length,
	}), [items])

	return (
		<div style={{ display: 'grid', gap: 16 }}>
			<div className="card" style={{ padding: 12 }}>
				<div className="spread">
					<div className="row">
						<div className="pill">📦 All: {counts.all}</div>
						<div className="pill">🎬 Video: {counts.video}</div>
						<div className="pill">🖼️ Photo: {counts.photo}</div>
						<div className="pill">📝 Text: {counts.text}</div>
					</div>
					<div className="row" style={{ minWidth: 260 }}>
						<span className="pill">🔍 Search</span>
						<input className="input" placeholder="Search by title…" value={query} onChange={e=>setQuery(e.target.value)} />
					</div>
				</div>
			</div>

			{items.length === 0 ? (
				<div className="empty">No recipes yet. Try uploading from the Upload page ⤴️</div>
			) : (
				<div className="grid">
					{items.map(r => <RecipeCard key={r.id} recipe={r} />)}
				</div>
			)}
		</div>
	)
}


