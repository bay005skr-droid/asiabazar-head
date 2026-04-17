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

const CATEGORIES: { value: CarCategory | null; label: string; desc: string }[] = [
  { value: null,       label: 'Все',      desc: '' },
  { value: 'standard', label: 'Стандарт', desc: 'до 2 млн' },
  { value: 'comfort',  label: 'Комфорт',  desc: '2–3.5 млн' },
  { value: 'business', label: 'Бизнес',   desc: '3.5–6 млн' },
  { value: 'premium',  label: 'Премиум',  desc: 'от 6 млн' },
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

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selected === cat.value
            const count = cat.value ? cars.filter((c) => c.category === cat.value).length : cars.length
            return (
              <button
                key={String(cat.value)}
                onClick={() => setSelected(isActive && cat.value !== null ? null : cat.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200',
                  isActive
                    ? 'bg-brand-red border-brand-red text-white shadow-red'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                )}
              >
                {cat.desc ? `${cat.label} ${cat.desc} ₽` : cat.label}
                {count > 0 && (
                  <span className={cn(
                    'ml-1.5 text-xs',
                    isActive ? 'text-white/70' : 'text-gray-400'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Cars grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayed.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-3">
            <div className="text-4xl">🔍</div>
            <p className="text-gray-400 text-sm">
              В категории «{selected ? CATEGORY_LABELS[selected] : ''}» пока нет автомобилей
            </p>
            <button
              onClick={() => setSelected(null)}
              className="text-brand-red text-sm underline-offset-2 hover:underline"
            >
              Посмотреть все
            </button>
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
