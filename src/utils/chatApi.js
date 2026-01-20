// Chat API using OpenRouter - reads API key from Vite env (see .env instructions)

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function askRecipeAssistant(messages) {
	const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
	if (!apiKey) throw new Error('Missing VITE_OPENROUTER_API_KEY in .env')
	const res = await fetch(OPENROUTER_URL, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'Referer': 'http://localhost'
		},
		body: JSON.stringify({
			model: 'openai/gpt-4o-mini',
			messages
		})
	})
	if (!res.ok) throw new Error('Chat request failed')
	const data = await res.json()
	const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not respond.'
	return reply
}


