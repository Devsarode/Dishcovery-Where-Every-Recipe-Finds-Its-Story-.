import { useParams } from 'react-router-dom'
import { addComment, countLikes, getRecipe, likeRecipe, listComments } from '../utils/storage.js'
import { useEffect, useMemo, useState } from 'react'

export default function Detail() {
	const { id } = useParams()
	const [recipe, setRecipe] = useState(null)
	const [likes, setLikes] = useState(0)
	const [comments, setComments] = useState([])
	const [text, setText] = useState('')

	useEffect(() => {
		setRecipe(getRecipe(id))
		setLikes(countLikes(id))
		setComments(listComments(id))
	}, [id])

	const isVideo = recipe?.type === 'video'
	const isPhoto = recipe?.type === 'photo'
	const isText = recipe?.type === 'text'

	function onLike() {
		likeRecipe(id)
		setLikes(countLikes(id))
	}

	function onAddComment() {
		if (!text.trim()) return
		addComment(id, text.trim())
		setText('')
		setComments(listComments(id))
	}

	if (!recipe) return <div className="empty">Recipe not found.</div>

	return (
		<div style={{ display: 'grid', gap: 16 }}>
			<div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
				<div className="spread">
					<h2 style={{ margin: 0 }}>{recipe.title}</h2>
					<span className="pill">{recipe.privacy === 'private' ? '🔒 Private' : '🌍 Public'}</span>
				</div>
				{isVideo && <video controls src={recipe.fileUrl} poster={recipe.thumbnail} style={{ width: '100%', borderRadius: 12 }} />}
				{isPhoto && <img src={recipe.fileUrl} className="thumb" alt={recipe.title} />}
				{isText && (
					<div className="card" style={{ padding: 12 }}>
						<div className="muted" style={{ marginBottom: 8 }}>File content</div>
						<pre style={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto', margin: 0 }}>{recipe.textContent || 'No text found.'}</pre>
					</div>
				)}
				<p className="muted" style={{ margin: 0 }}>{recipe.description}</p>
				<div className="row">
					<button className="btn" onClick={onLike}>👍 {likes}</button>
				</div>
			</div>
			<div className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
				<h3 style={{ margin: 0 }}>💬 Comments</h3>
				{comments.length === 0 ? (
					<div className="muted">No comments yet.</div>
				) : (
					<div className="chat">
						{comments.map(c => (
							<div key={c.id} className="chat-line">
								<div className="bubble bot">{c.text}</div>
								<div className="muted" style={{ fontSize: 10 }}>at {new Date(c.createdAt).toLocaleString()}</div>
							</div>
						))}
					</div>
				)}
				<div className="row" style={{ gap: 8 }}>
					<input className="input" placeholder="Add a comment…" value={text} onChange={e=>setText(e.target.value)} />
					<button className="btn" onClick={onAddComment}>Send ➤</button>
				</div>
			</div>
		</div>
	)
}


