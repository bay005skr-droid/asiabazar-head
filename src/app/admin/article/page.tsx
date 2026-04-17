import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, ExternalLink, Trash2 } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Статьи' }

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Статьи</h1>
          <p className="text-white/40 text-sm mt-0.5">{articles.length} статей</p>
        </div>
        <Link href="/admin/article/new" className="btn-primary text-sm px-4 py-2">
          <Plus size={16} />
          Создать статью
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            <p>Статей пока нет</p>
            <Link href="/admin/article/new" className="text-brand-red text-sm hover:underline mt-2 inline-block">
              Создать первую →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors">
                {article.coverImage && (
                  <img src={article.coverImage} alt="" className="w-16 h-10 rounded-lg object-cover flex-shrink-0 opacity-70" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{article.title}</div>
                  <div className="text-white/30 text-xs mt-0.5">
                    {new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · /articles/'}{article.slug}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/articles/${article.slug}`} target="_blank"
                    className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-all" title="Открыть">
                    <ExternalLink size={14} />
                  </Link>
                  <Link href={`/admin/article/${article.id}/edit`}
                    className="p-1.5 text-white/30 hover:text-brand-red rounded-lg hover:bg-brand-red/10 transition-all" title="Редактировать">
                    <Pencil size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
