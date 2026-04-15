import { ContactForm } from '@/components/forms/ContactForm'

interface ContactSectionProps {
  defaultCar?: string
  title?: string
}

export function ContactSection({ defaultCar, title }: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-red/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="divider-red mb-4" />
            <h2 className="section-title mb-4">
              {title || 'Подберём автомобиль под ваш запрос'}
            </h2>
            <p className="section-subtitle mb-8">
              Оставьте заявку — мы изучим рынок, найдём 1–3 лучших варианта по вашему бюджету и пришлём видеообзор из Кореи.
            </p>

            {/* Trust signals */}
            <div className="space-y-3">
              {[
                '✓ Бесплатный подбор и консультация',
                '✓ Видеообзор авто перед покупкой',
                '✓ Договор на каждом этапе сделки',
                '✓ Доставка под ключ до вашего города',
              ].map((item) => (
                <div key={item} className="text-white/60 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card p-6 md:p-8">
            <ContactForm defaultCar={defaultCar} />
          </div>
        </div>
      </div>
    </section>
  )
}
