import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminArticleEditor } from '@/components/admin/AdminArticleEditor'

export const metadata: Metadata = { title: 'Новая статья' }

export default function NewArticlePage() {
  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/admin/article" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft size={14} /> Все статьи
      </Link>
      <h1 className="text-2xl font-black text-white">Новая статья</h1>
      <AdminArticleEditor article={null} />
    </div>
  )
}
