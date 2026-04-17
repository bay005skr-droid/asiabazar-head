'use client'

import { useEffect, useRef, useState } from 'react'
import { formatNumber } from '@/lib/utils'

interface StatItem {
  value: number
  label: string
  suffix?: string
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return <span ref={ref}>{formatNumber(count)}</span>
}

interface StatsSectionProps {
  stats: { selectedCars: number; deliveredCars: number; completedDeals: number; happyClients: number }
}

export function StatsSection({ stats }: StatsSectionProps) {
  const items: StatItem[] = [
    { value: stats.selectedCars, label: 'Автомобилей подобрано', suffix: '+' },
    { value: stats.deliveredCars, label: 'Автомобилей доставлено', suffix: '+' },
    { value: stats.completedDeals, label: 'Успешных сделок', suffix: '+' },
    { value: stats.happyClients, label: 'Довольных клиентов', suffix: '+' },
  ]

  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                <AnimatedCounter target={item.value} />
                {item.suffix && <span className="text-brand-red">{item.suffix}</span>}
              </div>
              <div className="text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
