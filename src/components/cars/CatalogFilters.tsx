'use client'

import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CarCategory } from '@/types'

const CATEGORIES: {
  value: CarCategory | ''
  label: string
  price: string
  desc: string
  gradient: string
}[] = [
  { value: '',         label: 'Все авто',  price: '',          desc: 'Полный каталог',       gradient: 'from-gray-900 to-gray-700' },
  { value: 'standard', label: 'Стандарт',  price: 'до 2 млн',  desc: 'Надёжный выбор',       gradient: 'from-slate-700 to-slate-500' },
  { value: 'comfort',  label: 'Комфорт',   price: '2–3.5 млн', desc: 'Оптимальное качество',  gradient: 'from-blue-700 to-blue-500' },
  { value: 'business', label: 'Бизнес',    price: '3.5–6 млн', desc: 'Престиж и функции',     gradient: 'from-violet-700 to-violet-500' },
  { value: 'premium',  label: 'Премиум',   price: 'от 6 млн',  desc: 'Лучшее из лучших',      gradient: 'from-brand-red to-rose-500' },
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
  currentPriceMin: string
  currentPriceMax: string
  hasFilters: boolean
}

// Uniform select wrapper with custom arrow
function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm
          focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20
          transition-all duration-200 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

// Uniform range input — looks like one control
function RangeInput({
  placeholderFrom,
  placeholderTo,
  valueFrom,
  valueTo,
  onBlurFrom,
  onBlurTo,
}: {
  placeholderFrom: string
  placeholderTo: string
  valueFrom: string
  valueTo: string
  onBlurFrom: (v: string) => void
  onBlurTo: (v: string) => void
}) {
  return (
    <div className="flex items-center h-10 border border-gray-200 rounded-lg overflow-hidden bg-white
      focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red/20 transition-all duration-200">
      <input
        type="number"
        placeholder={placeholderFrom}
        defaultValue={valueFrom}
        onBlur={(e) => onBlurFrom(e.target.value)}
        className="flex-1 min-w-0 h-full px-3 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent
          border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="text-gray-300 text-xs px-1 flex-shrink-0 select-none">—</span>
      <input
        type="number"
        placeholder={placeholderTo}
        defaultValue={valueTo}
        onBlur={(e) => onBlurTo(e.target.value)}
        className="flex-1 min-w-0 h-full px-3 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent
          border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}

// Single input uniform height
function SingleInput({
  placeholder,
  value,
  onBlur,
}: {
  placeholder: string
  value: string
  onBlur: (v: string) => void
}) {
  return (
    <input
      type="number"
      placeholder={placeholder}
      defaultValue={value}
      onBlur={(e) => onBlur(e.target.value)}
      className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900
        placeholder:text-gray-400 focus:outline-none focus:border-brand-red focus:ring-1
        focus:ring-brand-red/20 transition-all duration-200
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  )
}

export function CatalogFilters({
  currentCategory,
  currentBrand,
  currentEngineType,
  currentTransmission,
  currentYearMin,
  currentYearMax,
  currentMileageMax,
  currentPriceMin,
  currentPriceMax,
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
    if (currentPriceMin) current.priceMin = currentPriceMin
    if (currentPriceMax) current.priceMax = currentPriceMax

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
    <div className="space-y-4">

      {/* Category gradient cards — same as homepage */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value
          return (
            <a
              key={cat.value}
              href={buildUrl({ category: cat.value })}
              className={cn(
                'relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br text-left no-underline transition-all duration-200',
                cat.gradient,
                isActive
                  ? 'ring-2 ring-offset-2 ring-brand-red scale-[1.02] shadow-xl opacity-100'
                  : 'opacity-80 hover:opacity-100 hover:shadow-lg hover:scale-[1.01]'
              )}
              style={{ minHeight: 100 }}
            >
              <div className="mt-auto pt-4">
                <div className="text-white font-black text-sm leading-tight">{cat.label}</div>
                {cat.price && <div className="text-white/80 text-xs font-medium mt-0.5">{cat.price} ₽</div>}
                <div className="text-white/55 text-xs mt-0.5">{cat.desc}</div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Uniform filter grid */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">

          <div>
            <label className="label-base">Модель</label>
            <FilterSelect value={currentBrand} onChange={(v) => goTo(buildUrl({ brand: v }))}>
              <option value="">Все марки</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </FilterSelect>
          </div>

          <div>
            <label className="label-base">Тип топлива</label>
            <FilterSelect value={currentEngineType} onChange={(v) => goTo(buildUrl({ engineType: v }))}>
              <option value="">Любое</option>
              {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
            </FilterSelect>
          </div>

          <div>
            <label className="label-base">Коробка передач</label>
            <FilterSelect value={currentTransmission} onChange={(v) => goTo(buildUrl({ transmission: v }))}>
              <option value="">Любая</option>
              {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
            </FilterSelect>
          </div>

          <div>
            <label className="label-base">Год выпуска</label>
            <RangeInput
              placeholderFrom="от"
              placeholderTo="до"
              valueFrom={currentYearMin}
              valueTo={currentYearMax}
              onBlurFrom={(v) => v !== currentYearMin && goTo(buildUrl({ yearMin: v }))}
              onBlurTo={(v) => v !== currentYearMax && goTo(buildUrl({ yearMax: v }))}
            />
          </div>

          <div>
            <label className="label-base">Пробег до, км</label>
            <SingleInput
              placeholder="100 000"
              value={currentMileageMax}
              onBlur={(v) => v !== currentMileageMax && goTo(buildUrl({ mileageMax: v }))}
            />
          </div>

          <div>
            <label className="label-base">Цена, ₽</label>
            <RangeInput
              placeholderFrom="от"
              placeholderTo="до"
              valueFrom={currentPriceMin}
              valueTo={currentPriceMax}
              onBlurFrom={(v) => v !== currentPriceMin && goTo(buildUrl({ priceMin: v }))}
              onBlurTo={(v) => v !== currentPriceMax && goTo(buildUrl({ priceMax: v }))}
            />
          </div>

        </div>

        {hasFilters && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <a
              href="/catalog"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200
                text-gray-500 hover:border-gray-400 hover:text-gray-700 text-sm font-medium no-underline transition-all"
            >
              <X size={13} />
              Сбросить фильтры
            </a>
          </div>
        )}
      </div>

    </div>
  )
}
