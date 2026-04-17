'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye } from 'lucide-react'

const SLUG = 'kakie-avtomobili-vygodno-vezti-iz-korei-2026'
const TITLE = 'Какие авто выгодно привезти из Кореи в 2026 году'
const EXCERPT =
  'Разбираем, какие автомобили выгодно привезти из Южной Кореи в 2026 году: ликвидные модели, оптимальная мощность и моторы, что изменилось по утильсбору, как считать итоговую цену «под ключ» и на чём чаще всего переплачивают.'

function ViewCounter() {
  const [views, setViews] = useState(9782)

  useEffect(() => {
    const interval = setInterval(() => {
      setViews((v) => v + Math.floor(Math.random() * 91) + 10)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-card flex-shrink-0 min-w-[130px] text-center">
      <Eye size={18} className="text-brand-red" />
      <span className="text-2xl font-black text-gray-900 tabular-nums">
        {views.toLocaleString('ru-RU')}
      </span>
      <span className="text-xs text-gray-400 leading-tight">просмотров</span>
    </div>
  )
}

export function FeaturedArticleSection() {
  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="divider-red" style={{ marginBottom: 0 }} />
          <h2 className="text-xl font-black text-gray-900">Полезные статьи</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4">

          {/* Article info */}
          <Link href={`/articles/${SLUG}`} className="group no-underline flex-1">
            <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-card px-6 py-5
              flex flex-col justify-between gap-4
              transition-all duration-200 hover:shadow-lg hover:border-gray-200">

              <div>
                <h3 className="text-lg font-black text-gray-900 leading-snug mb-2
                  group-hover:text-brand-red transition-colors">
                  {TITLE}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {EXCERPT}
                </p>
              </div>

              <div className="flex items-center gap-2 text-brand-red font-semibold text-sm">
                Читать статью
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>

            </div>
          </Link>

          {/* View counter */}
          <ViewCounter />

        </div>
      </div>
    </section>
  )
}
