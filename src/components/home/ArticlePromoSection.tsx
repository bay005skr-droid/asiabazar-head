'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingDown, ShieldCheck, Video, Globe } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const reasons = [
  {
    icon: TrendingDown,
    title: 'Экономия 20–40%',
    desc: 'Покупаем напрямую на корейских площадках без посредников',
    color: 'text-brand-red bg-red-50',
  },
  {
    icon: ShieldCheck,
    title: 'Проверенная история',
    desc: 'Проверяем по базе CarHistory: пробег, ДТП, страховые случаи',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Video,
    title: 'Видеообзор из Кореи',
    desc: 'Снимаем полный видеообзор на месте перед покупкой',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Globe,
    title: 'Доставка под ключ',
    desc: 'Организуем доставку в любой город России',
    color: 'text-emerald-600 bg-emerald-50',
  },
]

interface CarItem {
  mainImage: string
  price: number
  title: string
  slug: string
}

interface ArticlePromoProps {
  cars: CarItem[]
}

export function ArticlePromoSection({ cars }: ArticlePromoProps) {
  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const images = cars.map(c => c.mainImage).filter(Boolean)
  const currentCar = cars[idx] ?? null

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
      setLoaded(false)
    }, 7000)
    return () => clearInterval(t)
  }, [images.length])

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Image slideshow */}
          <div className="relative order-last lg:order-first">
            {/* Clickable image container — onClick avoids z-index issues with badges */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-card cursor-pointer"
              style={{ aspectRatio: '16/10' }}
              onClick={() => currentCar && (window.location.href = `/catalog/${currentCar.slug}`)}
            >
              {images.length > 0 ? (
                <>
                  <img
                    key={idx}
                    src={images[idx]}
                    alt="Автомобили из Кореи"
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                  {/* Slide dots — stop propagation so clicking dot doesn't navigate */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setIdx(i); setLoaded(false) }}
                          className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${
                            i === idx ? 'bg-white w-5' : 'bg-white/40 w-1.5 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-300 text-lg font-medium">Нет фотографий</span>
                </div>
              )}
            </div>

            {/* Price badge — z-20 so always above image container */}
            {currentCar && (
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-card z-20">
                <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-red font-black text-xs">цена</span>
                </div>
                <div>
                  <div className="text-gray-900 font-black text-sm">{formatPrice(currentCar.price)}</div>
                  <div className="text-gray-400 text-xs line-clamp-1 max-w-[100px]">{currentCar.title}</div>
                </div>
              </div>
            )}

            {/* Delivery badge — top right */}
            <div className="absolute -top-4 -right-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-card z-20">
              <div className="text-gray-900 font-black text-sm">12 дней</div>
              <div className="text-gray-400 text-xs">средняя доставка</div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="divider-red" />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Почему выбирают<br />
              <span className="text-brand-red">автомобили из Кореи?</span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed">
              Южная Корея — один из крупнейших авторынков мира. Здесь можно найти
              автомобили Hyundai, Kia, Genesis в отличных комплектациях значительно
              дешевле, чем в России.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {reasons.map((r) => (
                <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}>
                    <r.icon size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{r.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/catalog" className="btn-primary inline-flex">
              Смотреть каталог
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
