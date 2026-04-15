'use client'

import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { Review } from '@/types'
import { cn } from '@/lib/utils'

const LIVE_BADGES = [
  'Новый отзыв',
  'Оставили только что',
  'Обновлено сейчас',
  'Только что написали',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={cn(s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20')}
        />
      ))}
    </div>
  )
}

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [liveBadge, setLiveBadge] = useState<string | null>(null)
  const [badgeVisible, setBadgeVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const badgeTimerRef = useRef<NodeJS.Timeout>()

  const active = reviews.filter((r) => r.isActive)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % active.length)
    }, 7000)
    return () => clearInterval(timerRef.current)
  }, [active.length])

  // Pseudo-live badge every ~15s
  useEffect(() => {
    const trigger = () => {
      const badge = LIVE_BADGES[Math.floor(Math.random() * LIVE_BADGES.length)]
      setLiveBadge(badge)
      setBadgeVisible(true)
      badgeTimerRef.current = setTimeout(() => setBadgeVisible(false), 3000)
    }
    const interval = setInterval(trigger, 12000 + Math.random() * 8000)
    return () => {
      clearInterval(interval)
      clearTimeout(badgeTimerRef.current)
    }
  }, [])

  const visibleCount = 3
  const displayed = Array.from({ length: visibleCount }, (_, i) => active[(activeIndex + i) % active.length])

  return (
    <section id="reviews" className="py-20 bg-brand-dark-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="divider-red mb-4" />
            <h2 className="section-title">Отзывы клиентов</h2>
          </div>
          <div className="relative">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-all duration-500',
                badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {liveBadge}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayed.map((review, i) => review && (
            <div
              key={`${review.id}-${activeIndex}-${i}`}
              className={cn(
                'card p-6 transition-all duration-500',
                i === 0 && 'ring-1 ring-brand-red/20'
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-red-800 flex items-center justify-center text-white font-bold text-sm mb-2">
                    {review.author.charAt(0)}
                  </div>
                  <div className="font-semibold text-white text-sm">{review.author}</div>
                  <div className="text-white/40 text-xs">{review.city}</div>
                </div>
                {i === 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    Новый
                  </span>
                )}
              </div>

              <StarRating rating={review.rating} />
              <p className="text-white/60 text-sm leading-relaxed mt-3 line-clamp-4">{review.text}</p>
              <div className="text-white/20 text-xs mt-4">{review.date}</div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex ? 'w-6 h-2 bg-brand-red' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
