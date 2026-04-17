import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QuizFlow } from '@/components/quiz/QuizFlow'

export const metadata: Metadata = {
  title: 'Подобрать автомобиль — АзияБазар',
  description: 'Расскажите нам, какой автомобиль вы ищете, и мы подберём лучшие варианты из Кореи.',
}

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          На главную
        </Link>

        {/* Logo + heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shadow-red flex-shrink-0">
            <span className="text-white font-black text-sm">АБ</span>
          </div>
          <div>
            <div className="text-gray-900 font-black text-lg leading-none">АзияБазар</div>
            <div className="text-gray-400 text-xs mt-0.5">Подбор авто из Кореи</div>
          </div>
        </div>

        {/* Quiz */}
        <QuizFlow />

      </div>
    </div>
  )
}
