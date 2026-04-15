import { Metadata } from 'next'
import { AdminArticleEditor } from '@/components/admin/AdminArticleEditor'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Статья' }

export default async function AdminArticlePage() {
  const article = await prisma.article.findFirst()
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-black text-white">Редактировать статью</h1>
      <AdminArticleEditor article={article} />
    </div>
  )
}
