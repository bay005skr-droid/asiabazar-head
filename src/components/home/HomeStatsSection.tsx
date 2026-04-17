'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { display: '600+', target: 600, suffix: '+', label: 'автомобилей доставлено' },
  { display: '5',    target: 5,   suffix: ' лет', label: 'на рынке' },
  { display: '98%',  target: 98,  suffix: '%',  label: 'довольных клиентов' },
  { display: '24/7', target: null, suffix: '',  label: 'на связи' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / 1800, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(ease * target))
      if (p < 1) requestAnimationFrame(step)
      else setVal(target)
    }
    requestAnimationFrame(step)
  }, [started, target])

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  )
}

export function HomeStatsSection() {
  return (
    <section className="py-16 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                {s.target !== null ? (
                  <Counter target={s.target} suffix={s.suffix} />
                ) : (
                  <span>{s.display}</span>
                )}
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
