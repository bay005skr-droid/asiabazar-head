'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, X, Upload, GripVertical, Star, ImageOff } from 'lucide-react'
import { Car } from '@/types'

const TRANSMISSIONS = ['АКПП', 'МКПП', 'Вариатор', 'Робот (DSG)', 'Типтроник']
const BODY_TYPES = ['Седан', 'Внедорожник', 'Хэтчбек', 'Универсал', 'Кроссовер', 'Купе', 'Минивэн', 'Пикап', 'Лифтбэк']
const ENGINE_TYPES = ['Бензин', 'Дизель', 'Гибрид', 'Электро', 'Газ/Бензин']
const DRIVES = ['2WD (передний)', '2WD (задний)', '4WD (полный)', 'AWD (автоматический полный)']

const schema = z.object({
  brand: z.string().min(1, 'Обязательно'),
  model: z.string().min(1, 'Обязательно'),
  title: z.string().min(1, 'Обязательно'),
  category: z.enum(['comfort', 'standard', 'business', 'premium']),
  price: z.coerce.number().int().positive('Введите цену'),
  year: z.coerce.number().int().min(2000).max(2030),
  mileage: z.coerce.number().int().min(0),
  engineType: z.string().min(1, 'Выберите тип двигателя'),
  engineVolume: z.string().min(1, 'Обязательно'),
  horsepower: z.coerce.number().int().positive('Обязательно'),
  transmission: z.string().min(1, 'Выберите коробку'),
  drive: z.string().min(1, 'Выберите привод'),
  bodyType: z.string().min(1, 'Выберите тип кузова'),
  seats: z.coerce.number().int().positive(),
  configuration: z.string().min(1, 'Обязательно'),
  fullDescription: z.string().min(10, 'Введите описание'),
  status: z.enum(['active', 'sold', 'hidden']),
  damageText: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CarFormProps {
  car?: Car
  mode: 'new' | 'edit'
}

function PhotoThumb({
  url,
  index,
  isDragging,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  url: string
  index: number
  isDragging: boolean
  onRemove: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
}) {
  const [broken, setBroken] = useState(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`relative group rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all select-none ${
        isDragging ? 'opacity-40 scale-95 border-white/20' :
        index === 0 ? 'border-brand-red shadow-red' : 'border-white/10 hover:border-white/30'
      }`}
      style={{ aspectRatio: '4/3' }}
    >
      {broken ? (
        <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-1">
          <ImageOff size={20} className="text-white/20" />
          <span className="text-white/20 text-[10px]">Нет фото</span>
        </div>
      ) : (
        <img
          src={url}
          alt=""
          className="w-full h-full object-cover pointer-events-none"
          onError={() => setBroken(true)}
        />
      )}

      {index === 0 && (
        <div className="absolute top-1.5 left-1.5 bg-brand-red rounded-md px-1.5 py-0.5 text-white text-[10px] font-bold flex items-center gap-1">
          <Star size={8} fill="white" strokeWidth={0} /> Главное
        </div>
      )}
      {index > 0 && (
        <div className="absolute top-1.5 left-1.5 bg-black/60 rounded-md px-1.5 py-0.5 text-white/70 text-[10px] font-bold">
          {index + 1}
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
      >
        <X size={11} className="text-white" />
      </button>

      <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={14} className="text-white/60" />
      </div>
    </div>
  )
}

export function CarForm({ car, mode }: CarFormProps) {
  const router = useRouter()

  const [allPhotos, setAllPhotos] = useState<string[]>(() => {
    if (!car) return []
    const main = car.mainImage ? [car.mainImage] : []
    const gallery = Array.isArray(car.galleryImages) ? car.galleryImages : []
    return [...main, ...gallery]
  })
  const [damagePhotos, setDamagePhotos] = useState<string[]>(
    Array.isArray(car?.damageImages) ? car.damageImages : []
  )
  const [uploading, setUploading] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [photoError, setPhotoError] = useState('')

  const {
    register,
    handleSubmit,
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
          fullDescription: car.fullDescription, status: car.status,
          damageText: car.damageText || '',
        }
      : { category: 'standard', status: 'active', year: new Date().getFullYear(), seats: 5 },
  })

  const onSubmit = async (data: FormData) => {
    if (allPhotos.length === 0) { setPhotoError('Добавьте хотя бы одно фото'); return }
    setPhotoError('')
    const payload = {
      ...data,
      mainImage: allPhotos[0],
      galleryImages: allPhotos.slice(1),
      damageImages: damagePhotos,
      insuranceImages: [],
    }
    const url = mode === 'new' ? '/api/admin/cars' : `/api/admin/cars/${car!.id}`
    const res = await fetch(url, {
      method: mode === 'new' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { router.push('/admin/cars'); router.refresh() }
    else { const err = await res.json().catch(() => ({})); alert(err?.error || 'Ошибка сохранения') }
  }

  const uploadFiles = async (files: File[]): Promise<string[]> =>
    Promise.all(files.map(async (file) => {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await res.json()
      return d.url as string
    }))

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true); setPhotoError('')
    try { const urls = await uploadFiles(files); setAllPhotos((p) => [...p, ...urls]) }
    finally { setUploading(false); e.target.value = '' }
  }

  const handleDamageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try { const urls = await uploadFiles(files); setDamagePhotos((p) => [...p, ...urls]) }
    finally { setUploading(false); e.target.value = '' }
  }

  const handleDragStart = (i: number) => setDragIdx(i)
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const updated = [...allPhotos]
    const [item] = updated.splice(dragIdx, 1)
    updated.splice(i, 0, item)
    setAllPhotos(updated)
    setDragIdx(i)
  }
  const handleDragEnd = () => setDragIdx(null)

  // Field wrapper
  const F = ({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) => (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {hint && !error && <p className="text-white/20 text-xs mt-1">{hint}</p>}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Основная информация ── */}
      <div className="admin-card p-6 space-y-4">
        <h2 className="text-white font-bold border-b border-white/5 pb-3">Основная информация</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Марка *" error={errors.brand?.message}>
            <input {...register('brand')} placeholder="Hyundai" className="admin-input" />
          </F>
          <F label="Модель *" error={errors.model?.message}>
            <input {...register('model')} placeholder="Sonata" className="admin-input" />
          </F>
          <F label="Год *">
            <input {...register('year')} type="number" className="admin-input" />
          </F>
        </div>
        <F label="Полное название *" error={errors.title?.message}>
          <input {...register('title')} placeholder="Hyundai Sonata 2.0 Intelligent 2020" className="admin-input" />
        </F>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Цена (₽) *" error={errors.price?.message}>
            <input {...register('price')} type="number" placeholder="2500000" className="admin-input" />
          </F>
          <F label="Категория *">
            <select {...register('category')} className="admin-input">
              <option value="comfort">Комфорт</option>
              <option value="standard">Стандарт</option>
              <option value="business">Бизнес</option>
              <option value="premium">Премиум</option>
            </select>
          </F>
          <F label="Статус *">
            <select {...register('status')} className="admin-input">
              <option value="active">В наличии</option>
              <option value="sold">Продан</option>
              <option value="hidden">Скрыт</option>
            </select>
          </F>
        </div>
      </div>

      {/* ── Технические характеристики ── */}
      <div className="admin-card p-6 space-y-4">
        <h2 className="text-white font-bold border-b border-white/5 pb-3">Технические характеристики</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <F label="Пробег (км)">
            <input {...register('mileage')} type="number" placeholder="50000" className="admin-input" />
          </F>
          <F label="Тип двигателя *" error={errors.engineType?.message}>
            <select {...register('engineType')} className="admin-input">
              <option value="">Выберите...</option>
              {ENGINE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </F>
          <F label="Объём двигателя *" error={errors.engineVolume?.message}>
            <input {...register('engineVolume')} placeholder="1999 см³" className="admin-input" />
          </F>
          <F label="Мощность (л.с.) *" error={errors.horsepower?.message}>
            <input {...register('horsepower')} type="number" placeholder="150" className="admin-input" />
          </F>
          <F label="Коробка передач *" error={errors.transmission?.message}>
            <select {...register('transmission')} className="admin-input">
              <option value="">Выберите...</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </F>
          <F label="Привод *" error={errors.drive?.message}>
            <select {...register('drive')} className="admin-input">
              <option value="">Выберите...</option>
              {DRIVES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </F>
          <F label="Тип кузова *" error={errors.bodyType?.message}>
            <select {...register('bodyType')} className="admin-input">
              <option value="">Выберите...</option>
              {BODY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </F>
          <F label="Количество мест">
            <input {...register('seats')} type="number" placeholder="5" className="admin-input" />
          </F>
          <F label="Конфигурация *" error={errors.configuration?.message}>
            <input {...register('configuration')} placeholder="2.0 Intelligent" className="admin-input" />
          </F>
        </div>
      </div>

      {/* ── Описание ── */}
      <div className="admin-card p-6 space-y-4">
        <h2 className="text-white font-bold border-b border-white/5 pb-3">Описание</h2>
        <F label="Описание *" error={errors.fullDescription?.message} hint="Первые 8 слов автоматически используются в карточке">
          <textarea
            {...register('fullDescription')}
            rows={7}
            placeholder="Подробное описание автомобиля: комплектация, состояние, особенности..."
            className="admin-input resize-none"
          />
        </F>
      </div>

      {/* ── Фотографии ── */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h2 className="text-white font-bold">Фотографии</h2>
            <p className="text-white/30 text-xs mt-0.5">Первое фото — главное. Перетащите для изменения порядка.</p>
          </div>
          <label className={`btn-primary text-sm px-3 py-2 cursor-pointer flex-shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Загрузка...' : 'Добавить'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} disabled={uploading} />
          </label>
        </div>

        {allPhotos.length === 0 ? (
          <label className="block border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer hover:border-white/25 hover:bg-white/2 transition-all">
            <Upload size={32} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm font-medium">Нажмите чтобы добавить фотографии</p>
            <p className="text-white/20 text-xs mt-1">Можно выбрать несколько сразу</p>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} disabled={uploading} />
          </label>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {allPhotos.map((url, i) => (
              <PhotoThumb
                key={`${url}-${i}`}
                url={url}
                index={i}
                isDragging={dragIdx === i}
                onRemove={() => setAllPhotos((p) => p.filter((_, j) => j !== i))}
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
              />
            ))}
            <label
              className={`rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/25 hover:bg-white/2 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              style={{ aspectRatio: '4/3' }}
            >
              {uploading ? <Loader2 size={20} className="text-white/20 animate-spin" /> : (
                <><Upload size={18} className="text-white/20 mb-1" /><span className="text-white/20 text-xs">Ещё</span></>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} disabled={uploading} />
            </label>
          </div>
        )}

        {photoError && <p className="text-red-400 text-sm">{photoError}</p>}
      </div>

      {/* ── Повреждения ── */}
      <div className="admin-card p-6 space-y-4">
        <h2 className="text-white font-bold border-b border-white/5 pb-3">
          Повреждения <span className="text-white/30 font-normal text-sm">(если есть)</span>
        </h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {damagePhotos.map((url, i) => (
            <div key={i} className="relative group w-24 h-16 rounded-lg overflow-hidden border border-red-500/30">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <button
                type="button"
                onClick={() => setDamagePhotos((p) => p.filter((_, j) => j !== i))}
                className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
          <label className="w-24 h-16 rounded-lg border-2 border-dashed border-red-500/20 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/40 transition-colors">
            <Upload size={14} className="text-red-400/40 mb-1" />
            <span className="text-red-400/30 text-[10px]">Добавить</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleDamageUpload} />
          </label>
        </div>
        <textarea
          {...register('damageText')}
          placeholder="Описание повреждений..."
          rows={2}
          className="admin-input resize-none text-sm"
        />
      </div>

      {/* ── Кнопки ── */}
      <div className="flex items-center gap-3 pb-6">
        <button type="submit" disabled={isSubmitting || uploading} className="btn-primary">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {mode === 'new' ? 'Создать автомобиль' : 'Сохранить изменения'}
        </button>
        <button type="button" onClick={() => router.back()} className="admin-btn-secondary">
          Отмена
        </button>
      </div>
    </form>
  )
}
