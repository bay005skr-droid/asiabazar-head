import { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/forms/ContactForm'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Подобрать автомобиль',
  description: 'Расскажите нам, какой автомобиль вы ищете, и мы подберём лучшие варианты из Кореи.',
}

const steps = [
  { icon: '🎯', label: 'Уточняем пожелания' },
  { icon: '🔍', label: 'Ищем в Корее' },
  { icon: '📹', label: 'Снимаем видео' },
  { icon: '🚗', label: 'Доставляем' },
]

export default function QuizPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mt-8 mb-10 transition-colors">
          <ArrowLeft size={16} />
          На главную
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🇰🇷</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Подберём автомобиль под ваш запрос
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Расскажите нам, что вы ищете — мы найдём 1–3 лучших варианта на корейском рынке и пришлём видеообзор
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-brand-dark-2 border border-brand-red/30 flex items-center justify-center text-lg">
                  {step.icon}
                </div>
                <span className="text-white/30 text-[10px] text-center hidden sm:block max-w-[60px]">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-6 h-px bg-brand-red/20 mb-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
