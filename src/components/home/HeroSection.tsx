'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Car } from '@/types'
import { formatPrice } from '@/lib/utils'

const MARQUEE_TEXT = [
  'Подбор лучших вариантов рынка',
  'Видеообзор перед покупкой',
  'Прозрачная проверка истории',
  'Доставка в любую точку РФ',
  'Официальный договор на каждом этапе',
  'Работаем с 2019 года',
]

const ACTIVITY_NOTICES = [
  'Андрей смотрит Kia Sportage сейчас',
  'Максим интересуется подбором Tucson',
  'Дмитрий оставил заявку на Genesis GV80',
  'Иван изучает Hyundai Palisade',
  'Сергей запросил видеообзор Kia Carnival',
  'Алексей интересуется BMW X5 из Кореи',
  'Николай смотрит Hyundai Santa Fe',
  'Артём оставил заявку на Kia Sorento',
]

function ActivityToast() {
  const [visible, setVisible] = useState(false)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const show = (i: number) => {
      setIdx(i)
      setVisible(true)
      setTimeout(() => setVisible(false), 4000)
    }

    const startTimer = setTimeout(() => {
      show(0)
      let current = 1
      const interval = setInterval(() => {
        show(current % ACTIVITY_NOTICES.length)
        current++
      }, 8000)
      return () => clearInterval(interval)
    }, 3000)

    return () => clearTimeout(startTimer)
  }, [])

  return (
    <div
      className="flex items-center gap-3 mt-6 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: 'none',
        minHeight: '44px',
      }}
    >
      <div className="flex items-center gap-2.5 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5">
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-white/80 text-sm font-medium">{ACTIVITY_NOTICES[idx]}</span>
      </div>
    </div>
  )
}

interface HeroSectionProps {
  cars: Car[]
}

export function HeroSection({ cars }: HeroSectionProps) {
  const [carIdx, setCarIdx] = useState(0)
  const [imgVisible, setImgVisible] = useState(true)
  const [deliveryDays, setDeliveryDays] = useState(12)
  // Duplicate for seamless marquee
  const marqueeItems = [...MARQUEE_TEXT, ...MARQUEE_TEXT]

  const activeCars = cars.filter((c) => c.mainImage)
  const currentCar = activeCars[carIdx] ?? null

  useEffect(() => {
    // Random 10–15 on mount, then refresh every 30s
    const randomDays = () => Math.floor(Math.random() * 6) + 10
    setDeliveryDays(randomDays())
    const t = setInterval(() => setDeliveryDays(randomDays()), 30000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (activeCars.length <= 1) return
    const t = setInterval(() => {
      setImgVisible(false)
      setTimeout(() => {
        setCarIdx((i) => (i + 1) % activeCars.length)
        setImgVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCars.length])

  return (
    <section className="relative pt-16 bg-brand-dark overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-brand-red/10 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-white/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 md:py-20">

          {/* Left — text */}
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Автомобили<br />
              <span className="text-brand-red">из Кореи</span>
            </h1>

            <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
              Подбор, проверка, видеообзор и доставка автомобилей
              из Южной Кореи с сопровождением на каждом этапе
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/quiz" className="btn-primary text-base px-8 py-4">
                Подобрать авто
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg
                  bg-white/10 border-2 border-white/15 hover:border-brand-red text-white hover:text-white
                  font-semibold text-base transition-all duration-200"
              >
                Смотреть каталог
              </Link>
            </div>

            <ActivityToast />
          </div>

          {/* Right — car carousel */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow — pointer-events-none so it never intercepts clicks */}
              <div className="absolute inset-0 bg-brand-red/10 rounded-3xl blur-2xl scale-110 pointer-events-none" />

              {/* Image container — clickable via window.location to avoid z-index fights */}
              <div
                className="relative rounded-2xl overflow-hidden bg-brand-dark-3 border border-white/5 cursor-pointer"
                style={{ aspectRatio: '16/10' }}
                onClick={() => currentCar && (window.location.href = `/catalog/${currentCar.slug}`)}
              >
                {currentCar ? (
                  <img
                    key={carIdx}
                    src={currentCar.mainImage}
                    alt={currentCar.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
                    style={{ opacity: imgVisible ? 1 : 0 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span style={{ fontSize: 48 }}>🚗</span>
                    <p className="text-white/30 text-sm">Автомобили появятся после добавления</p>
                  </div>
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Slide dots */}
                {activeCars.length > 1 && (
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                    {activeCars.map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: i === carIdx ? 16 : 6,
                          background: i === carIdx ? '#fff' : 'rgba(255,255,255,0.35)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Price badge — outside image container, always on top */}
              <div className="absolute -bottom-4 -left-4 bg-brand-dark-2 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg z-20">
                <div className="w-10 h-10 bg-brand-red/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-red font-black text-xs leading-tight text-center">цена</span>
                </div>
                <div>
                  <div className="text-white font-black text-sm">
                    {currentCar ? formatPrice(currentCar.price) : '—'}
                  </div>
                  <div className="text-white/35 text-xs line-clamp-1 max-w-[100px]">
                    {currentCar?.title ?? 'автомобиль'}
                  </div>
                </div>
              </div>

              {/* Delivery badge — outside image container, always on top */}
              <div className="absolute -top-4 -right-4 bg-brand-dark-2 border border-white/10 rounded-2xl px-4 py-3 shadow-lg z-20">
                <div className="text-white font-black text-sm">{deliveryDays} дней</div>
                <div className="text-white/35 text-xs">доставка</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Red marquee strip — dot centered between items with equal px-2.5 on each side */}
      <div className="relative bg-brand-red overflow-hidden py-3 select-none">
        <div className="flex whitespace-nowrap marquee-track">
          {marqueeItems.map((text, i) => (
            <span key={i} className="inline-flex items-center px-2.5 text-white text-sm font-semibold gap-5">
              {text}
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
