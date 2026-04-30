'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

export function RequestsDateFilter({ total, filtered }: { total: number; filtered: number }) {
  const router = useRouter()
  const params = useSearchParams()
  const date = params.get('date') ?? ''

  const apply = (val: string) => {
    const sp = new URLSearchParams(params.toString())
    if (val) sp.set('date', val)
    else sp.delete('date')
    router.push(`/admin/requests?${sp.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => apply(e.target.value)}
        className="admin-input text-xs px-3 py-1.5 w-auto cursor-pointer"
        style={{ colorScheme: 'dark' }}
      />
      {date && (
        <button
          onClick={() => apply('')}
          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
          title="Сбросить фильтр"
        >
          <X size={14} />
        </button>
      )}
      {date && (
        <span className="text-white/30 text-xs">
          {filtered} из {total}
        </span>
      )}
    </div>
  )
}
