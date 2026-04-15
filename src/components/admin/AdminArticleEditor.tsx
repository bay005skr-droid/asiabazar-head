'use client'

import { useState } from 'react'
import { Save, Loader2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Article { id: string; title: string; excerpt: string; coverImage: string; slug: string }

export function AdminArticleEditor({ article }: { article: Article | null }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    coverImage: article?.coverImage || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (article) {
      await fetch(`/api/admin/article`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: article.id, ...form }) })
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={save} className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">Редактирование прomo-блока и заголовка статьи</p>
        {article && (
          <Link href={`/articles/${article.slug}`} target="_blank" className="flex items-center gap-1 text-brand-red text-xs hover:underline">
            <ExternalLink size={12} /> Открыть статью
          </Link>
        )}
      </div>
      <div><label className="label-base">Заголовок статьи</label><input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="input-base" /></div>
      <div><label className="label-base">Краткое описание (excerpt)</label><textarea value={form.excerpt} onChange={e => setForm(p => ({...p, excerpt: e.target.value}))} rows={3} className="input-base resize-none" /></div>
      <div><label className="label-base">URL обложки</label><input value={form.coverImage} onChange={e => setForm(p => ({...p, coverImage: e.target.value}))} className="input-base" placeholder="https://..." />
        {form.coverImage && <img src={form.coverImage} className="mt-2 h-32 rounded-lg object-cover" alt="" />}
      </div>
      <p className="text-white/30 text-xs">Полное содержимое статьи (категории, описания) редактируется в файле prisma/seed.ts</p>
      <button type="submit" disabled={saving || !article} className={`btn-primary ${saved ? 'bg-emerald-600' : ''}`}>
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saved ? 'Сохранено!' : 'Сохранить'}
      </button>
    </form>
  )
}
