import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AdminArticleEditor } from '@/components/admin/AdminArticleEditor'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Редактировать статью' }

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) notFound()

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/admin/article" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft size={14} /> Все статьи
      </Link>
      <h1 className="text-2xl font-black text-white">Редактировать статью</h1>
      <AdminArticleEditor article={{ ...article, publishedAt: article.publishedAt.toISOString() }} />
    </div>
  )
}
