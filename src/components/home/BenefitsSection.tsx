import { TrendingDown, ShieldCheck, Video, FileCheck } from 'lucide-react'

const benefits = [
  {
    icon: TrendingDown,
    title: 'Цена ниже рынка',
    description:
      'Покупаем напрямую на корейских площадках без посредников. Экономия 20–40% по сравнению с российскими дилерами.',
    accent: 'from-red-500/20 to-transparent',
  },
  {
    icon: ShieldCheck,
    title: 'Прозрачная история',
    description:
      'Проверяем каждый автомобиль по корейской базе CarHistory. Узнаем реальный пробег, ДТП и страховые случаи.',
    accent: 'from-amber-500/20 to-transparent',
  },
  {
    icon: Video,
    title: 'Обзоры фото и видео',
    description:
      'Снимаем подробный видеообзор автомобиля на месте в Корее: экстерьер, интерьер, подкапотное пространство, тест.',
    accent: 'from-blue-500/20 to-transparent',
  },
  {
    icon: FileCheck,
    title: 'Гарантия сделки',
    description:
      'Заключаем официальный договор перед осмотром. Ваши деньги под защитой на каждом этапе — от выезда до получения авто.',
    accent: 'from-emerald-500/20 to-transparent',
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="section-title mb-4">Почему выбирают АзияБазар</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Работаем с 2019 года. За это время помогли 600+ клиентам привезти автомобиль мечты из Кореи
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="card p-6 group hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.accent} border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <b.icon size={22} className="text-brand-red" />
              </div>

              <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
