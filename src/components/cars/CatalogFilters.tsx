'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CarCategory } from '@/types'

const categories: { value: CarCategory | ''; label: string }[] = [
  { value: '', label: 'Все' },
  { value: 'comfort', label: 'Комфорт' },
  { value: 'standard', label: 'Стандарт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'premium', label: 'Премиум' },
]

const brands = ['Hyundai', 'Kia', 'Genesis', 'Samsung', 'SsangYong']
const fuelTypes = ['Бензин', 'Дизель', 'Гибрид', 'Электро']
const transmissions = ['АКПП', 'МКПП', 'Вариатор', 'Робот']

interface CatalogFiltersProps {
  currentCategory: string
  currentBrand: string
  currentEngineType: string
  currentTransmission: string
  currentYearMin: string
  currentYearMax: string
  currentMileageMax: string
  hasFilters: boolean
}

export function CatalogFilters({
  currentCategory,
  currentBrand,
  currentEngineType,
  currentTransmission,
  currentYearMin,
  currentYearMax,
  currentMileageMax,
  hasFilters,
}: CatalogFiltersProps) {
  const buildUrl = (updates: Record<string, string>): string => {
    const current: Record<string, string> = {}
    if (currentCategory) current.category = currentCategory
    if (currentBrand) current.brand = currentBrand
    if (currentEngineType) current.engineType = currentEngineType
    if (currentTransmission) current.transmission = currentTransmission
    if (currentYearMin) current.yearMin = currentYearMin
    if (currentYearMax) current.yearMax = currentYearMax
    if (currentMileageMax) current.mileageMax = currentMileageMax

    Object.entries(updates).forEach(([k, v]) => {
      if (v) current[k] = v
      else delete current[k]
    })
    delete current.page

    const qs = new URLSearchParams(current).toString()
    return `/catalog${qs ? '?' + qs : ''}`
  }

  const goTo = (url: string) => { window.location.href = url }

  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <a
            key={cat.value}
            href={buildUrl({ category: cat.value })}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer no-underline',
              currentCategory === cat.value
                ? 'bg-brand-red border-brand-red text-white shadow-red'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
            )}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {/* Filters — always visible */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 shadow-card">

        {/* Brand */}
        <div>
          <label className="label-base">Марка</label>
          <select
            defaultValue={currentBrand}
            onChange={(e) => goTo(buildUrl({ brand: e.target.value }))}
            className="input-base"
          >
            <option value="">Все марки</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="label-base">Год (от–до)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="2018"
              defaultValue={currentYearMin}
              onBlur={(e) => e.target.value !== currentYearMin && goTo(buildUrl({ yearMin: e.target.value }))}
              className="input-base"
            />
            <input
              type="number"
              placeholder="2024"
              defaultValue={currentYearMax}
              onBlur={(e) => e.target.value !== currentYearMax && goTo(buildUrl({ yearMax: e.target.value }))}
              className="input-base"
            />
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label className="label-base">Пробег до (км)</label>
          <input
            type="number"
            placeholder="100 000"
            defaultValue={currentMileageMax}
            onBlur={(e) => e.target.value !== currentMileageMax && goTo(buildUrl({ mileageMax: e.target.value }))}
            className="input-base"
          />
        </div>

        {/* Fuel */}
        <div>
          <label className="label-base">Тип топлива</label>
          <select
            defaultValue={currentEngineType}
            onChange={(e) => goTo(buildUrl({ engineType: e.target.value }))}
            className="input-base"
          >
            <option value="">Любое</option>
            {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="label-base">Коробка передач</label>
          <select
            defaultValue={currentTransmission}
            onChange={(e) => goTo(buildUrl({ transmission: e.target.value }))}
            className="input-base"
          >
            <option value="">Любая</option>
            {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <div className="flex items-end sm:col-span-2 lg:col-span-5">
            <a
              href="/catalog"
              className="flex items-center gap-2 btn-secondary px-4 py-2.5 text-sm no-underline cursor-pointer"
            >
              <X size={14} />
              Сбросить фильтры
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
