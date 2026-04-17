import { Metadata } from 'next'
import Link from 'next/link'
import { Car, Plus, Eye, ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Дашборд' }

export default async function AdminDashboard() {
  const [totalCars, activeCars, soldCars, hiddenCars] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: 'active' } }),
    prisma.car.count({ where: { status: 'sold' } }),
    prisma.car.count({ where: { status: 'hidden' } }),
  ])

  const recentCars = await prisma.car.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { id: true, title: true, price: true, status: true, brand: true, year: true, createdAt: true },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Дашборд</h1>
          <p className="text-white/40 text-sm mt-1">Управление автомобилями</p>
        </div>
        <Link href="/admin/cars/new" className="btn-primary text-sm px-4 py-2">
          <Plus size={16} />
          Добавить авто
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Всего', value: totalCars, color: 'text-blue-400' },
          { label: 'В наличии', value: activeCars, color: 'text-emerald-400' },
          { label: 'Продано', value: soldCars, color: 'text-white/50' },
          { label: 'Скрыто', value: hiddenCars, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="admin-card p-5">
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent cars */}
      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-white font-bold">Последние добавленные</h2>
          <Link href="/admin/cars" className="text-brand-red text-sm hover:underline flex items-center gap-1">
            Все автомобили <ArrowRight size={14} />
          </Link>
        </div>
        {recentCars.length === 0 ? (
          <div className="p-10 text-center">
            <Car size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Автомобилей пока нет</p>
            <Link href="/admin/cars/new" className="mt-4 inline-flex btn-primary text-sm px-4 py-2">
              Добавить первый
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentCars.map((car) => (
              <Link
                key={car.id}
                href={`/admin/cars/${car.id}/edit`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-white/2 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Car size={14} className="text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate group-hover:text-brand-red transition-colors">
                    {car.title}
                  </div>
                  <div className="text-white/30 text-xs">{car.brand} · {car.year}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white text-sm font-bold">
                    {car.price.toLocaleString('ru-RU')} ₽
                  </div>
                  <span className={`text-xs ${
                    car.status === 'active' ? 'text-emerald-400' :
                    car.status === 'sold' ? 'text-white/30' : 'text-amber-400'
                  }`}>
                    {car.status === 'active' ? 'В наличии' : car.status === 'sold' ? 'Продан' : 'Скрыт'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin/cars/new" className="admin-card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
            <Plus size={18} className="text-brand-red" />
          </div>
          <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">Добавить автомобиль</span>
        </Link>
        <Link href="/" target="_blank" className="admin-card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Eye size={18} className="text-white/40 group-hover:text-white transition-colors" />
          </div>
          <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">Просмотр сайта</span>
        </Link>
      </div>
    </div>
  )
}
