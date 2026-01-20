import { useState } from 'react'
import { createRecipe, dataUrlFromFile, textFromFile } from '../utils/storage.js'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
	const [step, setStep] = useState(1)
	const [type, setType] = useState('video')
	const [file, setFile] = useState(null)
	const [fileUrl, setFileUrl] = useState('')
	const [thumbnail, setThumbnail] = useState('')
	const [textContent, setTextContent] = useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [privacy, setPrivacy] = useState('public')
	const [saving, setSaving] = useState(false)
	const navigate = useNavigate()

	async function handleFile(e) {
		const f = e.target.files?.[0]
		if (!f) return
		setFile(f)
		if (type === 'text') {
			const text = await textFromFile(f)
			setTextContent(text)
			setFileUrl('')
		} else {
			// Use object URL to avoid exceeding localStorage size for videos/photos
			const url = URL.createObjectURL(f)
			setFileUrl(url)
		}
	}

	async function handleThumb(e) {
		const f = e.target.files?.[0]
		if (!f) return
		const url = URL.createObjectURL(f)
		setThumbnail(url)
	}

	const canNext1 = type === 'text' ? !!textContent : !!fileUrl
	const canNext2 = type === 'video' ? !!thumbnail : true
	const canUpload = !!title.trim() && !!description.trim()

	async function onUpload() {
		setSaving(true)
		try {
			createRecipe({ type, fileUrl, thumbnail, title: title.trim(), description: description.trim(), privacy, textContent })
			navigate('/')
		} catch (e) {
			alert('Upload failed. Try smaller files. ' + e.message)
		} finally {
			setSaving(false)
		}
	}

	return (
		<div style={{ display: 'grid', gap: 16 }}>
			<h2 style={{ margin: 0 }}>⤴️ Upload</h2>
			<div className="card" style={{ padding: 16, display: 'grid', gap: 16 }}>
				<div className="row">
					<span className="pill">1️⃣ File</span>
					<span className="pill">2️⃣ Thumbnail</span>
					<span className="pill">3️⃣ Title</span>
					<span className="pill">4️⃣ Description</span>
				</div>

				{step === 1 && (
					<div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
						<label>
							<div style={{ marginBottom: 6 }}>📁 Choose type</div>
							<select className="select" value={type} onChange={e=>setType(e.target.value)}>
								<option value="video">Video</option>
								<option value="photo">Photo</option>
								<option value="text">Text file</option>
							</select>
						</label>
						<label>
							<div style={{ marginBottom: 6 }}>⬆️ Upload {type}</div>
							<input type="file" className="input" accept={type==='video'?'video/*':type==='photo'?'image/*':'.txt,.md,.rtf,.pdf'} onChange={handleFile} />
						</label>
						{fileUrl ? (
							<div className="card" style={{ padding: 12 }}>
								<div className="muted" style={{ marginBottom: 8 }}>Preview</div>
								{type==='video' && <video controls src={fileUrl} style={{ width: '100%', borderRadius: 10 }} />}
								{type==='photo' && <img src={fileUrl} className="thumb" alt="preview" />}
							{type==='text' && (
								<div className="card" style={{ padding: 12 }}>
									<div className="muted" style={{ marginBottom: 8 }}>Preview (first 12 lines)</div>
									<pre style={{ whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto', margin: 0 }}>{textContent.split('\n').slice(0,12).join('\n')}</pre>
								</div>
							)}
							</div>
						) : null}
						<div className="spread">
							<div />
							<button className="btn" disabled={!canNext1} onClick={()=>setStep(2)}>Next ▶</button>
						</div>
					</div>
				)}

				{step === 2 && (
					<div style={{ display: 'grid', gap: 12 }}>
						{type==='video' ? (
							<label>
								<div style={{ marginBottom: 6 }}>🖼️ Upload thumbnail</div>
								<input type="file" accept="image/*" className="input" onChange={handleThumb} />
							</label>
						) : (
							<div className="muted">Thumbnails are used only for videos.</div>
						)}
						{thumbnail && <img src={thumbnail} alt="thumbnail" className="thumb" />}
						<div className="spread">
							<button className="btn secondary" onClick={()=>setStep(1)}>◀ Back</button>
							<button className="btn" disabled={!canNext2} onClick={()=>setStep(3)}>Next ▶</button>
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
						<label style={{ gridColumn: '1 / -1' }}>
							<div style={{ marginBottom: 6 }}>📝 Title</div>
							<input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., Spicy Garlic Noodles" />
						</label>
						<label>
							<div style={{ marginBottom: 6 }}>🔐 Privacy</div>
							<select className="select" value={privacy} onChange={e=>setPrivacy(e.target.value)}>
								<option value="public">🌍 Public</option>
								<option value="private">🔒 Private</option>
							</select>
						</label>
						<div className="spread" style={{ gridColumn: '1 / -1' }}>
							<button className="btn secondary" onClick={()=>setStep(2)}>◀ Back</button>
							<button className="btn" onClick={()=>setStep(4)} disabled={!title.trim()}>Next ▶</button>
						</div>
					</div>
				)}

				{step === 4 && (
					<div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
						<label>
							<div style={{ marginBottom: 6 }}>🗒️ Description</div>
							<textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add a short description..." />
						</label>
						<div className="spread">
							<button className="btn secondary" onClick={()=>setStep(3)}>◀ Back</button>
							<button className="btn" disabled={!canUpload || saving} onClick={onUpload}>{saving ? 'Uploading…' : 'Upload ⤴️'}</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}


