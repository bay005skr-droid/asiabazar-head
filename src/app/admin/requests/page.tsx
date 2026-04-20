import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { AdminRequestActions } from '@/components/admin/AdminRequestActions'

export const metadata: Metadata = { title: 'Заявки' }

export default async function AdminRequestsPage() {
  const requests = await prisma.contactRequest.findMany({ orderBy: { createdAt: 'desc' } })
  const unread = requests.filter((r) => !r.isRead).length

  const messengerLabels: Record<string, string> = { telegram: 'TG', max: 'MAX', whatsapp: 'WA' }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Заявки</h1>
          <p className="text-white/40 text-sm mt-0.5">{requests.length} всего · {unread} непрочитанных</p>
        </div>
        {unread > 0 && (
          <span className="px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-sm font-bold">
            {unread} новых
          </span>
        )}
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
            <div className="text-center py-12 text-white/30">Заявок пока нет</div>
          )}
        </div>
      </div>
    </div>
  )
}
