'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, Star, Loader2 } from 'lucide-react'

interface Review {
  id: string; author: string; city: string; rating: number; text: string; date: string; isActive: boolean
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ author: '', city: '', rating: 5, text: '', date: '', isActive: true })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/reviews')
    const data = await res.json()
    setReviews(data.reviews || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    await load()
    setForm({ author: '', city: '', rating: 5, text: '', date: '', isActive: true })
    setSaving(false)
  }

  const toggle = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isActive: !isActive }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return
    await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-black text-white">Отзывы</h1>

      {/* Add form */}
      <form onSubmit={add} className="card p-6 space-y-4">
        <h2 className="text-white font-bold">Добавить отзыв</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="label-base">Имя *</label><input required value={form.author} onChange={e => setForm(p => ({...p, author: e.target.value}))} className="input-base" placeholder="Дмитрий К." /></div>
          <div><label className="label-base">Город *</label><input required value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} className="input-base" placeholder="Москва" /></div>
          <div><label className="label-base">Дата *</label><input required value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="input-base" placeholder="12 марта 2025" /></div>
        </div>
        <div><label className="label-base">Рейтинг</label>
          <div className="flex gap-2 mt-1">
            {[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setForm(p => ({...p, rating: n}))} className={`p-1 rounded ${n <= form.rating ? 'text-amber-400' : 'text-white/20'}`}><Star size={20} fill={n <= form.rating ? 'currentColor' : 'none'} /></button>)}
          </div>
        </div>
        <div><label className="label-base">Текст отзыва *</label><textarea required value={form.text} onChange={e => setForm(p => ({...p, text: e.target.value}))} rows={3} className="input-base resize-none" /></div>
        <button type="submit" disabled={saving} className="btn-primary"><Plus size={16} />{saving ? 'Сохранение...' : 'Добавить'}</button>
      </form>

      {/* List */}
      <div className="space-y-2">
        {loading ? <div className="text-white/30 text-sm">Загрузка...</div> : reviews.map(r => (
          <div key={r.id} className={`card p-4 flex gap-4 items-start ${!r.isActive ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm">{r.author}</span>
                <span className="text-white/30 text-xs">{r.city}</span>
                <div className="flex gap-0.5">{[...Array(r.rating)].map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}</div>
              </div>
              <p className="text-white/50 text-xs line-clamp-2">{r.text}</p>
              <span className="text-white/20 text-xs">{r.date}</span>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => toggle(r.id, r.isActive)} className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-all">{r.isActive ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
              <button onClick={() => del(r.id)} className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
