'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Сколько занимает доставка автомобиля из Кореи?',
    a: 'Доставка занимает до 2 недель в зависимости от города. Дальний Восток и Владивосток — от 7–10 дней, центральная Россия и другие регионы — до 14 дней.',
  },
  {
    q: 'Когда нужно заключать договор?',
    a: 'Договор заключается до того, как мы выезжаем на осмотр выбранного автомобиля. Это защищает обе стороны: вы понимаете, что мы реально работаем, а мы фиксируем условия сделки.',
  },
  {
    q: 'Можно ли заказать видеообзор до принятия решения о покупке?',
    a: 'Да. После того как вы выбрали интересный вариант из подборки, мы заключаем договор и выезжаем на осмотр. Снимаем полный видеообзор — снаружи, внутри, подкапотное пространство, тест-драйв. Только после вашего одобрения происходит покупка.',
  },
  {
    q: 'Какие гарантии по сделке?',
    a: 'Мы работаем по официальному договору. Проверяем историю автомобиля по корейской базе CarHistory перед покупкой. Если автомобиль не соответствует описанию после осмотра — ищем другие варианты.',
  },
  {
    q: 'Как проходит оплата?',
    a: 'Оплата поэтапная: предоплата для заключения договора и выезда на осмотр, оставшаяся сумма — после вашего одобрения видеообзора и перед покупкой автомобиля.',
  },
  {
    q: 'Какие автомобили выгоднее всего привозить?',
    a: 'Наиболее выгодны корейские марки — Hyundai, Kia, Genesis. Особенно в комплектациях, которые в России значительно дороже или недоступны вовсе: Sonata, K5, Grandeur, Genesis G70/G80/GV80.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="section-title mb-3">Частые вопросы</h2>
          <p className="section-subtitle">Ответы на самые распространённые вопросы о покупке авто из Кореи</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                'border rounded-xl overflow-hidden transition-all duration-200',
                open === i ? 'border-brand-red/20 bg-red-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
              >
                <span className={cn(
                  'font-semibold text-sm sm:text-base transition-colors',
                  open === i ? 'text-brand-red' : 'text-gray-800 group-hover:text-gray-900'
                )}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    'flex-shrink-0 transition-transform duration-300',
                    open === i ? 'rotate-180 text-brand-red' : 'text-gray-300'
                  )}
                />
              </button>

              <div className={cn('grid transition-all duration-300', open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
