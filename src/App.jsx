import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Upload from './pages/Upload.jsx'
import Chatbot from './pages/Chatbot.jsx'
import Profile from './pages/Profile.jsx'
import Detail from './pages/Detail.jsx'
import NavBar from './components/NavBar.jsx'
import { getCurrentUser } from './utils/storage.js'

function Protected({ children }) {
	const user = getCurrentUser()
	const location = useLocation()
	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}
	return children
}

export default function App() {
	const user = getCurrentUser()
	return (
		<div className="app">
			{user ? <NavBar /> : null}
			<div className="page">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Protected><Home /></Protected>} />
					<Route path="/upload" element={<Protected><Upload /></Protected>} />
					<Route path="/chatbot" element={<Protected><Chatbot /></Protected>} />
					<Route path="/profile" element={<Protected><Profile /></Protected>} />
					<Route path="/detail/:id" element={<Protected><Detail /></Protected>} />
					<Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
				</Routes>
			</div>
		</div>
	)
}


