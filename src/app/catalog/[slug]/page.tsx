import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ImageGallery } from '@/components/cars/ImageGallery'
import { CarCard } from '@/components/cars/CarCard'
import { ContactForm } from '@/components/forms/ContactForm'
import prisma from '@/lib/prisma'
import { parseCar, formatPrice, formatMileage } from '@/lib/utils'
import { CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS } from '@/types'
import { Calendar, Gauge, Fuel, Zap, Car, Users, ArrowLeft, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CarViewTracker } from '@/components/analytics/CarViewTracker'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = await prisma.car.findUnique({ where: { slug: params.slug } })
  if (!raw) return { title: 'Автомобиль не найден' }
  return {
    title: raw.title,
    description: raw.shortDescription,
  }
}

export default async function CarDetailPage({ params }: Props) {
  const raw = await prisma.car.findUnique({ where: { slug: params.slug } })
  if (!raw || raw.status === 'hidden') notFound()

  const car = parseCar(raw as Record<string, unknown>)

  const similarSlugs = car.similarCars.slice(0, 4)
  const similarRaw = await prisma.car.findMany({
    where: { slug: { in: similarSlugs }, status: 'active' },
  })
  const similarCars = similarRaw.map(parseCar)

  const specs = [
    { label: 'Конфигурация', value: car.configuration },
    { label: 'Двигатель', value: car.engineType },
    { label: 'Объём двигателя', value: car.engineVolume },
    { label: 'Мощность, л.с.', value: String(car.horsepower) },
    { label: 'Коробка передач', value: car.transmission },
    { label: 'Добавлено', value: new Date(car.addedAt).toLocaleDateString('ru-RU') },
    { label: 'Пробег, км', value: formatMileage(car.mileage) },
    { label: 'Выпуск', value: `${car.year} г.` },
    { label: 'Привод', value: car.drive },
    { label: 'Кузов', value: car.bodyType },
    { label: 'Мест', value: String(car.seats) },
  ]

  const allImages = [car.mainImage, ...car.galleryImages.filter((i) => i !== car.mainImage)]

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <CarViewTracker slug={car.slug} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 text-sm py-6">
          <Link href="/" className="hover:text-brand-red transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-brand-red transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{car.title}</span>
        </div>

        {/* Back */}
        <Link href="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          Назад в каталог
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mb-16">
          {/* Left */}
          <div className="space-y-5">
            <ImageGallery images={allImages} title={car.title} />

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
              <h3 className="text-gray-900 font-bold text-lg mb-4">Описание</h3>
              <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {car.fullDescription}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
              <h3 className="text-gray-900 font-bold text-lg mb-4">Технические характеристики</h3>
              <div className="divide-y divide-gray-50">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center py-3">
                    <span className="text-gray-400 text-sm">{spec.label}</span>
                    <span className="text-gray-900 text-sm font-medium text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Damage block */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert size={18} className="text-gray-400" />
                <h3 className="text-gray-900 font-bold text-lg">ДТП и страховые выплаты</h3>
              </div>

              {car.damageImages.length > 0 || car.damageText ? (
                <div className="space-y-4">
                  {car.damageText && (
                    <p className="text-gray-500 text-sm">{car.damageText}</p>
                  )}
                  {car.damageImages.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Фото повреждений</p>
                      <div className="grid grid-cols-3 gap-2">
                        {car.damageImages.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                            <Image src={img} alt={`ДТП ${i + 1}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {car.insuranceImages.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Страховые выплаты</p>
                      <div className="grid grid-cols-3 gap-2">
                        {car.insuranceImages.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                            <Image src={img} alt={`Страховая ${i + 1}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-emerald-700 font-semibold text-sm">Без ДТП</p>
                    <p className="text-emerald-600/60 text-xs mt-0.5">По данным корейской базы CarHistory — страховых выплат не зафиксировано</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky info + form */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4 sticky top-24">
              <div className="flex items-start justify-between gap-2">
                <span className={cn('badge-category', CATEGORY_COLORS[car.category])}>
                  {CATEGORY_LABELS[car.category]}
                </span>
                <span className={cn(
                  'text-xs px-2.5 py-1 rounded-full border font-medium',
                  car.status === 'active'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                )}>
                  {STATUS_LABELS[car.status]}
                </span>
              </div>

              <h1 className="text-gray-900 font-black text-xl leading-tight">{car.title}</h1>

              <div className="text-3xl font-black text-brand-red">
                {formatPrice(car.price)}
              </div>

              <p className="text-gray-500 text-sm leading-relaxed">{car.shortDescription}</p>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Calendar, label: `${car.year} год` },
                  { icon: Gauge, label: formatMileage(car.mileage) },
                  { icon: Fuel, label: car.engineType },
                  { icon: Zap, label: `${car.horsepower} л.с.` },
                  { icon: Car, label: car.transmission },
                  { icon: Users, label: `${car.seats} мест` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <Icon size={12} className="text-gray-300 flex-shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wider">Оставить заявку</p>
                <ContactForm defaultCar={car.title} compact />
              </div>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similarCars.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-gray-900 font-bold text-2xl mb-6">Похожие автомобили</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarCars.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
