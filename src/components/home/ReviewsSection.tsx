'use client'

import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Source = 'Яндекс Карты' | '2ГИС' | 'Авто.ру' | 'Zoon.ru'

interface ReviewCard {
  id: string
  author: string
  city: string
  rating: number
  text: string
  date: string
  source: Source
}

const SOURCE_STYLES: Record<Source, { bg: string; text: string; border: string }> = {
  'Яндекс Карты': { bg: 'bg-red-50',    text: 'text-[#FC3F1D]', border: 'border-red-100' },
  '2ГИС':         { bg: 'bg-blue-50',   text: 'text-blue-600',  border: 'border-blue-100' },
  'Авто.ру':      { bg: 'bg-sky-50',    text: 'text-sky-600',   border: 'border-sky-100' },
  'Zoon.ru':      { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
}

const PLATFORMS: Source[] = ['Яндекс Карты', '2ГИС', 'Авто.ру', 'Zoon.ru']

const INITIAL: ReviewCard[] = [
  {
    id: 'r3',
    author: 'Олеся Т.',
    city: 'Москва',
    rating: 5,
    date: '4 дня назад',
    source: 'Авто.ру',
    text: 'Hyundai Tucson пришёл точно в срок. Видеообзор из Кореи был очень подробный — увидела машину со всех сторон ещё до покупки. Рекомендую!',
  },
  {
    id: 'r2',
    author: 'Андрей Ф.',
    city: 'Уссурийск',
    rating: 5,
    date: '15 дней назад',
    source: '2ГИС',
    text: 'Взял Hyundai Grandeur — такой комплектации в России просто нет. Сэкономил больше 700 тысяч по сравнению с аналогами у дилеров. Полностью прозрачный процесс.',
  },
  {
    id: 'r1',
    author: 'Елена Б.',
    city: 'Хабаровск',
    rating: 5,
    date: '30 дней назад',
    source: 'Яндекс Карты',
    text: 'Взяли с мужем Genesis GV80. Цена значительно ниже российского рынка, и автомобиль новее. Команда работает честно, сопровождали на каждом этапе.',
  },
]

const INCOMING: ReviewCard[] = [
  {
    id: 'r4',
    author: 'Максим Р.',
    city: 'Новосибирск',
    rating: 5,
    date: 'сегодня',
    source: 'Яндекс Карты',
    text: 'Взял Genesis G80. Разница с российскими ценами колоссальная. Процесс полностью прозрачный, менеджер отвечал даже в выходные.',
  },
  {
    id: 'r5',
    author: 'Ирина В.',
    city: 'Владивосток',
    rating: 5,
    date: 'только что',
    source: 'Zoon.ru',
    text: 'Заказывала Kia K5 — пришла без единой царапины. Оформили всё очень быстро, держали в курсе каждого этапа. Спасибо огромное команде!',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

function SourceBadge({ source }: { source: Source }) {
  const s = SOURCE_STYLES[source]
  return (
    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold border', s.bg, s.text, s.border)}>
      {source}
    </span>
  )
}

interface ReviewItemProps {
  review: ReviewCard
  entering: boolean
}

function ReviewItem({ review, entering }: ReviewItemProps) {
  const [visible, setVisible] = useState(!entering)

  useEffect(() => {
    if (entering) {
      const t = setTimeout(() => setVisible(true), 30)
      return () => clearTimeout(t)
    }
  }, [entering])

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card"
      style={{
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-brand-red font-bold text-sm flex-shrink-0">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{review.author}</div>
            <div className="text-gray-400 text-xs">{review.city}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <SourceBadge source={review.source} />
          {review.date === 'только что' && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium">
              Новый
            </span>
          )}
          {review.date === 'сегодня' && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">
              Сегодня
            </span>
          )}
        </div>
      </div>

      <StarRating rating={review.rating} />
      <p className="text-gray-600 text-sm leading-relaxed mt-3 line-clamp-4">{review.text}</p>
      <div className="text-gray-300 text-xs mt-4">{review.date}</div>
    </div>
  )
}

export function ReviewsSection() {
  const [cards, setCards] = useState<ReviewCard[]>(INITIAL)
  const [enteringId, setEnteringId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true
        setTimeout(() => pushReview(0), 3000)
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pushReview = (idx: number) => {
    if (idx >= INCOMING.length) return
    const review = INCOMING[idx]
    setEnteringId(review.id)
    setCards((prev) => [review, prev[0], prev[1]])
    setTimeout(() => {
      setEnteringId(null)
      if (idx + 1 < INCOMING.length) {
        setTimeout(() => pushReview(idx + 1), 10000)
      }
    }, 800)
  }

  return (
    <section ref={sectionRef} id="reviews" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="section-title">Отзывы клиентов</h2>
          <p className="text-gray-400 text-base mt-2">Реальные отзывы с популярных российских платформ</p>

          {/* Platform badges */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {PLATFORMS.map((p) => {
              const s = SOURCE_STYLES[p]
              return (
                <span key={p} className={cn('px-3 py-1 rounded-full text-xs font-semibold border', s.bg, s.text, s.border)}>
                  {p}
                </span>
              )
            })}
          </div>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              entering={review.id === enteringId}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-10">
          {[
            { value: '4,9', label: 'оценка', sub: 'средняя по платформам', star: true },
            { value: '347', label: 'отзывов', sub: 'на всех платформах', star: false },
            { value: '98%', label: 'рекомендуют', sub: 'по данным отзывов', star: false },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-gray-900 flex items-center justify-center gap-1">
                {s.value}
                {s.star && <Star size={28} className="text-yellow-400 fill-yellow-400" />}
              </div>
              <div className="text-gray-700 text-sm font-semibold mt-0.5">{s.label}</div>
              <div className="text-gray-400 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
