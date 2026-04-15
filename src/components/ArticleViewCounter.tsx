'use client'

import { Eye } from 'lucide-react'
import { useArticleViews } from '@/hooks/useArticleViews'
import { formatNumber } from '@/lib/utils'

export function ArticleViewCounter() {
  const views = useArticleViews()
  return (
    <span className="flex items-center gap-1.5 text-white/40 text-sm">
      <Eye size={14} />
      {formatNumber(views)} просмотров
    </span>
  )
}
