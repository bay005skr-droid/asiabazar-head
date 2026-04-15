const steps = [
  {
    num: '01',
    title: 'Заявка',
    desc: 'Вы оставляете заявку и рассказываете, какой автомобиль вас интересует.',
  },
  {
    num: '02',
    title: 'Уточнение',
    desc: 'Мы связываемся с вами и уточняем параметры: марка, бюджет, комплектация, пробег.',
  },
  {
    num: '03',
    title: 'Подбор',
    desc: 'Заходим на корейские площадки и подбираем 1–3 лучших варианта под ваш запрос.',
  },
  {
    num: '04',
    title: 'Договор',
    desc: 'Если вам интересен один из вариантов — заключаем договор для выезда на осмотр и видеообзор.',
  },
  {
    num: '05',
    title: 'Обзор',
    desc: 'Выезжаем к продавцу, снимаем полный видеообзор авто: снаружи, внутри, подкапотное пространство.',
  },
  {
    num: '06',
    title: 'Покупка',
    desc: 'После вашего одобрения принимаем оплату, покупаем авто и организуем доставку.',
  },
  {
    num: '07',
    title: 'Доставка',
    desc: 'Привозим автомобиль в ваш город. Вы получаете авто в состоянии один в один как на видео.',
  },
]

export function HowWeWorkSection() {
  return (
    <section id="how-we-work" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="section-title mb-4">Как мы работаем</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Прозрачный процесс от заявки до получения ключей. Никаких сюрпризов.
          </p>
        </div>

        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="w-16 h-16 rounded-full bg-brand-dark-2 border-2 border-brand-red/40 group-hover:border-brand-red flex items-center justify-center mb-4 transition-all duration-300 relative z-10 group-hover:shadow-red">
                  <span className="text-brand-red font-black text-sm">{step.num}</span>
                </div>

                {/* Arrow mobile */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden absolute top-8 left-1/2 ml-8 text-brand-red/30 text-xl font-thin select-none">›</div>
                )}

                <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Messengers row */}
        <div className="mt-12 p-6 rounded-2xl bg-brand-dark-2 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center sm:text-left">
            Работаем в удобных для вас мессенджерах:
          </p>
          <div className="flex gap-3">
            {[
              { label: 'Telegram', href: 'https://t.me/asiabazar25', color: 'bg-[#29A8EB]/20 border-[#29A8EB]/30 text-[#29A8EB]' },
              { label: 'WhatsApp', href: 'https://wa.me/79149999999', color: 'bg-[#25D366]/20 border-[#25D366]/30 text-[#25D366]' },
              { label: 'MAX', href: 'https://max.ru/asiabazar25', color: 'bg-[#FF4F00]/20 border-[#FF4F00]/30 text-[#FF4F00]' },
            ].map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:opacity-80 ${m.color}`}
              >
                {m.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
