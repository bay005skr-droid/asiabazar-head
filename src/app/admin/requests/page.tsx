import { Metadata } from 'next'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { AdminRequestActions } from '@/components/admin/AdminRequestActions'
import { RequestsDateFilter } from '@/components/admin/RequestsDateFilter'

export const metadata: Metadata = { title: 'Заявки' }

interface Props { searchParams: { date?: string } }

export default async function AdminRequestsPage({ searchParams }: Props) {
  const date = searchParams.date

  // Build date range filter if date selected
  let where = {}
  if (date) {
    const from = new Date(date)
    from.setHours(0, 0, 0, 0)
    const to = new Date(date)
    to.setHours(23, 59, 59, 999)
    where = { createdAt: { gte: from, lte: to } }
  }

  const [all, requests] = await Promise.all([
    prisma.contactRequest.count(),
    prisma.contactRequest.findMany({ where, orderBy: { createdAt: 'desc' } }),
  ])

  const unread = requests.filter((r) => !r.isRead).length
  const messengerLabels: Record<string, string> = { telegram: 'TG', max: 'MAX', whatsapp: 'WA' }

  // Export link with date filter applied
  const exportHref = date
    ? `/api/admin/requests/export?date=${date}`
    : '/api/admin/requests/export'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">Заявки</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {date ? `${requests.length} за день` : `${all} всего`}
              {!date && unread > 0 && ` · ${unread} непрочитанных`}
            </p>
          </div>
          {!date && unread > 0 && (
            <span className="px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-sm font-bold">
              {unread} новых
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Suspense>
            <RequestsDateFilter total={all} filtered={requests.length} />
          </Suspense>
          <Link
            href={exportHref}
            className="admin-btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            title="Скачать CSV (открывается в Google Таблицах и Excel)"
          >
            <Download size={13} />
            Экспорт CSV
          </Link>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Клиент</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Запрос</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Бюджет</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Связь</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Дата</th>
                <th className="text-center px-4 py-3 text-white/40 font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((r) => (
                <tr key={r.id} className={`transition-colors ${!r.isRead ? 'bg-brand-red/5 hover:bg-brand-red/8' : 'hover:bg-white/3'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${r.isRead ? 'bg-white/10' : 'bg-brand-red'}`} />
                      <div>
                        <div className="text-white font-medium">{r.name}</div>
                        <a href={`tel:${r.phone}`} className="text-white/40 text-xs hover:text-brand-red">{r.phone}</a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-white/70 text-xs truncate max-w-[150px]">{r.desiredCar || '—'}</div>
                    {r.deliveryCity && <div className="text-white/30 text-xs">{r.deliveryCity}</div>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-white/50 text-xs">{r.budget || '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/40 border border-white/10">
                      {messengerLabels[r.preferredMessenger] || r.preferredMessenger}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/30 text-xs">
                    {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                    <div className="text-white/20">
                      {new Date(r.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      r.isRead
                        ? 'bg-white/5 border-white/10 text-white/30'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {r.isRead ? 'Прочитано' : 'Новая'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminRequestActions requestId={r.id} isRead={r.isRead} comment={r.comment || ''} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="text-center py-12 text-white/30">
              {date ? 'За этот день заявок нет' : 'Заявок пока нет'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
