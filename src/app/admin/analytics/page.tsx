'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Users, MessageSquare, Send, Car, TrendingUp, Eye, Globe, Monitor, Cpu, Smartphone, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

type Period = 'today' | '7d' | '30d' | '3m'

const PERIODS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Сегодня' },
  { value: '7d', label: '7 дней' },
  { value: '30d', label: '30 дней' },
  { value: '3m', label: '3 месяца' },
]

const PERIOD_LABEL: Record<Period, string> = {
  today: 'сегодня',
  '7d': 'за 7 дней',
  '30d': 'за 30 дней',
  '3m': 'за 3 месяца',
}

interface LabelCount { label: string; count: number }

interface AnalyticsData {
  period: Period
  sessions: { period: number; today: number }
  messengerClicks: { total: number; breakdown: Record<string, number> }
  formSubmits: { period: number; today: number }
  quizCompletions: { period: number; today: number }
  carViews: { period: number; today: number }
  dailyChart: { date: string; count: number }[]
  topCars: { slug: string; title: string; views: number }[]
  sources:  LabelCount[]
  browsers: LabelCount[]
  os:       LabelCount[]
  devices:  LabelCount[]
  cities:   LabelCount[]
}

function DarkCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-brand-dark-2 border border-white/8 rounded-2xl', className)}>
      {children}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  sub: string
  color: string
}) {
  return (
    <DarkCard className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-white/50 text-sm font-medium">{label}</span>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-xs text-white/30 mt-1">{sub}</div>
    </DarkCard>
  )
}

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs text-white/40 text-right shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-red rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 text-xs text-white/70 font-semibold">{value}</div>
    </div>
  )
}

function BreakdownCard({
  icon: Icon,
  title,
  items,
  color = 'text-brand-red',
}: {
  icon: React.ElementType
  title: string
  items: LabelCount[]
  color?: string
}) {
  const max = Math.max(...items.map((i) => i.count), 1)
  return (
    <DarkCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className={color} />
        <span className="text-white/70 font-semibold text-sm">{title}</span>
      </div>
      {items.length === 0 ? (
        <div className="text-white/25 text-xs py-2">Нет данных</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <MiniBar key={item.label} label={item.label} value={item.count} max={max} />
          ))}
        </div>
      )}
    </DarkCard>
  )
}

function DailyChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const showEvery = data.length > 14 ? 7 : data.length > 7 ? 3 : 1
  return (
    <DarkCard className="p-5 h-full">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-brand-red" />
        <span className="text-white/70 font-semibold text-sm">Сессии по дням</span>
      </div>
      <div className="flex items-end gap-1 h-28">
        {data.map((d, i) => {
          const pct = Math.round((d.count / max) * 100)
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full bg-white/10 group-hover:bg-brand-red rounded-t transition-all duration-300"
                  style={{ height: `${Math.max(pct, 3)}px`, maxHeight: '96px', minHeight: '3px' }}
                />
                <span className="absolute -top-5 text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {d.count}
                </span>
              </div>
              {i % showEvery === 0 && (
                <span className="text-[9px] text-white/25 leading-tight">{d.date.slice(0, 5)}</span>
              )}
            </div>
          )
        })}
      </div>
    </DarkCard>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [period])

  const periodLabel = PERIOD_LABEL[period]
  const messengerLabels: Record<string, string> = { telegram: 'Telegram', whatsapp: 'WhatsApp', max: 'MAX' }
  const messengerMax = data ? Math.max(...Object.values(data.messengerClicks.breakdown), 1) : 1

  return (
    <div className="space-y-6">

      {/* Header + Period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Аналитика</h1>
          <p className="text-white/40 text-sm mt-0.5">Статистика {periodLabel}</p>
        </div>

        <div className="flex gap-2 bg-brand-dark-3 rounded-xl p-1 self-start sm:self-auto">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
                period === p.value
                  ? 'bg-brand-red text-white'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data ? (
        <div className="text-white/40 text-sm">Не удалось загрузить данные</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Сессии" value={data.sessions.period} sub={`${data.sessions.today} сегодня`} color="bg-blue-500" />
            <StatCard icon={Send} label="Заявки" value={data.formSubmits.period} sub={`${data.formSubmits.today} сегодня`} color="bg-brand-red" />
            <StatCard icon={BarChart2} label="Квиз" value={data.quizCompletions.period} sub={`${data.quizCompletions.today} сегодня`} color="bg-violet-500" />
            <StatCard icon={Car} label="Просмотры авто" value={data.carViews.period} sub={`${data.carViews.today} сегодня`} color="bg-emerald-500" />
          </div>

          {/* Chart + Messenger */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DailyChart data={data.dailyChart} />
            </div>

            <DarkCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={16} className="text-brand-red" />
                <span className="text-white/70 font-semibold text-sm">Мессенджеры</span>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-black text-white">{data.messengerClicks.total}</div>
                <div className="text-xs text-white/30">кликов {periodLabel}</div>
              </div>
              <div className="space-y-3">
                {Object.entries(data.messengerClicks.breakdown).map(([key, val]) => (
                  <MiniBar key={key} label={messengerLabels[key] || key} value={val} max={messengerMax} />
                ))}
              </div>
            </DarkCard>
          </div>

          {/* Top cars */}
          {data.topCars.length > 0 && (
            <DarkCard className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <Eye size={16} className="text-brand-red" />
                <span className="text-white/70 font-semibold text-sm">Топ популярных автомобилей</span>
                <span className="text-white/25 text-xs ml-1">{periodLabel}</span>
              </div>
              <div className="space-y-2">
                {data.topCars.map((car, i) => {
                  const maxViews = data.topCars[0]?.views || 1
                  const pct = Math.round((car.views / maxViews) * 100)
                  return (
                    <div key={car.slug} className="flex items-center gap-3 group">
                      <div className="w-5 text-center text-xs font-bold text-white/25 shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/80 text-sm font-medium truncate mr-2">{car.title}</span>
                          <span className="text-white/50 text-xs shrink-0 flex items-center gap-1">
                            <Eye size={11} />
                            {car.views}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-red/70 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </DarkCard>
          )}

          {/* Audience breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <BreakdownCard icon={Globe}      title="Источники трафика"    items={data.sources  ?? []} color="text-blue-400" />
            <BreakdownCard icon={Monitor}    title="Браузеры"             items={data.browsers ?? []} color="text-emerald-400" />
            <BreakdownCard icon={Cpu}        title="Операционная система" items={data.os       ?? []} color="text-violet-400" />
            <BreakdownCard icon={Smartphone} title="Устройства"           items={data.devices  ?? []} color="text-amber-400" />
          </div>

          {(data.cities ?? []).length > 0 && (
            <DarkCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-rose-400" />
                <span className="text-white/70 font-semibold text-sm">Топ городов</span>
                <span className="text-white/25 text-xs ml-1">{periodLabel}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {(data.cities ?? []).map((c) => (
                  <MiniBar key={c.label} label={c.label} value={c.count} max={data.cities[0]?.count || 1} />
                ))}
              </div>
            </DarkCard>
          )}

          {/* Funnel */}
          <DarkCard className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-brand-red" />
              <span className="text-white/70 font-semibold text-sm">Воронка {periodLabel}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Сессии', value: data.sessions.period, color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
                { label: 'Просмотры авто', value: data.carViews.period, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
                { label: 'Мессенджер', value: data.messengerClicks.total, color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
                { label: 'Квиз', value: data.quizCompletions.period, color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
                { label: 'Заявки', value: data.formSubmits.period, color: 'bg-red-500/15 text-red-400 border-red-500/20' },
              ].map((item, i, arr) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`px-3 py-2.5 rounded-xl border text-center ${item.color}`}>
                    <div className="text-xl font-black">{item.value}</div>
                    <div className="text-xs font-medium mt-0.5 opacity-80">{item.label}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-white/20 text-lg">→</span>
                  )}
                </div>
              ))}
            </div>
          </DarkCard>
        </>
      )}
    </div>
  )
}
