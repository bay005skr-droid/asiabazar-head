'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'

export default function AdminStatsPage() {
  const [stats, setStats] = useState({ selectedCars: 0, deliveredCars: 0, completedDeals: 0, happyClients: 0, deliveryDays: 12 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { if (d.stats) setStats(d.stats); setLoading(false) })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/stats', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stats) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="text-white/30">Загрузка...</div>

  const fields = [
    { key: 'deliveryDays', label: 'Срок доставки (дней)' },
    { key: 'selectedCars', label: 'Автомобилей подобрано' },
    { key: 'deliveredCars', label: 'Автомобилей доставлено' },
    { key: 'completedDeals', label: 'Успешных сделок' },
    { key: 'happyClients', label: 'Довольных клиентов' },
  ] as const

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-black text-white">Статистика</h1>
      <form onSubmit={save} className="card p-6 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="label-base">{f.label}</label>
            <input type="number" value={stats[f.key]} onChange={e => setStats(p => ({...p, [f.key]: parseInt(e.target.value)||0}))} className="input-base" />
          </div>
        ))}
        <button type="submit" disabled={saving} className={`btn-primary ${saved ? 'bg-emerald-600' : ''}`}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? 'Сохранено!' : 'Сохранить'}
        </button>
      </form>
      <p className="text-white/30 text-xs">Срок доставки отображается в герое на главной. Остальные цифры — в блоке статистики.</p>
    </div>
  )
}
