import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { ArticleViewCounter } from '@/components/ArticleViewCounter'
import { ContactSection } from '@/components/home/ContactSection'
import prisma from '@/lib/prisma'
import { ArticleContent } from '@/types'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return { title: 'Статья не найдена' }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: [article.coverImage],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) notFound()

  const content: ArticleContent = JSON.parse(article.content)

  const categoryColors: Record<string, string> = {
    Комфорт: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Стандарт: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Бизнес: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Премиум: 'text-brand-red bg-brand-red/10 border-brand-red/20',
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/30 text-sm py-6">
          <Link href="/" className="hover:text-white transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-white/60">Статья</span>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          На главную
        </Link>

        {/* Cover */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/40">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <ArticleViewCounter />
          <span className="px-2 py-0.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs">
            Полезное
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-white/60 text-lg leading-relaxed mb-10 border-l-2 border-brand-red pl-4">
          {article.excerpt}
        </p>

        {/* Intro */}
        <p className="text-white/70 text-base leading-relaxed mb-12">{content.intro}</p>

        {/* Categories */}
        <div className="space-y-10">
          {content.categories.map((cat, i) => (
            <div key={cat.name} className="card p-6 md:p-8">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border mb-1 ${categoryColors[cat.name] || ''}`}>
                    {cat.name}
                  </div>
                  <div className="text-white/40 text-xs">{cat.budget}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 text-base leading-relaxed mb-6">{cat.description}</p>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Who for */}
                <div>
                  <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Кому подходит</h4>
                  <p className="text-white/70 text-sm">{cat.whoFor}</p>
                </div>

                {/* Budget */}
                <div>
                  <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Ориентировочный бюджет</h4>
                  <p className="text-brand-red font-bold text-lg">{cat.budget}</p>
                </div>

                {/* Advantages */}
                <div>
                  <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Преимущества</h4>
                  <ul className="space-y-1.5">
                    {cat.advantages.map((adv) => (
                      <li key={adv} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Примеры моделей</h4>
                  <ul className="space-y-1.5">
                    {cat.examples.map((ex) => (
                      <li key={ex} className="text-sm text-white/60 flex items-start gap-2">
                        <span className="text-white/20 mt-0.5 flex-shrink-0">—</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-10 p-6 rounded-2xl bg-brand-red/10 border border-brand-red/20">
          <p className="text-white/80 leading-relaxed">{content.conclusion}</p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/catalog" className="btn-primary">
            Смотреть каталог
            <ArrowRight size={18} />
          </Link>
          <Link href="/quiz" className="btn-secondary">
            Подобрать авто
          </Link>
        </div>
      </div>

      <ContactSection />
    </div>
  )
}
