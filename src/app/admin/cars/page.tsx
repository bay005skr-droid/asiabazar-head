import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import prisma from '@/lib/prisma'
import { parseCar, formatPrice, formatMileage } from '@/lib/utils'
import { Car, CATEGORY_LABELS, STATUS_LABELS } from '@/types'
import { AdminCarActions } from '@/components/admin/AdminCarActions'

export const metadata: Metadata = { title: 'Автомобили' }

interface Props { searchParams: { q?: string; status?: string; category?: string } }

export default async function AdminCarsPage({ searchParams }: Props) {
  const where: Record<string, unknown> = {}
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.category) where.category = searchParams.category
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { brand: { contains: searchParams.q } },
      { model: { contains: searchParams.q } },
    ]
  }

  const carsRaw = await prisma.car.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  const cars = carsRaw.map(parseCar)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Автомобили</h1>
          <p className="text-white/40 text-sm mt-0.5">{cars.length} записей</p>
        </div>
        <Link href="/admin/cars/new" className="btn-primary text-sm px-4 py-2">
          <Plus size={16} />
          Добавить
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form className="flex-1 min-w-[200px]">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Поиск по названию..."
            className="input-base h-9 text-sm"
          />
        </form>
        <div className="flex gap-2">
          {[
            { label: 'Все', status: '' },
            { label: 'Активные', status: 'active' },
            { label: 'Проданы', status: 'sold' },
            { label: 'Скрытые', status: 'hidden' },
          ].map((f) => (
            <Link
              key={f.status}
              href={`/admin/cars${f.status ? `?status=${f.status}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                (searchParams.status || '') === f.status
                  ? 'bg-brand-red border-brand-red text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Автомобиль</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Категория</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Пробег</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden xl:table-cell">Добавил</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Цена</th>
                <th className="text-center px-4 py-3 text-white/40 font-medium">Статус</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white truncate max-w-[200px]">{car.title}</div>
                    <div className="text-white/30 text-xs">{car.year} · {car.engineType}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-white/50 text-xs">{CATEGORY_LABELS[car.category]}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-white/50 text-xs">
                    {formatMileage(car.mileage)}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-white/30 text-xs font-mono">
                      {(car as Car & { addedBy?: string }).addedBy || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    {formatPrice(car.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      car.status === 'active'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : car.status === 'sold'
                        ? 'bg-white/5 border-white/10 text-white/30'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {STATUS_LABELS[car.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminCarActions carId={car.id} carSlug={car.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">Нет автомобилей</div>
          )}
        </div>
      </div>
    </div>
  )
}
