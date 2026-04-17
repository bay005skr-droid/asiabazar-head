import { TrendingDown, ShieldCheck, Video, FileCheck } from 'lucide-react'

const benefits = [
  {
    icon: TrendingDown,
    title: 'Цена ниже рынка',
    description:
      'Покупаем напрямую на корейских площадках без посредников. Экономия 20–40% по сравнению с российскими дилерами.',
    iconBg: 'bg-red-50',
    iconColor: 'text-brand-red',
  },
  {
    icon: ShieldCheck,
    title: 'Прозрачная история',
    description:
      'Проверяем каждый автомобиль по корейской базе CarHistory. Узнаём реальный пробег, ДТП и страховые случаи.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    icon: Video,
    title: 'Фото и видеообзор',
    description:
      'Снимаем подробный видеообзор на месте в Корее: экстерьер, интерьер, подкапотное пространство, тест.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: FileCheck,
    title: 'Гарантия сделки',
    description:
      'Заключаем официальный договор перед осмотром. Ваши деньги под защитой на каждом этапе сделки.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="section-title mb-3">Почему выбирают АзияБазар</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Работаем с 2019 года. За это время помогли 600+ клиентам привезти автомобиль из Кореи
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-11 h-11 rounded-xl ${b.iconBg} flex items-center justify-center mb-4`}>
                <b.icon size={22} className={b.iconColor} />
              </div>
              <h3 className="text-gray-900 font-bold text-base mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
