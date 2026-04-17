import Link from 'next/link'
import { ArrowRight, CalendarDays, Eye } from 'lucide-react'

interface Article {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: Date
}

interface FeaturedArticleSectionProps {
  article: Article
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}

export function FeaturedArticleSection({ article }: FeaturedArticleSectionProps) {
  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="divider-red" style={{ marginBottom: 0 }} />
            <h2 className="text-xl font-black text-gray-900">Полезные статьи</h2>
          </div>
          <Link href="/articles" className="text-sm text-brand-red font-semibold hover:underline underline-offset-2 flex items-center gap-1">
            Все статьи <ArrowRight size={14} />
          </Link>
        </div>

        <Link href={`/articles/${article.slug}`} className="group no-underline">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col md:flex-row transition-all duration-200 hover:shadow-lg hover:border-gray-200">

            {/* Cover image */}
            <div className="md:w-80 lg:w-96 flex-shrink-0">
              <div className="relative h-56 md:h-full overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 md:p-8 gap-4">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-brand-red/8 text-brand-red font-semibold text-xs">
                  Статья
                </span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3 group-hover:text-brand-red transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-2 text-brand-red font-semibold text-sm mt-1">
                Читать статью
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>

          </div>
        </Link>

      </div>
    </section>
  )
}
