import { useEffect, useMemo, useState } from 'react'
import { deleteRecipes, getCurrentUser, listMyRecipes, setUserAvatar } from '../utils/storage.js'

export default function Profile() {
	const user = getCurrentUser()
	const [items, setItems] = useState([])
	const [query, setQuery] = useState('')
	const [selected, setSelected] = useState({})
	const [deleting, setDeleting] = useState(false)
	const [progress, setProgress] = useState(0)

	useEffect(() => { setItems(listMyRecipes({ query })) }, [query])

	const count = useMemo(() => items.length, [items])
	const selectedIds = useMemo(() => Object.keys(selected).filter(id => selected[id]), [selected])

	async function onDelete() {
		if (selectedIds.length === 0) return
		setDeleting(true)
		await deleteRecipes(selectedIds, pct => setProgress(pct))
		setDeleting(false)
		setSelected({})
		setProgress(0)
		setItems(listMyRecipes({ query }))
	}

	async function handleAvatar(e){
		const f = e.target.files?.[0]; if(!f) return
		const url = URL.createObjectURL(f)
		setUserAvatar(url)
	}

	return (
		<div style={{ display: 'grid', gap: 16 }}>
			<div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
				<div className="row" style={{ gap: 16 }}>
					<div style={{ width: 72, height: 72, borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
						{user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="thumb text" style={{ fontSize: 28, height: '100%', aspectRatio: '1 / 1' }}>👤</div>}
					</div>
					<div>
						<div className="title">{user?.username}</div>
						<div className="muted">Uploads: {count}</div>
					</div>
					<label style={{ marginLeft: 'auto' }} className="btn ghost">
						🖼️ Change photo
						<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
					</label>
				</div>
			</div>

			<div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
				<div className="spread" style={{ alignItems: 'center' }}>
					<div className="row">
						<span className="pill">🗑️ Delete files</span>
						<span className="pill">Selected: {selectedIds.length}</span>
					</div>
					<div className="row" style={{ minWidth: 280 }}>
						<span className="pill">🔍 Search</span>
						<input className="input" placeholder="Search in your uploads…" value={query} onChange={e=>setQuery(e.target.value)} />
					</div>
				</div>
				{items.length === 0 ? (
					<div className="empty">No files to show.</div>
				) : (
					<div className="grid">
						{items.map(r => (
							<label key={r.id} className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 12, padding: 10 }}>
								<input type="checkbox" checked={!!selected[r.id]} onChange={e=>setSelected(prev=>({ ...prev, [r.id]: e.target.checked }))} />
								<div className="row" style={{ gap: 10 }}>
									<div className="pill">{r.type==='video'?'🎬':'🖼️'}</div>
									<div>
										<div className="title" style={{ fontSize: 14 }}>{r.title}</div>
										<div className="muted" style={{ fontSize: 12 }}>{r.privacy==='private'?'🔒 Private':'🌍 Public'}</div>
									</div>
								</div>
							</label>
						))}
					</div>
				)}
				<div className="spread">
					<button className="btn secondary" disabled={deleting}>Cancel</button>
					<button className="btn" onClick={onDelete} disabled={deleting || selectedIds.length===0}>{deleting ? 'Deleting…' : 'Delete 🗑️'}</button>
				</div>
				{deleting && (
					<div className="progress"><span style={{ width: progress + '%' }} /></div>
				)}
			</div>
		</div>
	)
}


