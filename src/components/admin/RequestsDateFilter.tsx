'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X, Download } from 'lucide-react'
import Link from 'next/link'

interface Props {
  total: number
  filtered: number
  exportHref: string
}

export function RequestsDateFilter({ total, filtered, exportHref }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const active = from || to

  const apply = (nextFrom: string, nextTo: string) => {
    const sp = new URLSearchParams()
    if (nextFrom) sp.set('from', nextFrom)
    if (nextTo)   sp.set('to', nextTo)
    router.push(`/admin/requests?${sp.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Date range */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
        <input
          type="date"
          value={from}
          onChange={(e) => apply(e.target.value, to)}
          className="bg-transparent text-white/60 text-xs outline-none cursor-pointer w-[108px]"
          style={{ colorScheme: 'dark' }}
          placeholder="Начало"
        />
        <span className="text-white/20 text-xs select-none">—</span>
        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => apply(from, e.target.value)}
          className="bg-transparent text-white/60 text-xs outline-none cursor-pointer w-[108px]"
          style={{ colorScheme: 'dark' }}
        />
        {active && (
          <button
            onClick={() => router.push('/admin/requests')}
            className="text-white/20 hover:text-white/60 transition-colors ml-0.5"
            title="Сбросить"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {active && (
        <span className="text-white/25 text-xs">{filtered} из {total}</span>
      )}

      {/* Export */}
      <Link
        href={exportHref}
        className="admin-btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
        title="Скачать CSV (открывается в Google Таблицах и Excel)"
      >
        <Download size={13} />
        CSV
      </Link>
    </div>
  )
}
