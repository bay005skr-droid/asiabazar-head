import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

function getPeriodStart(period: string): Date {
  const now = new Date()
  switch (period) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '3m':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case '30d':
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

export async function GET(req: NextRequest) {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') || '30d'
  const now = new Date()
  const periodStart = getPeriodStart(period)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Chart days count based on period
  const chartDays = period === 'today' ? 1 : period === '7d' ? 7 : period === '3m' ? 90 : 30

  const [
    sessionsPeriod,
    sessionsToday,
    messengerClicksAll,
    formSubmitsPeriod,
    formSubmitsToday,
    quizCompletionsPeriod,
    quizCompletionsToday,
    carViewsPeriod,
    carViewsToday,
    messengerBreakdown,
    dailySessions,
    carViewEvents,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: 'session', createdAt: { gte: periodStart } } }),
    prisma.analyticsEvent.count({ where: { type: 'session', createdAt: { gte: startOfToday } } }),
    prisma.analyticsEvent.count({ where: { type: 'messenger_click', createdAt: { gte: periodStart } } }),
    prisma.analyticsEvent.count({ where: { type: 'form_submit', createdAt: { gte: periodStart } } }),
    prisma.analyticsEvent.count({ where: { type: 'form_submit', createdAt: { gte: startOfToday } } }),
    prisma.analyticsEvent.count({ where: { type: 'quiz_complete', createdAt: { gte: periodStart } } }),
    prisma.analyticsEvent.count({ where: { type: 'quiz_complete', createdAt: { gte: startOfToday } } }),
    prisma.analyticsEvent.count({ where: { type: 'car_view', createdAt: { gte: periodStart } } }),
    prisma.analyticsEvent.count({ where: { type: 'car_view', createdAt: { gte: startOfToday } } }),
    // Messenger breakdown for period
    prisma.analyticsEvent.findMany({
      where: { type: 'messenger_click', createdAt: { gte: periodStart } },
      select: { meta: true },
    }),
    // Daily sessions for chart
    prisma.analyticsEvent.findMany({
      where: {
        type: 'session',
        createdAt: { gte: new Date(now.getTime() - chartDays * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true },
    }),
    // Car view events for top cars
    prisma.analyticsEvent.findMany({
      where: { type: 'car_view', createdAt: { gte: periodStart } },
      select: { meta: true },
    }),
  ])

  // Aggregate messenger breakdown
  const messengerCounts: Record<string, number> = { telegram: 0, whatsapp: 0, max: 0 }
  for (const e of messengerBreakdown) {
    if (!e.meta) continue
    try {
      const m = JSON.parse(e.meta)
      const name = m.messenger as string
      if (name in messengerCounts) messengerCounts[name]++
      else messengerCounts[name] = (messengerCounts[name] || 0) + 1
    } catch {}
  }

  // Build daily chart
  const dailyMap: Record<string, number> = {}
  for (let i = chartDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`
    dailyMap[key] = 0
  }
  for (const e of dailySessions) {
    const d = new Date(e.createdAt)
    const key = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`
    if (key in dailyMap) dailyMap[key]++
  }
  const dailyChart = Object.entries(dailyMap).map(([date, count]) => ({ date, count }))

  // Aggregate top cars by views
  const carViewCounts: Record<string, number> = {}
  for (const e of carViewEvents) {
    if (!e.meta) continue
    try {
      const m = JSON.parse(e.meta)
      const slug = m.carSlug as string
      if (slug) carViewCounts[slug] = (carViewCounts[slug] || 0) + 1
    } catch {}
  }

  // Get top 10 slugs by view count
  const topSlugs = Object.entries(carViewCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([slug]) => slug)

  // Fetch car titles for top slugs
  const topCarsRaw = topSlugs.length > 0
    ? await prisma.car.findMany({
        where: { slug: { in: topSlugs } },
        select: { slug: true, title: true, brand: true, model: true },
      })
    : []

  const topCarsMap = Object.fromEntries(topCarsRaw.map((c) => [c.slug, `${c.brand} ${c.model}`]))

  const topCars = topSlugs.map((slug) => ({
    slug,
    title: topCarsMap[slug] || slug,
    views: carViewCounts[slug] || 0,
  }))

  return NextResponse.json({
    period,
    sessions: { period: sessionsPeriod, today: sessionsToday },
    messengerClicks: { total: messengerClicksAll, breakdown: messengerCounts },
    formSubmits: { period: formSubmitsPeriod, today: formSubmitsToday },
    quizCompletions: { period: quizCompletionsPeriod, today: quizCompletionsToday },
    carViews: { period: carViewsPeriod, today: carViewsToday },
    dailyChart,
    topCars,
  })
}
