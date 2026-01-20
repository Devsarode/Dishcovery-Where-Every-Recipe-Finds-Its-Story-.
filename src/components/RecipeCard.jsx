import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe }) {
	const isVideo = recipe.type === 'video'
	const isPhoto = recipe.type === 'photo'
	const isText = recipe.type === 'text'
	const thumbSrc = isVideo ? (recipe.thumbnail || '') : (isPhoto ? recipe.fileUrl : null)
	return (
		<Link to={`/detail/${recipe.id}`} className="card recipe-card" title={recipe.title}>
			{thumbSrc ? (
				<img className="thumb" src={thumbSrc} alt={recipe.title} />
			) : (
				<div className="thumb text">{isText ? '📄' : '📎'}</div>
			)}
			<div className="card-body">
				<div className="spread">
					<div className="title">{recipe.title}</div>
					<span className="pill">{recipe.privacy === 'private' ? '🔒 Private' : '🌍 Public'}</span>
				</div>
				<div className="muted">{isVideo ? '🎬 Video' : isPhoto ? '🖼️ Photo' : '📝 Text'}</div>
				<div className="muted" style={{ lineHeight: 1.4 }}>{recipe.description}</div>
			</div>
		</Link>
	)
}


