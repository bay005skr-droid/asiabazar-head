'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CarCategory, CATEGORY_LABELS } from '@/types'

const categories: { value: CarCategory | ''; label: string }[] = [
  { value: '', label: 'Все категории' },
  { value: 'comfort', label: 'Комфорт' },
  { value: 'standard', label: 'Стандарт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'premium', label: 'Премиум' },
]

const sortOptions = [
  { value: 'newest', label: 'По новизне' },
  { value: 'price_asc', label: 'Цена: дешевле' },
  { value: 'price_desc', label: 'Цена: дороже' },
  { value: 'year_desc', label: 'Год: новее' },
  { value: 'mileage_asc', label: 'Пробег: меньше' },
]

const fuelTypes = ['Бензин', 'Дизель', 'Гибрид', 'Электро']
const brands = ['Hyundai', 'Kia', 'Genesis', 'Samsung', 'SsangYong']

export function CatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => {
    router.push(pathname)
  }

  const hasFilters = searchParams.toString().length > 0
  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap flex-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => update('category', cat.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200',
                currentCategory === cat.value
                  ? 'bg-brand-red border-brand-red text-white shadow-red'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => update('sort', e.target.value)}
            className="input-base pr-10 appearance-none cursor-pointer min-w-[180px]"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-brand-dark">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all',
            showFilters
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
          )}
        >
          <SlidersHorizontal size={15} />
          Фильтры
          {hasFilters && (
            <span className="w-5 h-5 rounded-full bg-brand-red text-white text-xs flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="card p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Brand */}
          <div>
            <label className="label-base">Марка</label>
            <select
              value={searchParams.get('brand') || ''}
              onChange={(e) => update('brand', e.target.value)}
              className="input-base"
            >
              <option value="">Все марки</option>
              {brands.map((b) => (
                <option key={b} value={b} className="bg-brand-dark">{b}</option>
              ))}
            </select>
          </div>

          {/* Fuel */}
          <div>
            <label className="label-base">Тип топлива</label>
            <select
              value={searchParams.get('engineType') || ''}
              onChange={(e) => update('engineType', e.target.value)}
              className="input-base"
            >
              <option value="">Любое</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f} className="bg-brand-dark">{f}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="label-base">Цена от (₽)</label>
            <input
              type="number"
              placeholder="1 000 000"
              value={searchParams.get('priceMin') || ''}
              onChange={(e) => update('priceMin', e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Цена до (₽)</label>
            <input
              type="number"
              placeholder="10 000 000"
              value={searchParams.get('priceMax') || ''}
              onChange={(e) => update('priceMax', e.target.value)}
              className="input-base"
            />
          </div>

          {/* Year */}
          <div>
            <label className="label-base">Год от</label>
            <input
              type="number"
              placeholder="2018"
              value={searchParams.get('yearMin') || ''}
              onChange={(e) => update('yearMin', e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Год до</label>
            <input
              type="number"
              placeholder="2024"
              value={searchParams.get('yearMax') || ''}
              onChange={(e) => update('yearMax', e.target.value)}
              className="input-base"
            />
          </div>

          {/* Mileage */}
          <div>
            <label className="label-base">Пробег до (км)</label>
            <input
              type="number"
              placeholder="100 000"
              value={searchParams.get('mileageMax') || ''}
              onChange={(e) => update('mileageMax', e.target.value)}
              className="input-base"
            />
          </div>

          {/* Clear */}
          <div className="flex items-end">
            <button
              onClick={clearAll}
              className="flex items-center gap-2 btn-secondary w-full justify-center py-3 text-sm"
            >
              <X size={14} />
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
