'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save, Loader2, Plus, Trash2, ChevronUp, ChevronDown,
  ExternalLink, Type, LayoutList, Star, FileText
} from 'lucide-react'
import Link from 'next/link'
import type { ArticleBlock, TextBlock, StrategyBlock, HighlightBlock, SummaryBlock, CarItem, StrategyGroup } from '@/types'

// ── helpers ──────────────────────────────────────────────────────────────

const BLOCK_LABELS: Record<string, string> = {
  text: 'Текстовый раздел', strategy: 'Карточка стратегии',
  highlight: 'Цветной блок', summary: 'Итоговый блок',
}
const BLOCK_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={13} />, strategy: <Star size={13} />,
  highlight: <LayoutList size={13} />, summary: <FileText size={13} />,
}
const COLORS = ['blue', 'violet', 'amber', 'red', 'slate', 'emerald'] as const
const COLOR_LABELS: Record<string, string> = {
  blue: 'Синий', violet: 'Фиолетовый', amber: 'Жёлтый',
  red: 'Красный', slate: 'Серый', emerald: 'Зелёный',
}

function emptyBlock(type: ArticleBlock['type']): ArticleBlock {
  if (type === 'text') return { type: 'text', heading: '', body: '' }
  if (type === 'strategy') return { type: 'strategy', title: '', color: 'blue', groups: [{ label: '', cars: [{ name: '', desc: '' }] }], advantages: [''] }
  if (type === 'highlight') return { type: 'highlight', heading: '', color: 'amber', items: [''] }
  return { type: 'summary', heading: '', rows: [{ label: '', models: '' }], note: '' }
}

// ── input helpers ─────────────────────────────────────────────────────────

const I = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-brand-red transition-all'
const TA = I + ' resize-none'
const LB = 'text-xs text-white/40 mb-1 block'

// ── Block editors ─────────────────────────────────────────────────────────

function TextEditor({ block, onChange }: { block: TextBlock; onChange: (b: TextBlock) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className={LB}>Заголовок (необязательно)</label>
        <input className={I} value={block.heading} onChange={e => onChange({ ...block, heading: e.target.value })} placeholder="Заголовок раздела" />
      </div>
      <div>
        <label className={LB}>Текст (абзацы разделяй пустой строкой)</label>
        <textarea className={TA} rows={5} value={block.body} onChange={e => onChange({ ...block, body: e.target.value })} placeholder="Текст раздела..." />
      </div>
    </div>
  )
}

function StrategyEditor({ block, onChange }: { block: StrategyBlock; onChange: (b: StrategyBlock) => void }) {
  const setGroup = (gi: number, g: StrategyGroup) => {
    const groups = block.groups.map((x, i) => i === gi ? g : x)
    onChange({ ...block, groups })
  }
  const setCar = (gi: number, ci: number, car: CarItem) => {
    const groups = block.groups.map((g, i) => i === gi ? { ...g, cars: g.cars.map((c, j) => j === ci ? car : c) } : g)
    onChange({ ...block, groups })
  }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LB}>Заголовок карточки</label>
          <input className={I} value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} placeholder="1. Безопасная стратегия..." />
        </div>
        <div>
          <label className={LB}>Цвет</label>
          <select className={I} value={block.color} onChange={e => onChange({ ...block, color: e.target.value as StrategyBlock['color'] })}>
            {COLORS.map(c => <option key={c} value={c}>{COLOR_LABELS[c]}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LB}>Группы автомобилей</label>
          <button type="button" onClick={() => onChange({ ...block, groups: [...block.groups, { label: '', cars: [{ name: '', desc: '' }] }] })}
            className="text-xs text-brand-red hover:underline flex items-center gap-1"><Plus size={11} />Группа</button>
        </div>
        {block.groups.map((group, gi) => (
          <div key={gi} className="bg-white/5 rounded-lg p-3 mb-2 space-y-2">
            <div className="flex gap-2">
              <input className={I + ' flex-1'} value={group.label} onChange={e => setGroup(gi, { ...group, label: e.target.value })} placeholder="Название группы (напр. Кроссоверы)" />
              <button type="button" onClick={() => onChange({ ...block, groups: block.groups.filter((_, i) => i !== gi) })} className="text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
            {group.cars.map((car, ci) => (
              <div key={ci} className="flex gap-2">
                <input className={I + ' flex-1'} value={car.name} onChange={e => setCar(gi, ci, { ...car, name: e.target.value })} placeholder="Название авто" />
                <input className={I + ' flex-[2]'} value={car.desc} onChange={e => setCar(gi, ci, { ...car, desc: e.target.value })} placeholder="Краткое описание" />
                <button type="button" onClick={() => setGroup(gi, { ...group, cars: group.cars.filter((_, j) => j !== ci) })} className="text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setGroup(gi, { ...group, cars: [...group.cars, { name: '', desc: '' }] })} className="text-xs text-white/30 hover:text-white flex items-center gap-1"><Plus size={11} />Автомобиль</button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LB}>Преимущества / правила (✓ пункты)</label>
          <button type="button" onClick={() => onChange({ ...block, advantages: [...block.advantages, ''] })} className="text-xs text-brand-red hover:underline flex items-center gap-1"><Plus size={11} />Пункт</button>
        </div>
        {block.advantages.map((adv, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={I + ' flex-1'} value={adv} onChange={e => { const a = [...block.advantages]; a[i] = e.target.value; onChange({ ...block, advantages: a }) }} placeholder="Преимущество..." />
            <button type="button" onClick={() => onChange({ ...block, advantages: block.advantages.filter((_, j) => j !== i) })} className="text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function HighlightEditor({ block, onChange }: { block: HighlightBlock; onChange: (b: HighlightBlock) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LB}>Заголовок</label>
          <input className={I} value={block.heading} onChange={e => onChange({ ...block, heading: e.target.value })} placeholder="Заголовок блока" />
        </div>
        <div>
          <label className={LB}>Цвет</label>
          <select className={I} value={block.color} onChange={e => onChange({ ...block, color: e.target.value as HighlightBlock['color'] })}>
            {(['amber','blue','emerald','red'] as const).map(c => <option key={c} value={c}>{COLOR_LABELS[c]}</option>)}
          </select>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LB}>Пункты списка</label>
          <button type="button" onClick={() => onChange({ ...block, items: [...block.items, ''] })} className="text-xs text-brand-red hover:underline flex items-center gap-1"><Plus size={11} />Пункт</button>
        </div>
        {block.items.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={I + ' flex-1'} value={item} onChange={e => { const a = [...block.items]; a[i] = e.target.value; onChange({ ...block, items: a }) }} placeholder="Пункт..." />
            <button type="button" onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} className="text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryEditor({ block, onChange }: { block: SummaryBlock; onChange: (b: SummaryBlock) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className={LB}>Заголовок</label>
        <input className={I} value={block.heading} onChange={e => onChange({ ...block, heading: e.target.value })} placeholder="Итог: ..." />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LB}>Строки таблицы</label>
          <button type="button" onClick={() => onChange({ ...block, rows: [...block.rows, { label: '', models: '' }] })} className="text-xs text-brand-red hover:underline flex items-center gap-1"><Plus size={11} />Строка</button>
        </div>
        {block.rows.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={I} value={row.label} onChange={e => { const r = [...block.rows]; r[i] = { ...r[i], label: e.target.value }; onChange({ ...block, rows: r }) }} placeholder="Категория" />
            <input className={I + ' flex-[2]'} value={row.models} onChange={e => { const r = [...block.rows]; r[i] = { ...r[i], models: e.target.value }; onChange({ ...block, rows: r }) }} placeholder="Автомобили через запятую" />
            <button type="button" onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => j !== i) })} className="text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <div>
        <label className={LB}>Заключительный текст</label>
        <textarea className={TA} rows={3} value={block.note} onChange={e => onChange({ ...block, note: e.target.value })} placeholder="Итоговый вывод..." />
      </div>
    </div>
  )
}

// ── Main editor ───────────────────────────────────────────────────────────

interface ArticleData { id: string; title: string; excerpt: string; coverImage: string; slug: string; content: string; publishedAt: string }

export function AdminArticleEditor({ article }: { article: ArticleData | null }) {
  const router = useRouter()
  const initialBlocks: ArticleBlock[] = (() => {
    if (!article) return []
    try { const p = JSON.parse(article.content); return p.blocks ?? [] } catch { return [] }
  })()

  const [meta, setMeta] = useState({
    title: article?.title ?? '',
    excerpt: article?.excerpt ?? '',
    coverImage: article?.coverImage ?? '',
    publishedAt: article?.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  })
  const [blocks, setBlocks] = useState<ArticleBlock[]>(initialBlocks)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateBlock = (i: number, b: ArticleBlock) => setBlocks(bs => bs.map((x, j) => j === i ? b : x))
  const removeBlock = (i: number) => setBlocks(bs => bs.filter((_, j) => j !== i))
  const moveUp = (i: number) => { if (i === 0) return; setBlocks(bs => { const a = [...bs]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a }) }
  const moveDown = (i: number) => { if (i === blocks.length - 1) return; setBlocks(bs => { const a = [...bs]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a }) }
  const addBlock = (type: ArticleBlock['type']) => setBlocks(bs => [...bs, emptyBlock(type)])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...meta, content: { blocks } }
    if (article) {
      await fetch('/api/admin/article', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: article.id, ...payload }) })
    } else {
      await fetch('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setSaving(false); setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/admin/article') }, 1500)
  }

  return (
    <form onSubmit={save} className="space-y-6">

      {/* Meta */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-sm">Основная информация</h2>
          {article && (
            <Link href={`/articles/${article.slug}`} target="_blank" className="flex items-center gap-1 text-brand-red text-xs hover:underline">
              <ExternalLink size={12} /> Открыть статью
            </Link>
          )}
        </div>
        <div>
          <label className={LB}>Заголовок статьи *</label>
          <input required className={I} value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder="Какие авто выгодно привезти из Кореи..." />
        </div>
        <div>
          <label className={LB}>Краткое описание (excerpt) *</label>
          <textarea required className={TA} rows={3} value={meta.excerpt} onChange={e => setMeta(m => ({ ...m, excerpt: e.target.value }))} placeholder="Вводный абзац, который показывается в превью..." />
        </div>
        <div>
          <label className={LB}>URL обложки (фото)</label>
          <input className={I} value={meta.coverImage} onChange={e => setMeta(m => ({ ...m, coverImage: e.target.value }))} placeholder="https://..." />
          {meta.coverImage && <img src={meta.coverImage} className="mt-2 h-28 rounded-lg object-cover" alt="" onError={e => (e.currentTarget.style.display = 'none')} />}
        </div>
        <div>
          <label className={LB}>Дата публикации</label>
          <input type="date" className={I} value={meta.publishedAt} onChange={e => setMeta(m => ({ ...m, publishedAt: e.target.value }))} />
        </div>
      </div>

      {/* Blocks */}
      <div className="admin-card p-6 space-y-4">
        <h2 className="text-white font-bold text-sm">Содержимое статьи</h2>
        <p className="text-white/30 text-xs">Добавляй блоки последовательно — они отобразятся в том же порядке</p>

        {blocks.length === 0 && (
          <div className="text-center py-8 text-white/20 text-sm border border-white/5 rounded-xl">
            Нет блоков — добавь первый ниже
          </div>
        )}

        {blocks.map((block, i) => (
          <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
            {/* Block header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/5">
              <div className="flex items-center gap-2 text-white/60 text-xs font-semibold">
                {BLOCK_ICONS[block.type]}
                {BLOCK_LABELS[block.type]}
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveUp(i)} className="p-1 text-white/20 hover:text-white"><ChevronUp size={14} /></button>
                <button type="button" onClick={() => moveDown(i)} className="p-1 text-white/20 hover:text-white"><ChevronDown size={14} /></button>
                <button type="button" onClick={() => removeBlock(i)} className="p-1 text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            {/* Block body */}
            <div className="p-4">
              {block.type === 'text' && <TextEditor block={block} onChange={b => updateBlock(i, b)} />}
              {block.type === 'strategy' && <StrategyEditor block={block} onChange={b => updateBlock(i, b)} />}
              {block.type === 'highlight' && <HighlightEditor block={block} onChange={b => updateBlock(i, b)} />}
              {block.type === 'summary' && <SummaryEditor block={block} onChange={b => updateBlock(i, b)} />}
            </div>
          </div>
        ))}

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(['text', 'strategy', 'highlight', 'summary'] as const).map(type => (
            <button key={type} type="button" onClick={() => addBlock(type)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10
                hover:border-brand-red hover:text-brand-red text-white/40 text-xs font-medium transition-all">
              <Plus size={12} /> {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className={`btn-primary ${saved ? '!bg-emerald-600' : ''}`}>
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saved ? 'Сохранено!' : article ? 'Сохранить изменения' : 'Создать статью'}
      </button>

    </form>
  )
}
