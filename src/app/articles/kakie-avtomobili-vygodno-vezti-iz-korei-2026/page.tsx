import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { ContactSection } from '@/components/home/ContactSection'

export const metadata: Metadata = {
  title: 'Какие авто выгодно привезти из Кореи в 2026 году',
  description:
    'Разбираем, какие автомобили выгодно привезти из Южной Кореи в 2026 году: ликвидные модели, оптимальная мощность и моторы, что изменилось по утильсбору, как считать итоговую цену «под ключ».',
  openGraph: {
    images: ['https://carskorea.storage.yandexcloud.net/490b6b4a_1771423744.jpg'],
  },
}

const sections = [
  {
    heading: 'Что поменялось в 2026 по сравнению с 2025',
    body: `Импорт автомобилей из Южной Кореи в 2026 году остаётся одним из самых рациональных сценариев, но понятие «выгодно» заметно изменилось: итоговая цена в РФ становится ключевым фактором, где решающую роль играют утильсбор, мощность и ликвидность.

В 2026 году «выгодно» почти всегда означает сочетание трёх факторов: ликвидность в РФ, доступность модели в Корее и контроль утильсбора.`,
  },
  {
    heading: 'Ключевые изменения',
    body: `Порог 160 л.с. стал «границей экономики». После изменений конца 2025 года утильсбор считается по шкале мощности двигателя: до 160 л.с. сохраняется более спокойная логика расчёта, выше 160 л.с. включаются повышающие коэффициенты.

С 1 января 2026 коэффициенты проиндексировали. Автомобили, которые «сходились» по бюджету в 2025, стали дороже на этапе расчёта, особенно у машин, близких к порогу мощности.

Считать нужно по кВт, а не по «л.с. в объявлении». Граница в расчётах составляет 117,68 кВт. В объявлениях встречаются ошибки, поэтому важно проверять цифры по техданным, а не полагаться на слова продавца.`,
  },
]

const strategies = [
  {
    title: '1. Безопасная стратегия: умеренная мощность и быстрая продажа',
    color: 'border-blue-200 bg-blue-50',
    headingColor: 'text-blue-800',
    groups: [
      {
        label: 'Седаны (самые стабильные по перепродаже)',
        cars: [
          { name: 'Hyundai Avante', desc: 'один из самых понятных седанов для РФ с массовым спросом и быстрой продажей' },
          { name: 'Kia K3', desc: 'рациональный C-класс, обычно дешевле в покупке при стабильной ликвидности' },
          { name: 'Hyundai Sonata 2.0', desc: 'комфортный D-класс, удерживает экономику ввоза' },
          { name: 'Kia K5 2.0', desc: 'один из самых востребованных седанов сегмента с хорошей ликвидностью' },
        ],
      },
      {
        label: 'Кроссоверы (самый востребованный сегмент)',
        cars: [
          { name: 'Kia Seltos', desc: 'компактный кроссовер с хорошим балансом цены и скорости продажи' },
          { name: 'Hyundai Kona', desc: 'городской кроссовер, экономичный и понятный по эксплуатации' },
          { name: 'Hyundai Tucson', desc: 'универсальный и понятный рынку кроссовер' },
          { name: 'Kia Sportage', desc: 'стабильно востребованный семейный кроссовер' },
          { name: 'BMW X1', desc: 'практичный формат с покупкой за бренд' },
          { name: 'BMW X2', desc: 'более дизайнерский вариант, хорошо продаётся в нейтральных цветах' },
          { name: 'Audi Q3', desc: 'компактный премиум-кроссовер, любят за салон и эргономику' },
        ],
      },
    ],
    advantages: [
      'чаще попадают в «спокойную» зону по утилю',
      'легко продаются без долгого ожидания',
      'имеют предсказуемую стоимость владения',
    ],
  },
  {
    title: '2. Премиальная стратегия: утиль выше, но выгода есть при правильной конфигурации',
    color: 'border-violet-200 bg-violet-50',
    headingColor: 'text-violet-800',
    groups: [
      {
        label: 'Модели для премиум-стратегии',
        cars: [
          { name: 'BMW 5 Series', desc: 'один из самых ликвидных бизнес-седанов в премиуме' },
          { name: 'Mercedes-Benz GLE', desc: 'востребованный премиум-кроссовер с устойчивым спросом' },
          { name: 'BMW X3', desc: 'золотая середина премиум-кроссоверов: практичный и стабильный' },
          { name: 'Audi Q5', desc: 'один из самых продаваемых кроссоверов бизнес-класса' },
        ],
      },
    ],
    advantages: [
      'только ликвидная конфигурация: чёрный / белый / серый кузов, тёмный салон',
      'только понятные опции: камера, парктроники, адаптивный круиз',
      'сначала расчёт «под ключ»: утильсбор, логистика, таможня, оформление',
      'проверка по факту: подтверждение комплектации по VIN',
    ],
  },
]

const summary = [
  { label: 'Массовые седаны', models: 'Hyundai Avante, Kia K3, Hyundai Sonata 2.0, Kia K5 2.0' },
  { label: 'Кроссоверы', models: 'Kia Seltos, Hyundai Kona, Hyundai Tucson, Kia Sportage, BMW X1, BMW X2, Audi Q3' },
  { label: 'Премиум', models: 'BMW 5 Series, Mercedes GLE, BMW X3, Audi Q5 (только по премиальной стратегии)' },
]

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 text-sm py-6">
          <Link href="/" className="hover:text-brand-red transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-gray-600">Статья</span>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          На главную
        </Link>

        {/* Cover */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8 shadow-card">
          <img
            src="https://cdn.kia.ru/media-bank/kia-stokoney/seo-content/kak-vibrat-podhodyashhiy-avtomobil-kia.jpg"
            alt="Автомобили из Кореи"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            18 февраля 2026
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-brand-red text-xs font-medium">
            Полезное
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
          Какие авто выгодно привезти из Кореи в 2026 году
        </h1>

        {/* Excerpt */}
        <p className="text-gray-500 text-lg leading-relaxed mb-10 border-l-4 border-brand-red pl-5">
          Разбираем, какие автомобили выгодно привезти из Южной Кореи в 2026 году: ликвидные модели,
          оптимальная мощность и моторы, что изменилось по утильсбору, как считать итоговую цену
          «под ключ» и на чём чаще всего переплачивают.
        </p>

        {/* Intro sections */}
        <div className="space-y-8 mb-12">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-2xl font-black text-gray-900 mb-3">{s.heading}</h2>
              {s.body.split('\n\n').map((p, i) => (
                <p key={i} className="text-gray-600 text-base leading-relaxed mb-3">{p}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Strategies */}
        <h2 className="text-2xl font-black text-gray-900 mb-6">Две стратегии «выгодно» в 2026</h2>
        <div className="space-y-6 mb-12">
          {strategies.map((strategy) => (
            <div key={strategy.title} className={`rounded-2xl border p-6 md:p-8 ${strategy.color}`}>
              <h3 className={`text-xl font-black mb-5 ${strategy.headingColor}`}>{strategy.title}</h3>

              {strategy.groups.map((group) => (
                <div key={group.label} className="mb-5">
                  <h4 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">{group.label}</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {group.cars.map((car) => (
                      <div key={car.name} className="bg-white/70 rounded-xl px-4 py-3">
                        <div className="font-bold text-gray-900 text-sm">{car.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{car.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <h4 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">
                  {strategy.title.startsWith('1') ? 'Почему это выгодно в 2026' : 'Практичное правило для премиум в 2026'}
                </h4>
                <ul className="space-y-2">
                  {strategy.advantages.map((adv) => (
                    <li key={adv} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-red mt-0.5 flex-shrink-0 font-bold">✓</span>
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Years section */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 mb-12">
          <h2 className="text-xl font-black text-amber-800 mb-3">Почему 2023–2025 годы выпуска особенно интересны</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Автомобили этих лет обычно дают:</p>
          <ul className="space-y-2">
            {[
              'свежее состояние',
              'более предсказуемую эксплуатацию',
              'выше привлекательность на вторичке',
              'при умеренной мощности — лучший баланс по стоимости владения',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-600 mt-0.5 flex-shrink-0 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-5">Итог: какие автомобили выгодно привезти в 2026</h2>
          <div className="space-y-3">
            {summary.map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                <span className="text-gray-500 text-sm font-semibold sm:w-36 flex-shrink-0">{row.label}:</span>
                <span className="text-gray-800 text-sm">{row.models}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mt-5 pt-4 border-t border-red-200">
            <strong>Главная рекомендация:</strong> выбирать автомобиль разумно с заранее проведённым расчётом,
            а не на эмоциях. Заранее считать финальную цену «под ключ», брать ликвидную конфигурацию и выбирать
            не редкость, а продаваемый вариант.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/catalog" className="btn-primary">
            Смотреть каталог
            <ArrowRight size={18} />
          </Link>
          <Link href="/quiz" className="btn-secondary">
            Подобрать авто
          </Link>
        </div>

      </div>

      <ContactSection />
    </div>
  )
}
