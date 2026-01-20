import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../utils/storage.js'

export default function Login() {
	const [username, setUsername] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const from = location.state?.from?.pathname || '/'

	async function onSubmit(e) {
		e.preventDefault()
		if (!username.trim()) return
		setLoading(true)
		login(username.trim())
		setLoading(false)
		navigate(from, { replace: true })
	}

	return (
		<div className="login-wrap">
			<form className="card login-card" onSubmit={onSubmit}>
				<h2 style={{ marginTop: 0, marginBottom: 8 }}>🍳 DISHCOVERY</h2>
				<p className="muted" style={{ marginTop: 0 }}>Login to continue</p>
				<div style={{ display: 'grid', gap: 10 }}>
					<label>
						<div style={{ marginBottom: 6 }}>👤 Username</div>
						<input className="input" placeholder="Enter username" value={username} onChange={e=>setUsername(e.target.value)} />
					</label>
					<button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
				</div>
			</form>
		</div>
	)
}


