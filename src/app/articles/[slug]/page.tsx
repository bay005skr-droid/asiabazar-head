import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { ContactSection } from '@/components/home/ContactSection'
import prisma from '@/lib/prisma'
import { ArticleContent, ArticleBlock, TextBlock, StrategyBlock, HighlightBlock, SummaryBlock } from '@/types'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return { title: 'Статья не найдена' }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: [article.coverImage] },
  }
}

// ── Block renderers ───────────────────────────────────────────────────────

const STRATEGY_COLORS: Record<string, string> = {
  blue:   'border-blue-200 bg-blue-50',
  violet: 'border-violet-200 bg-violet-50',
  amber:  'border-amber-200 bg-amber-50',
  red:    'border-red-200 bg-red-50',
  slate:  'border-slate-200 bg-slate-50',
}
const STRATEGY_HEADING: Record<string, string> = {
  blue: 'text-blue-800', violet: 'text-violet-800',
  amber: 'text-amber-800', red: 'text-red-800', slate: 'text-slate-800',
}
const HIGHLIGHT_COLORS: Record<string, { wrap: string; head: string; check: string }> = {
  amber:   { wrap: 'border-amber-200 bg-amber-50',   head: 'text-amber-800',   check: 'text-amber-600' },
  blue:    { wrap: 'border-blue-200 bg-blue-50',     head: 'text-blue-800',    check: 'text-blue-600' },
  emerald: { wrap: 'border-emerald-200 bg-emerald-50', head: 'text-emerald-800', check: 'text-emerald-600' },
  red:     { wrap: 'border-red-200 bg-red-50',       head: 'text-red-800',     check: 'text-brand-red' },
}

function BlockText({ b }: { b: TextBlock }) {
  return (
    <div className="mb-8">
      {b.heading && <h2 className="text-2xl font-black text-gray-900 mb-3">{b.heading}</h2>}
      {b.body.split('\n\n').map((p, i) => (
        <p key={i} className="text-gray-600 text-base leading-relaxed mb-3">{p}</p>
      ))}
    </div>
  )
}

function BlockStrategy({ b }: { b: StrategyBlock }) {
  const wrapCls = STRATEGY_COLORS[b.color] ?? STRATEGY_COLORS.blue
  const headCls = STRATEGY_HEADING[b.color] ?? 'text-gray-800'
  return (
    <div className={`rounded-2xl border p-6 md:p-8 mb-6 ${wrapCls}`}>
      <h3 className={`text-xl font-black mb-5 ${headCls}`}>{b.title}</h3>
      {b.groups.map((group) => (
        <div key={group.label} className="mb-5">
          <h4 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">{group.label}</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {group.cars.map((car) => (
              <div key={car.name} className="bg-white/70 rounded-xl px-4 py-3">
                <div className="font-bold text-gray-900 text-sm">{car.name}</div>
                <div className="text-gray-500 text-xs mt-0.5">{car.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {b.advantages.length > 0 && (
        <div>
          <h4 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">Почему выгодно</h4>
          <ul className="space-y-2">
            {b.advantages.map((adv) => (
              <li key={adv} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-brand-red mt-0.5 flex-shrink-0 font-bold">✓</span>
                {adv}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function BlockHighlight({ b }: { b: HighlightBlock }) {
  const c = HIGHLIGHT_COLORS[b.color] ?? HIGHLIGHT_COLORS.amber
  return (
    <div className={`rounded-2xl border p-6 md:p-8 mb-6 ${c.wrap}`}>
      <h2 className={`text-xl font-black mb-3 ${c.head}`}>{b.heading}</h2>
      <ul className="space-y-2">
        {b.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <span className={`mt-0.5 flex-shrink-0 font-bold ${c.check}`}>✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function BlockSummary({ b }: { b: SummaryBlock }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 mb-6">
      <h2 className="text-xl font-black text-gray-900 mb-5">{b.heading}</h2>
      <div className="space-y-3">
        {b.rows.map((row) => (
          <div key={row.label} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
            <span className="text-gray-500 text-sm font-semibold sm:w-36 flex-shrink-0">{row.label}:</span>
            <span className="text-gray-800 text-sm">{row.models}</span>
          </div>
        ))}
      </div>
      {b.note && (
        <p className="text-gray-600 text-sm leading-relaxed mt-5 pt-4 border-t border-red-200">{b.note}</p>
      )}
    </div>
  )
}

function renderBlock(block: ArticleBlock, i: number) {
  switch (block.type) {
    case 'text':      return <BlockText key={i} b={block} />
    case 'strategy':  return <BlockStrategy key={i} b={block} />
    case 'highlight': return <BlockHighlight key={i} b={block} />
    case 'summary':   return <BlockSummary key={i} b={block} />
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) notFound()

  let content: ArticleContent
  try {
    const parsed = JSON.parse(article.content)
    content = parsed.blocks ? parsed : { blocks: [] }
  } catch {
    content = { blocks: [] }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="flex items-center gap-2 text-gray-400 text-sm py-6">
          <Link href="/" className="hover:text-brand-red transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-gray-600">Статья</span>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          На главную
        </Link>

        {/* Cover */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8 shadow-card">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-brand-red text-xs font-medium">
            Полезное
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-gray-500 text-lg leading-relaxed mb-10 border-l-4 border-brand-red pl-5">
          {article.excerpt}
        </p>

        {/* Content blocks */}
        <div>
          {content.blocks.map((block, i) => renderBlock(block, i))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/catalog" className="btn-primary">
            Смотреть каталог
            <ArrowRight size={18} />
          </Link>
          <Link href="/quiz" className="btn-secondary">Подобрать авто</Link>
        </div>

      </div>
      <ContactSection />
    </div>
  )
}
