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
const bodyTypes = ['Кроссовер', 'Внедорожник', 'Седан', 'Хэтчбек', 'Минивэн', 'Купе']
const driveTypes = ['Передний', 'Задний', 'Полный']

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
  currentBodyType: string
  currentDrive: string
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
  currentPriceMin,
  currentPriceMax,
  currentBodyType,
  currentDrive,
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
    if (currentBodyType) current.bodyType = currentBodyType
    if (currentDrive) current.drive = currentDrive

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

      {/* Filter panel */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card">
        {/* Row 1: Brand · Body type · Drive */}
        <div className="grid sm:grid-cols-3 gap-4 p-5 pb-0">
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

          <div>
            <label className="label-base">Кузов</label>
            <select
              defaultValue={currentBodyType}
              onChange={(e) => goTo(buildUrl({ bodyType: e.target.value }))}
              className="input-base"
            >
              <option value="">Любой</option>
              {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="label-base">Привод</label>
            <select
              defaultValue={currentDrive}
              onChange={(e) => goTo(buildUrl({ drive: e.target.value }))}
              className="input-base"
            >
              <option value="">Любой</option>
              {driveTypes.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 my-4 border-t border-gray-50" />

        {/* Row 2: Year · Mileage · Engine · Transmission */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5 pb-0">
          <div>
            <label className="label-base">Год выпуска</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="от"
                defaultValue={currentYearMin}
                onBlur={(e) => e.target.value !== currentYearMin && goTo(buildUrl({ yearMin: e.target.value }))}
                className="input-base min-w-0"
              />
              <input
                type="number"
                placeholder="до"
                defaultValue={currentYearMax}
                onBlur={(e) => e.target.value !== currentYearMax && goTo(buildUrl({ yearMax: e.target.value }))}
                className="input-base min-w-0"
              />
            </div>
          </div>

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

          <div>
            <label className="label-base">Коробка</label>
            <select
              defaultValue={currentTransmission}
              onChange={(e) => goTo(buildUrl({ transmission: e.target.value }))}
              className="input-base"
            >
              <option value="">Любая</option>
              {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 my-4 border-t border-gray-50" />

        {/* Row 3: Price range + Reset */}
        <div className="flex flex-col sm:flex-row gap-4 px-5 pb-5 items-end">
          <div className="flex-1">
            <label className="label-base">Цена (₽)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="от"
                defaultValue={currentPriceMin}
                onBlur={(e) => e.target.value !== currentPriceMin && goTo(buildUrl({ priceMin: e.target.value }))}
                className="input-base min-w-0"
              />
              <input
                type="number"
                placeholder="до"
                defaultValue={currentPriceMax}
                onBlur={(e) => e.target.value !== currentPriceMax && goTo(buildUrl({ priceMax: e.target.value }))}
                className="input-base min-w-0"
              />
            </div>
          </div>

          {/* Price presets */}
          <div className="flex gap-2 flex-wrap pb-px">
            {[
              { label: 'до 2 млн', max: '2000000' },
              { label: '2–4 млн', min: '2000000', max: '4000000' },
              { label: '4+ млн', min: '4000000' },
            ].map((preset) => (
              <a
                key={preset.label}
                href={buildUrl({ priceMin: preset.min ?? '', priceMax: preset.max ?? '' })}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 no-underline cursor-pointer whitespace-nowrap',
                  currentPriceMin === (preset.min ?? '') && currentPriceMax === (preset.max ?? '')
                    ? 'bg-brand-red border-brand-red text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                )}
              >
                {preset.label}
              </a>
            ))}
          </div>

          {hasFilters && (
            <a
              href="/catalog"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 text-sm font-medium no-underline transition-all whitespace-nowrap"
            >
              <X size={14} />
              Сбросить
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
