'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Send, Car, Bus, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/components/analytics/AnalyticsTracker'

// ─── Step data ───────────────────────────────────────────────────────────────

function PickupIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 14h1l2-6h7l3 4h4a1 1 0 0 1 1 1v3H2v-2z" />
      <path d="M5 14v2" />
      <path d="M15 12l1.5 2" />
      <circle cx="6.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </svg>
  )
}

const BODY_TYPES = [
  { value: 'Седан',     Icon: Car },
  { value: 'Кроссовер', Icon: Car },
  { value: 'Хэтчбек',  Icon: Car },
  { value: 'Минивэн',  Icon: Bus },
  { value: 'Пикап',    Icon: PickupIcon },
  { value: 'Любой',    Icon: LayoutGrid },
]

const BRANDS = [
  'Hyundai', 'Kia', 'Genesis',
  'Toyota', 'Lexus', 'BMW',
  'Mercedes', 'Audi', 'Другой',
]

const BUDGETS = [
  { label: 'до 2 000 000 ₽',              value: 'до 2 млн' },
  { label: '2 000 000 — 3 500 000 ₽',     value: '2–3.5 млн' },
  { label: '3 500 000 — 6 000 000 ₽',     value: '3.5–6 млн' },
  { label: 'от 6 000 000 ₽',              value: 'от 6 млн' },
]

const MESSENGERS = [
  {
    value: 'telegram',
    label: 'Telegram',
    bg: 'bg-[#29A8EB]',
    icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    bg: 'bg-[#25D366]',
    icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>,
  },
  {
    value: 'max',
    label: 'MAX',
    bg: 'overflow-hidden',
    icon: <img src="https://rv-ryazan.ru/wp-content/uploads/2025/12/bc2syA5jnc3Jv3Io5b2mbdWJxyv8-OofOLt2xErdzY2kfyH3vmGauFED8DrlIdh-AUSIpzgdQYfOch-_vb_1RUDf.jpg" alt="MAX" className="w-full h-full object-cover block" />,
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Answers {
  bodyType: string
  brand: string
  budget: string
  name: string
  phone: string
  messenger: string
}

const TOTAL_STEPS = 4

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionCard({
  label,
  Icon,
  selected,
  onClick,
}: {
  label: string
  Icon?: React.ElementType
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 text-center cursor-pointer select-none transition-all duration-200 hover:shadow-sm active:scale-95 min-h-[72px]',
        selected
          ? 'border-brand-red bg-red-50 shadow-red'
          : 'border-gray-100 bg-white hover:border-gray-300'
      )}
    >
      {Icon && (
        <Icon
          size={20}
          className={cn('transition-colors', selected ? 'text-brand-red' : 'text-gray-400')}
        />
      )}
      <span className={cn('text-sm font-semibold leading-tight', selected ? 'text-brand-red' : 'text-gray-700')}>
        {label}
      </span>
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-red flex items-center justify-center">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function QuizFlow() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Answers>({
    bodyType: '',
    brand: '',
    budget: '',
    name: '',
    phone: '',
    messenger: 'telegram',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({})

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  const canNext = () => {
    if (step === 1) return !!answers.bodyType
    if (step === 2) return !!answers.brand
    if (step === 3) return !!answers.budget
    return true
  }

  const validate4 = () => {
    const e: typeof errors = {}
    if (!answers.name.trim() || answers.name.trim().length < 2) e.name = 'Введите имя'
    if (!answers.phone.trim() || answers.phone.trim().length < 10) e.phone = 'Введите корректный номер'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  const back = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const submit = async () => {
    if (!validate4()) return
    setSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: answers.name,
          phone: answers.phone,
          desiredCar: `${answers.brand} ${answers.bodyType}`.trim(),
          budget: answers.budget,
          preferredMessenger: answers.messenger,
          comment: `Тип кузова: ${answers.bodyType}, Марка: ${answers.brand}, Бюджет: ${answers.budget}`,
        }),
      })
      trackEvent('quiz_complete', { messenger: answers.messenger, bodyType: answers.bodyType, brand: answers.brand })
      setDone(true)
    } catch {
      alert('Ошибка. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-8 gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ваш подбор готов!</h2>
          <p className="text-gray-500 text-base max-w-sm mx-auto">
            Мы получили вашу заявку и уже начинаем подбор. Свяжемся в течение 15 минут.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3 text-left">
          {[
            { n: '01', title: 'Связываемся с вами', desc: 'Уточняем детали и пожелания' },
            { n: '02', title: 'Ищем в Корее', desc: 'Подбираем 1–3 лучших варианта' },
            { n: '03', title: 'Снимаем видеообзор', desc: 'Показываем автомобиль вживую' },
            { n: '04', title: 'Доставляем', desc: 'Привозим в ваш город под ключ' },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                {s.n}
              </div>
              <div>
                <div className="text-gray-900 font-semibold text-sm">{s.title}</div>
                <div className="text-gray-400 text-xs">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/" className="btn-primary px-8 py-3">
          На главную
        </Link>
      </div>
    )
  }

  // ── Progress bar ─────────────────────────────────────────────────────────────
  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="flex flex-col min-h-full">

      {/* Progress */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
        <div
          className="h-1 bg-brand-red rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="text-gray-400 text-xs font-medium mb-6">
        Шаг {step} из {TOTAL_STEPS}
      </div>

      {/* ── Step 1: Тип кузова ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 mb-2">Какой тип кузова вас интересует?</h2>
          <p className="text-gray-400 text-sm mb-6">Выберите один вариант</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {BODY_TYPES.map((bt) => (
              <OptionCard
                key={bt.value}
                label={bt.value}
                Icon={bt.Icon}
                selected={answers.bodyType === bt.value}
                onClick={() => set('bodyType', bt.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Марка ───────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 mb-2">Предпочитаемая марка?</h2>
          <p className="text-gray-400 text-sm mb-6">Выберите один вариант</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {BRANDS.map((brand) => (
              <OptionCard
                key={brand}
                label={brand}
                selected={answers.brand === brand}
                onClick={() => set('brand', brand)}
              />
            ))}

          </div>
        </div>
      )}

      {/* ── Step 3: Бюджет ──────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 mb-2">Какой у вас бюджет?</h2>
          <p className="text-gray-400 text-sm mb-6">Выберите диапазон</p>
          <div className="flex flex-col gap-3 mb-8">
            {BUDGETS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => set('budget', b.value)}
                className={cn(
                  'w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-sm active:scale-[0.99]',
                  answers.budget === b.value
                    ? 'border-brand-red bg-red-50 shadow-red'
                    : 'border-gray-100 bg-white hover:border-gray-300'
                )}
              >
                <span className={cn('font-semibold text-base', answers.budget === b.value ? 'text-brand-red' : 'text-gray-800')}>
                  {b.label}
                </span>
                {answers.budget === b.value && (
                  <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Контакты ────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 mb-2">Куда прислать подборку?</h2>
          <p className="text-gray-400 text-sm mb-6">Введите ваши данные</p>
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <label className="label-base">Ваше имя *</label>
              <input
                value={answers.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Как к вам обращаться?"
                className={cn('input-base', errors.name && 'border-red-400')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label-base">Номер телефона *</label>
              <input
                value={answers.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+7 (___) ___-__-__"
                type="tel"
                className={cn('input-base', errors.phone && 'border-red-400')}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="label-base">Удобный мессенджер</label>
              <div className="flex gap-2">
                {MESSENGERS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => set('messenger', m.value)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
                      answers.messenger === m.value
                        ? 'border-brand-red bg-red-50 text-brand-red'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                    )}
                  >
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', m.bg)}>
                      {m.icon}
                    </div>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mt-auto pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 font-semibold text-sm transition-all"
          >
            <ArrowLeft size={16} />
            Назад
          </button>
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={next}
            disabled={!canNext()}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all duration-200',
              canNext()
                ? 'bg-brand-red hover:bg-brand-red-dark text-white shadow-red active:scale-95'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            )}
          >
            Далее
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base bg-brand-red hover:bg-brand-red-dark text-white shadow-red active:scale-95 transition-all duration-200 disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Отправляем...</>
            ) : (
              <><Send size={18} /> Получить подборку</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
