'use client'

import { useRef } from 'react'
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

  const fromRef = useRef<HTMLInputElement>(null)
  const toRef   = useRef<HTMLInputElement>(null)

  const apply = (nextFrom: string, nextTo: string) => {
    const sp = new URLSearchParams()
    if (nextFrom) sp.set('from', nextFrom)
    if (nextTo)   sp.set('to', nextTo)
    router.push(`/admin/requests?${sp.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Date range */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 h-[30px]">
        {/* clicking anywhere on the wrapper opens the picker */}
        <div className="flex items-center cursor-pointer" onClick={() => fromRef.current?.showPicker?.()}>
          <input
            ref={fromRef}
            type="date"
            value={from}
            onChange={(e) => apply(e.target.value, to)}
            className="bg-transparent text-white/60 text-xs outline-none w-[108px] cursor-pointer"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <span className="text-white/20 text-xs select-none">—</span>
        <div className="flex items-center cursor-pointer" onClick={() => toRef.current?.showPicker?.()}>
          <input
            ref={toRef}
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => apply(from, e.target.value)}
            className="bg-transparent text-white/60 text-xs outline-none w-[108px] cursor-pointer"
            style={{ colorScheme: 'dark' }}
          />
        </div>
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

      {/* Export — same height as date block */}
      <Link
        href={exportHref}
        className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-white/30 text-white/50 hover:text-white rounded-lg px-2.5 text-xs font-medium transition-all h-[30px]"
        title="Скачать CSV (открывается в Google Таблицах и Excel)"
      >
        <Download size={12} />
        CSV
      </Link>
    </div>
  )
}
