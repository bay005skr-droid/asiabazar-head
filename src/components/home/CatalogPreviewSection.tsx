'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CarCard } from '@/components/cars/CarCard'
import { Car, CarCategory, CATEGORY_LABELS } from '@/types'
import { cn } from '@/lib/utils'

interface CatalogPreviewProps {
  cars: Car[]
}

const CATEGORIES: {
  value: CarCategory | null
  label: string
  price: string
  desc: string
  subdesc?: string
  gradient: string
}[] = [
  { value: null,       label: 'Все авто',  price: '',           desc: 'Полный каталог',      subdesc: 'Ежедневно новые', gradient: 'from-gray-900 to-gray-700' },
  { value: 'standard', label: 'Стандарт',  price: 'до 1.5 млн', desc: 'Надёжный выбор',      gradient: 'from-slate-700 to-slate-500' },
  { value: 'comfort',  label: 'Комфорт',   price: '1.5–2 млн',  desc: 'Оптимальное качество', gradient: 'from-blue-700 to-blue-500' },
  { value: 'business', label: 'Бизнес',    price: '2–4 млн',    desc: 'Престиж и функции',    gradient: 'from-violet-700 to-violet-500' },
  { value: 'premium',  label: 'Премиум',   price: 'от 4 млн',   desc: 'Лучшее из лучших',     gradient: 'from-brand-red to-rose-500' },
]

export function CatalogPreviewSection({ cars }: CatalogPreviewProps) {
  const [selected, setSelected] = useState<CarCategory | null>(null)

  const filtered = selected ? cars.filter((c) => c.category === selected) : cars
  const displayed = filtered.slice(0, 8)

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
                  {cat.subdesc && <div className="text-white/40 text-xs mt-0.5">{cat.subdesc}</div>}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayed.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
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
