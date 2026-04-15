import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'

export function ArticlePromoSection() {
  return (
    <section className="py-20 bg-brand-dark-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] order-last lg:order-first">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"
              alt="Какие авто выгодно пригнать"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-2/80 to-transparent lg:bg-gradient-to-l" />

            {/* Category pills */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {['Комфорт', 'Стандарт', 'Бизнес', 'Премиум'].map((cat) => (
                <span key={cat} className="px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white/80 text-xs font-medium border border-white/10">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-brand-red text-sm font-medium">
              <BookOpen size={16} />
              <span>Полезная статья</span>
            </div>

            <div className="divider-red" />

            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Какие авто выгодно пригнать из Кореи
            </h2>

            <p className="text-white/50 text-base leading-relaxed">
              Разбираем 4 категории автомобилей — от бюджетных городских моделей до представительских седанов Genesis.
              Узнайте, какой автомобиль даст максимальную выгоду именно для вашего бюджета.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'Комфорт', desc: 'от 1.5 млн ₽', color: 'text-blue-400' },
                { label: 'Стандарт', desc: 'от 2 млн ₽', color: 'text-emerald-400' },
                { label: 'Бизнес', desc: 'от 3 млн ₽', color: 'text-amber-400' },
                { label: 'Премиум', desc: 'от 5 млн ₽', color: 'text-brand-red' },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className={`font-bold text-sm ${c.color}`}>{c.label}</div>
                  <div className="text-white/30 text-xs">{c.desc}</div>
                </div>
              ))}
            </div>

            <Link href="/articles/kakie-avto-vygodno-prignat" className="btn-primary inline-flex">
              Читать статью
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
