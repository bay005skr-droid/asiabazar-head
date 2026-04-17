import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'

const SLUG = 'kakie-avtomobili-vygodno-vezti-iz-korei-2026'
const TITLE = 'Какие авто выгодно привезти из Кореи в 2026 году'
const EXCERPT =
  'Разбираем, какие автомобили выгодно привезти из Южной Кореи в 2026 году: ликвидные модели, оптимальная мощность и моторы, что изменилось по утильсбору, как считать итоговую цену «под ключ» и на чём чаще всего переплачивают.'
const COVER = 'https://carskorea.storage.yandexcloud.net/490b6b4a_1771423744.jpg'
const DATE = '18 февраля 2026'

export function FeaturedArticleSection() {
  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="divider-red" style={{ marginBottom: 0 }} />
            <h2 className="text-xl font-black text-gray-900">Полезные статьи</h2>
          </div>
          <Link href={`/articles/${SLUG}`} className="text-sm text-brand-red font-semibold hover:underline underline-offset-2 flex items-center gap-1">
            Читать <ArrowRight size={14} />
          </Link>
        </div>

        <Link href={`/articles/${SLUG}`} className="group no-underline">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col md:flex-row transition-all duration-200 hover:shadow-lg hover:border-gray-200">

            {/* Cover image */}
            <div className="md:w-80 lg:w-96 flex-shrink-0">
              <div className="relative h-56 md:h-full overflow-hidden">
                <img
                  src={COVER}
                  alt={TITLE}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 md:p-8 gap-4">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {DATE}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-brand-red font-semibold text-xs">
                  Статья
                </span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3 group-hover:text-brand-red transition-colors">
                  {TITLE}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {EXCERPT}
                </p>
              </div>

              <div className="flex items-center gap-2 text-brand-red font-semibold text-sm mt-1">
                Читать статью
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>

          </div>
        </Link>

      </div>
    </section>
  )
}
