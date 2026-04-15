'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, Plus, X, Upload, Star } from 'lucide-react'
import { Car } from '@/types'
import { cn } from '@/lib/utils'

const schema = z.object({
  brand: z.string().min(1, 'Обязательно'),
  model: z.string().min(1, 'Обязательно'),
  title: z.string().min(1, 'Обязательно'),
  category: z.enum(['comfort', 'standard', 'business', 'premium']),
  price: z.coerce.number().int().positive('Введите цену'),
  year: z.coerce.number().int().min(2000).max(2030),
  mileage: z.coerce.number().int().min(0),
  engineType: z.string().min(1),
  engineVolume: z.string().min(1),
  horsepower: z.coerce.number().int().positive(),
  transmission: z.string().min(1),
  drive: z.string().min(1),
  bodyType: z.string().min(1),
  seats: z.coerce.number().int().positive(),
  configuration: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  mainImage: z.string().min(1, 'Укажите главное фото'),
  status: z.enum(['active', 'sold', 'hidden']),
  damageText: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CarFormProps {
  car?: Car
  mode: 'new' | 'edit'
}

export function CarForm({ car, mode }: CarFormProps) {
  const router = useRouter()
  const [galleryImages, setGalleryImages] = useState<string[]>(car?.galleryImages || [])
  const [damageImages, setDamageImages] = useState<string[]>(car?.damageImages || [])
  const [insuranceImages, setInsuranceImages] = useState<string[]>(car?.insuranceImages || [])
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: car
      ? {
          brand: car.brand, model: car.model, title: car.title,
          category: car.category, price: car.price, year: car.year,
          mileage: car.mileage, engineType: car.engineType, engineVolume: car.engineVolume,
          horsepower: car.horsepower, transmission: car.transmission, drive: car.drive,
          bodyType: car.bodyType, seats: car.seats, configuration: car.configuration,
          shortDescription: car.shortDescription, fullDescription: car.fullDescription,
          mainImage: car.mainImage, status: car.status, damageText: car.damageText || '',
        }
      : { category: 'standard', status: 'active', year: 2020, seats: 5 },
  })

  const mainImage = watch('mainImage')

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, galleryImages, damageImages, insuranceImages }
    const url = mode === 'new' ? '/api/admin/cars' : `/api/admin/cars/${car!.id}`
    const method = mode === 'new' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/cars')
      router.refresh()
    } else {
      alert('Ошибка сохранения')
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const data = await res.json()
    return data.url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'damage' | 'insurance') => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadFile))
      if (target === 'gallery') setGalleryImages((prev) => [...prev, ...urls])
      if (target === 'damage') setDamageImages((prev) => [...prev, ...urls])
      if (target === 'insurance') setInsuranceImages((prev) => [...prev, ...urls])
    } finally {
      setUploading(false)
    }
  }

  const F = ({ label, name, error, children }: { label: string; name?: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="label-base">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic info */}
      <div className="card p-6 space-y-4">
        <h2 className="text-white font-bold text-lg border-b border-white/5 pb-3">Основная информация</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Марка *" error={errors.brand?.message}>
            <input {...register('brand')} placeholder="Hyundai" className="input-base" />
          </F>
          <F label="Модель *" error={errors.model?.message}>
            <input {...register('model')} placeholder="Sonata" className="input-base" />
          </F>
          <F label="Категория *">
            <select {...register('category')} className="input-base">
              <option value="comfort">Комфорт</option>
              <option value="standard">Стандарт</option>
              <option value="business">Бизнес</option>
              <option value="premium">Премиум</option>
            </select>
          </F>
        </div>
        <F label="Полное название *" error={errors.title?.message}>
          <input {...register('title')} placeholder="Hyundai Sonata 2.0 Intelligent 2020" className="input-base" />
        </F>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Цена (₽) *" error={errors.price?.message}>
            <input {...register('price')} type="number" className="input-base" />
          </F>
          <F label="Статус *">
            <select {...register('status')} className="input-base">
              <option value="active">В наличии</option>
              <option value="sold">Продан</option>
              <option value="hidden">Скрыт</option>
            </select>
          </F>
          <F label="Год *">
            <input {...register('year')} type="number" className="input-base" />
          </F>
        </div>
      </div>

      {/* Specs */}
      <div className="card p-6 space-y-4">
        <h2 className="text-white font-bold text-lg border-b border-white/5 pb-3">Технические характеристики</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Пробег (км)', name: 'mileage', type: 'number' },
            { label: 'Тип двигателя', name: 'engineType', placeholder: 'Бензин' },
            { label: 'Объём двигателя', name: 'engineVolume', placeholder: '1999 см³' },
            { label: 'Мощность (л.с.)', name: 'horsepower', type: 'number' },
            { label: 'Коробка передач', name: 'transmission', placeholder: 'АКПП' },
            { label: 'Привод', name: 'drive', placeholder: '2WD (передний)' },
            { label: 'Тип кузова', name: 'bodyType', placeholder: 'Седан' },
            { label: 'Количество мест', name: 'seats', type: 'number' },
            { label: 'Конфигурация', name: 'configuration', placeholder: '2.0 Intelligent' },
          ].map((f) => (
            <F key={f.name} label={f.label}>
              <input
                {...register(f.name as keyof FormData)}
                type={f.type || 'text'}
                placeholder={f.placeholder}
                className="input-base"
              />
            </F>
          ))}
        </div>
      </div>

      {/* Descriptions */}
      <div className="card p-6 space-y-4">
        <h2 className="text-white font-bold text-lg border-b border-white/5 pb-3">Описание</h2>
        <F label="Краткое описание (для карточки) *" error={errors.shortDescription?.message}>
          <textarea {...register('shortDescription')} rows={3} className="input-base resize-none" />
        </F>
        <F label="Полное описание *" error={errors.fullDescription?.message}>
          <textarea {...register('fullDescription')} rows={6} className="input-base resize-none" />
        </F>
      </div>

      {/* Images */}
      <div className="card p-6 space-y-6">
        <h2 className="text-white font-bold text-lg border-b border-white/5 pb-3">Фотографии</h2>

        {/* Main image */}
        <F label="Главное фото (URL) *" error={errors.mainImage?.message}>
          <input {...register('mainImage')} placeholder="https://..." className="input-base" />
          {mainImage && (
            <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-white/10">
              <img src={mainImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 bg-brand-red rounded px-1 text-white text-[10px] font-bold">Главное</div>
            </div>
          )}
        </F>

        {/* Gallery */}
        <div>
          <label className="label-base">Галерея</label>
          <div className="flex gap-2 flex-wrap mb-3">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
            <label className="w-24 h-16 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
              <Upload size={14} className="text-white/30 mb-1" />
              <span className="text-white/30 text-[10px]">Загрузить</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} />
            </label>
          </div>
          <div className="flex gap-2">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Или вставьте URL..."
              className="input-base text-sm h-9 flex-1"
            />
            <button
              type="button"
              onClick={() => { if (imageUrl) { setGalleryImages((p) => [...p, imageUrl]); setImageUrl('') } }}
              className="btn-secondary text-sm px-3 py-2"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Damage images */}
        <div>
          <label className="label-base">Фото ДТП (если есть)</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {damageImages.map((img, i) => (
              <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border border-red-500/30 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setDamageImages((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
            <label className="w-24 h-16 rounded-lg border-2 border-dashed border-red-500/20 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/40 transition-colors">
              <Upload size={14} className="text-red-400/50 mb-1" />
              <span className="text-red-400/50 text-[10px]">ДТП</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e, 'damage')} />
            </label>
          </div>
          <F label="">
            <textarea {...register('damageText')} placeholder="Описание повреждений..." rows={2} className="input-base resize-none text-sm" />
          </F>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting || uploading} className="btn-primary">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {mode === 'new' ? 'Создать автомобиль' : 'Сохранить изменения'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Отмена
        </button>
      </div>
    </form>
  )
}
