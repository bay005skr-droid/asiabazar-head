import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'

const advantages = [
  'Подбор 1–3 лучших вариантов',
  'Фото и видеообзор перед покупкой',
  'Прозрачная проверка истории',
  'Сопровождение до получения авто',
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80)',
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        {/* Red accent glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-sm font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            Автомобили из Южной Кореи
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6 animate-slide-up">
            Автомобили из{' '}
            <span className="text-brand-red">Южной Кореи</span>
            <br />
            под заказ
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Подбор, проверка, видеообзор, оформление договора, покупка и доставка автомобилей из Кореи с&nbsp;сопровождением от компании АзияБазар
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/catalog" className="btn-primary text-base px-8 py-4">
              Посмотреть каталог
              <ArrowRight size={18} />
            </Link>
            <Link href="/quiz" className="btn-secondary text-base px-8 py-4">
              Подобрать авто
            </Link>
          </div>

          {/* Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {advantages.map((adv) => (
              <div key={adv} className="flex items-center gap-2.5 text-white/80 text-sm">
                <CheckCircle2 size={16} className="text-brand-red flex-shrink-0" />
                <span>{adv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex flex-wrap gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {[
            { value: '600+', label: 'авто доставлено' },
            { value: '5', label: 'лет на рынке' },
            { value: '98%', label: 'довольных клиентов' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-black text-brand-red">{stat.value}</span>
              <span className="text-xs text-white/40 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-white/30 text-xs animate-bounce">
        <ChevronDown size={20} />
      </div>
    </section>
  )
}
