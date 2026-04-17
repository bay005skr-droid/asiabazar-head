'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Gauge, Fuel, Zap } from 'lucide-react'
import { CarCard } from '@/components/cars/CarCard'
import { Car, CarCategory, CATEGORY_LABELS } from '@/types'
import { cn, formatPrice, formatMileage } from '@/lib/utils'

interface CatalogPreviewProps {
  cars: Car[]
}

const CATEGORIES: {
  value: CarCategory | null
  label: string
  price: string
  desc: string
  gradient: string
}[] = [
  { value: null,       label: 'Все авто',  price: '',          desc: 'Полный каталог',      gradient: 'from-gray-900 to-gray-700' },
  { value: 'standard', label: 'Стандарт',  price: 'до 2 млн',  desc: 'Надёжный выбор',      gradient: 'from-slate-700 to-slate-500' },
  { value: 'comfort',  label: 'Комфорт',   price: '2–3.5 млн', desc: 'Оптимальное качество', gradient: 'from-blue-700 to-blue-500' },
  { value: 'business', label: 'Бизнес',    price: '3.5–6 млн', desc: 'Престиж и функции',    gradient: 'from-violet-700 to-violet-500' },
  { value: 'premium',  label: 'Премиум',   price: 'от 6 млн',  desc: 'Лучшее из лучших',     gradient: 'from-brand-red to-rose-500' },
]

export function CatalogPreviewSection({ cars }: CatalogPreviewProps) {
  const [selected, setSelected] = useState<CarCategory | null>(null)

  const filtered = selected ? cars.filter((c) => c.category === selected) : cars
  const [featured, ...rest] = filtered
  const displayed = rest.slice(0, 11) // up to 11 more after featured = 12 total

  return (
    <section id="catalog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="section-title">Каталог автомобилей</h2>
          <p className="section-subtitle mt-2 text-base">Автомобили с проверенной историей, готовые к заказу</p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = selected === cat.value
            const count = cat.value
              ? cars.filter((c) => c.category === cat.value).length
              : cars.length
            return (
              <button
                key={String(cat.value)}
                onClick={() => setSelected(isActive && cat.value !== null ? null : cat.value)}
                className={cn(
                  `relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br text-left transition-all duration-200 cursor-pointer`,
                  cat.gradient,
                  isActive
                    ? 'ring-2 ring-offset-2 ring-brand-red scale-[1.02] shadow-xl'
                    : 'opacity-80 hover:opacity-100 hover:shadow-lg hover:scale-[1.01]'
                )}
                style={{ minHeight: 110 }}
              >
                <span className="self-end text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {count}
                </span>
                <div className="mt-2">
                  <div className="text-white font-black text-base leading-tight">{cat.label}</div>
                  {cat.price && <div className="text-white/80 text-xs font-medium mt-0.5">{cat.price} ₽</div>}
                  <div className="text-white/60 text-xs mt-0.5">{cat.desc}</div>
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-4xl">🔍</div>
            <p className="text-gray-400 text-sm">
              В категории «{selected ? CATEGORY_LABELS[selected] : ''}» пока нет автомобилей
            </p>
            <button onClick={() => setSelected(null)} className="text-brand-red text-sm hover:underline underline-offset-2">
              Посмотреть все
            </button>
          </div>
        ) : (
          <>
            {/* Featured first car — wide horizontal card */}
            {featured && (
              <Link href={`/catalog/${featured.slug}`} className="group no-underline block mb-6">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden flex flex-col sm:flex-row hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                  {/* Image */}
                  <div className="relative sm:w-72 lg:w-96 flex-shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden bg-gray-100">
                    {featured.mainImage && (
                      <img
                        src={featured.mainImage}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-red text-white">
                      В наличии
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between p-5 md:p-7 flex-1">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1 group-hover:text-brand-red transition-colors leading-tight">
                        {featured.title}
                      </h3>
                      <p className="text-brand-red font-black text-2xl mb-4">{formatPrice(featured.price)}</p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-300" />{featured.year}</span>
                        <span className="flex items-center gap-1.5"><Gauge size={14} className="text-gray-300" />{formatMileage(featured.mileage)}</span>
                        <span className="flex items-center gap-1.5"><Fuel size={14} className="text-gray-300" />{featured.engineType}</span>
                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-gray-300" />{featured.horsepower} л.с.</span>
                      </div>

                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {featured.shortDescription}
                      </p>

                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-50 text-gray-500 border border-gray-100">{featured.transmission}</span>
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-50 text-gray-500 border border-gray-100">{featured.drive}</span>
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-50 text-gray-500 border border-gray-100">{featured.bodyType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <span className="text-brand-red text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Подробнее <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-xs text-gray-300">{featured.bodyType} · {featured.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of cars — 4-column grid */}
            {displayed.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayed.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-10">
          <Link href="/catalog" className="btn-primary text-base px-8 py-4 gap-3">
            Смотреть весь каталог
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
