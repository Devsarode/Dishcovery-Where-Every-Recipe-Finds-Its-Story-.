import { useEffect, useRef, useState } from 'react'
import { askRecipeAssistant } from '../utils/chatApi.js'

const CHAT_KEY = 'dishcovery_chat_history'

function readChat() { try { return JSON.parse(localStorage.getItem(CHAT_KEY)) || [] } catch { return [] } }
function writeChat(history) { localStorage.setItem(CHAT_KEY, JSON.stringify(history)) }

export default function Chatbot() {
	const [history, setHistory] = useState(readChat())
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const scrollRef = useRef(null)

	useEffect(() => { writeChat(history) }, [history])
	useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [history, loading])

	async function send() {
		if (!input.trim() || loading) return
		const userMsg = { role: 'user', content: input.trim() }
		setHistory(h => [...h, userMsg])
		setInput('')
		setLoading(true)
		try {
			const reply = await askRecipeAssistant([
				{ role: 'system', content: 'You are a helpful cooking assistant. Only answer about recipes.' },
				...history,
				userMsg,
			])
			setHistory(h => [...h, { role: 'assistant', content: reply }])
		} catch (e) {
			setHistory(h => [...h, { role: 'assistant', content: 'Error: ' + e.message }])
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="card" style={{ padding: 16, display: 'grid', gap: 12, height: 'calc(100vh - 140px)' }}>
			<h2 style={{ margin: 0 }}>🤖 Recipe Chatbot</h2>
			<div style={{ overflow: 'auto', display: 'grid', gap: 10, paddingRight: 6 }}>
				{history.length === 0 && <div className="muted">Ask for any recipe, e.g., "fried rice".</div>}
				{history.map((m, i) => (
					<div key={i} className="chat-line">
						<div className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}>{m.content}</div>
					</div>
				))}
				{loading && <div className="muted">Assistant is typing…</div>}
				<div ref={scrollRef} />
			</div>
			<div className="row">
				<input className="input" placeholder="Ask about recipes…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} />
				<button className="btn" onClick={send} disabled={loading}>Send ➤</button>
			</div>
			<p className="muted" style={{ fontSize: 12, margin: 0 }}>Note: Set your API key in <code>.env</code> as <code>VITE_OPENROUTER_API_KEY</code>.</p>
		</div>
	)
}


