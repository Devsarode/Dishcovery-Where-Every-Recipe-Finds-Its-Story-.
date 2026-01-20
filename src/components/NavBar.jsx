import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/storage.js'

export default function NavBar() {
	const navigate = useNavigate()
	const user = getCurrentUser()
	return (
		<nav className="navbar">
			<div className="brand">🍳 <em>DISH</em>COVERY</div>
			<div className="navlinks">
				<NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>🏠 Home</NavLink>
				<NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : undefined}>⤴️ Upload</NavLink>
				<NavLink to="/chatbot" className={({ isActive }) => isActive ? 'active' : undefined}>🤖 Chatbot</NavLink>
				<NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : undefined}>👤 Profile</NavLink>
			</div>
			<div className="spread" style={{ marginLeft: 'auto', gap: 16 }}>
				<span className="pill">👋 {user?.username}</span>
				<button className="btn secondary" onClick={() => { logout(); navigate('/login', { replace: true }) }}>↩️ Logout</button>
			</div>
		</nav>
	)
}


