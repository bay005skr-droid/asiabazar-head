'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

export function RequestsDateFilter({ total, filtered }: { total: number; filtered: number }) {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const active = from || to

  const apply = (nextFrom: string, nextTo: string) => {
    const sp = new URLSearchParams()
    if (nextFrom) sp.set('from', nextFrom)
    if (nextTo) sp.set('to', nextTo)
    router.push(`/admin/requests?${sp.toString()}`)
  }

  const reset = () => router.push('/admin/requests')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-white/30 text-xs hidden sm:block">с</span>
      <input
        type="date"
        value={from}
        onChange={(e) => apply(e.target.value, to)}
        className="admin-input text-xs px-3 py-1.5 w-auto cursor-pointer"
        style={{ colorScheme: 'dark' }}
      />
      <span className="text-white/30 text-xs">по</span>
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => apply(from, e.target.value)}
        className="admin-input text-xs px-3 py-1.5 w-auto cursor-pointer"
        style={{ colorScheme: 'dark' }}
      />
      {active && (
        <button
          onClick={reset}
          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
          title="Сбросить период"
        >
          <X size={14} />
        </button>
      )}
      {active && (
        <span className="text-white/30 text-xs">{filtered} из {total}</span>
      )}
    </div>
  )
}
