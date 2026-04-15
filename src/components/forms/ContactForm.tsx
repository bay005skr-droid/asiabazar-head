'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Введите имя').max(80),
  phone: z.string().min(10, 'Введите корректный номер'),
  desiredCar: z.string().optional(),
  budget: z.string().optional(),
  deliveryCity: z.string().optional(),
  comment: z.string().optional(),
  preferredMessenger: z.enum(['telegram', 'max', 'whatsapp']),
})

type FormData = z.infer<typeof schema>

const messengerOptions = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'max', label: 'MAX' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const

interface ContactFormProps {
  defaultCar?: string
  compact?: boolean
}

export function ContactForm({ defaultCar, compact }: ContactFormProps) {
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      desiredCar: defaultCar || '',
      preferredMessenger: 'telegram',
    },
  })

  const messenger = watch('preferredMessenger')

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 6000)
    } catch {
      alert('Произошла ошибка. Попробуйте написать нам напрямую.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Заявка отправлена!</h3>
        <p className="text-white/50 max-w-xs">
          Мы свяжемся с вами в ближайшее время и подберём лучшие варианты.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Row 1 */}
      <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
        <div>
          <label className="label-base">Имя *</label>
          <input
            {...register('name')}
            placeholder="Ваше имя"
            className={cn('input-base', errors.name && 'border-red-500 focus:border-red-500')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label-base">Телефон *</label>
          <input
            {...register('phone')}
            placeholder="+7 (___) ___-__-__"
            type="tel"
            className={cn('input-base', errors.phone && 'border-red-500 focus:border-red-500')}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Row 2 */}
      {!compact && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-base">Какой автомобиль интересует</label>
            <input
              {...register('desiredCar')}
              placeholder="Hyundai Tucson, Kia K5..."
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Бюджет</label>
            <input
              {...register('budget')}
              placeholder="от 2 000 000 ₽"
              className="input-base"
            />
          </div>
        </div>
      )}

      {!compact && (
        <div>
          <label className="label-base">Город доставки</label>
          <input
            {...register('deliveryCity')}
            placeholder="Москва, Хабаровск, Новосибирск..."
            className="input-base"
          />
        </div>
      )}

      {!compact && (
        <div>
          <label className="label-base">Комментарий</label>
          <textarea
            {...register('comment')}
            placeholder="Любые пожелания: цвет, комплектация, срок..."
            rows={3}
            className="input-base resize-none"
          />
        </div>
      )}

      {/* Messenger choice */}
      <div>
        <label className="label-base">Удобный способ связи</label>
        <div className="flex gap-2">
          {messengerOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue('preferredMessenger', opt.value)}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200',
                messenger === opt.value
                  ? 'bg-brand-red border-brand-red text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-4 text-base">
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Отправляем...
          </>
        ) : (
          <>
            <Send size={18} />
            Получить подборку
          </>
        )}
      </button>

      <p className="text-white/25 text-xs text-center">
        Мы уточним запрос, подберём 1–3 варианта и свяжемся с вами удобным способом
      </p>
    </form>
  )
}
