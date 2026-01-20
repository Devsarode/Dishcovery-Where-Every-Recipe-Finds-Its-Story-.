// Simple localStorage-based data layer for demo purposes

const STORAGE_KEY = 'dishcovery'

function readAll() {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return { users: {}, sessions: {}, recipes: {}, comments: {}, likes: {} }
	try { return JSON.parse(raw) } catch { return { users: {}, sessions: {}, recipes: {}, comments: {}, likes: {} } }
}

function writeAll(db) { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) }

function uid(prefix = 'id') { return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}` }

export function seedExample(userId) {
	const db = readAll()
	const hasAny = Object.values(db.recipes).some(r => r.ownerId === userId)
	if (hasAny) return
	const id = uid('recipe')
	db.recipes[id] = {
		id,
		ownerId: userId,
		title: 'Classic Fried Rice',
		description: 'A quick, flavorful fried rice with eggs, veggies, and soy sauce.',
		privacy: 'public',
		type: 'video',
		fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
		thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
		createdAt: Date.now(),
	}
	writeAll(db)
}

export function login(username) {
	const db = readAll()
	const userId = Object.keys(db.users).find(id => db.users[id].username === username) || uid('user')
	db.users[userId] = db.users[userId] || { id: userId, username, avatarUrl: '' }
	db.sessions.current = userId
	writeAll(db)
	seedExample(userId)
	return db.users[userId]
}

export function logout() {
	const db = readAll()
	delete db.sessions.current
	writeAll(db)
}

export function getCurrentUser() {
	const db = readAll()
	const id = db.sessions.current
	return id ? db.users[id] : null
}

export function setUserAvatar(url) {
	const db = readAll()
	const id = db.sessions.current
	if (!id) return
	db.users[id].avatarUrl = url
	writeAll(db)
}

export function createRecipe({ type, fileUrl, thumbnail, title, description, privacy, textContent }) {
	const db = readAll()
	const ownerId = db.sessions.current
	const id = uid('recipe')
	db.recipes[id] = { id, ownerId, type, fileUrl, thumbnail, title, description, privacy, createdAt: Date.now(), textContent: textContent || '' }
	writeAll(db)
	return db.recipes[id]
}

export function listMyRecipes({ query = '' } = {}) {
	const db = readAll()
	const ownerId = db.sessions.current
	const all = Object.values(db.recipes).filter(r => r.ownerId === ownerId)
	const q = query.trim().toLowerCase()
	return q ? all.filter(r => r.title.toLowerCase().includes(q)) : all
}

export function getRecipe(id) {
	const db = readAll(); return db.recipes[id] || null
}

export function deleteRecipes(ids = [], onProgress) {
	return new Promise(resolve => {
		const db = readAll()
		let i = 0
		const tick = () => {
			i++
			const percent = Math.round((i / ids.length) * 100)
			onProgress?.(percent)
			if (ids[i - 1]) {
				delete db.recipes[ids[i - 1]]
				// cascade delete likes/comments for the recipe
				Object.keys(db.likes).forEach(k => { if (k.startsWith(ids[i - 1] + ':')) delete db.likes[k] })
				Object.keys(db.comments).forEach(k => { if (db.comments[k].recipeId === ids[i - 1] ) delete db.comments[k] })
			}
			if (i >= ids.length) {
				writeAll(db)
				resolve()
			} else {
				setTimeout(tick, 200)
			}
		}
		setTimeout(tick, 200)
	})
}

export function likeRecipe(id) {
	const db = readAll(); const userId = db.sessions.current
	const key = `${id}:${userId}`
	db.likes[key] = true
	writeAll(db)
}

export function countLikes(id) {
	const db = readAll()
	return Object.keys(db.likes).filter(k => k.startsWith(id + ':')).length
}

export function addComment(recipeId, text) {
	const db = readAll(); const userId = db.sessions.current
	const id = uid('c')
	db.comments[id] = { id, recipeId, userId, text, createdAt: Date.now() }
	writeAll(db)
}

export function listComments(recipeId) {
	const db = readAll()
	return Object.values(db.comments).filter(c => c.recipeId === recipeId).sort((a,b)=>a.createdAt-b.createdAt)
}

export function dataUrlFromFile(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader()
		r.onload = () => resolve(r.result)
		r.onerror = reject
		r.readAsDataURL(file)
	})
}

export function textFromFile(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader()
		r.onload = () => resolve(String(r.result || ''))
		r.onerror = reject
		r.readAsText(file)
	})
}


