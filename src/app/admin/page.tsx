import { Metadata } from 'next'
import Link from 'next/link'
import { Car, MessageSquare, Star, TrendingUp, ArrowRight, Eye } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Дашборд' }

export default async function AdminDashboard() {
  const [totalCars, activeCars, soldCars, totalRequests, unreadRequests, totalReviews] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: 'active' } }),
    prisma.car.count({ where: { status: 'sold' } }),
    prisma.contactRequest.count(),
    prisma.contactRequest.count({ where: { isRead: false } }),
    prisma.review.count(),
  ])

  const recentRequests = await prisma.contactRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = [
    { label: 'Всего автомобилей', value: totalCars, sub: `${activeCars} активных · ${soldCars} продано`, icon: Car, href: '/admin/cars', color: 'text-blue-400' },
    { label: 'Заявки', value: totalRequests, sub: `${unreadRequests} непрочитанных`, icon: MessageSquare, href: '/admin/requests', color: 'text-amber-400', alert: unreadRequests > 0 },
    { label: 'Отзывы', value: totalReviews, sub: 'Всего в базе', icon: Star, href: '/admin/reviews', color: 'text-emerald-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Дашборд</h1>
        <p className="text-white/40 text-sm mt-1">Управление сайтом АзияБазар</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:-translate-y-0.5 transition-transform group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              {s.alert && (
                <span className="px-2 py-0.5 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-xs font-bold">
                  Новые
                </span>
              )}
            </div>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-white/60 text-sm font-medium">{s.label}</div>
            <div className="text-white/30 text-xs mt-0.5">{s.sub}</div>
            <div className="flex items-center gap-1 text-xs text-white/20 group-hover:text-white/50 mt-2 transition-colors">
              Перейти <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent requests */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-white font-bold">Последние заявки</h2>
          <Link href="/admin/requests" className="text-brand-red text-sm hover:underline">Все заявки</Link>
        </div>
        {recentRequests.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">Заявок пока нет</div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentRequests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/2 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.isRead ? 'bg-white/10' : 'bg-brand-red'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{r.name}</div>
                  <div className="text-white/40 text-xs">{r.phone} · {r.desiredCar || 'Не указано'}</div>
                </div>
                <div className="text-white/30 text-xs flex-shrink-0">
                  {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Добавить авто', href: '/admin/cars/new', icon: Car },
          { label: 'Просмотр сайта', href: '/', icon: Eye },
          { label: 'Добавить отзыв', href: '/admin/reviews', icon: Star },
          { label: 'Обновить статистику', href: '/admin/stats', icon: TrendingUp },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.href === '/' ? '_blank' : undefined}
            className="card p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-0.5 transition-all group"
          >
            <item.icon size={20} className="text-white/40 group-hover:text-brand-red transition-colors" />
            <span className="text-white/60 text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
