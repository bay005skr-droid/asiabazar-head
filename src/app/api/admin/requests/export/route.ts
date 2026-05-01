import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  let where = {}
  if (from || to) {
    const gte = from ? (() => { const d = new Date(from); d.setHours(0, 0, 0, 0); return d })() : undefined
    const lte = to   ? (() => { const d = new Date(to);   d.setHours(23, 59, 59, 999); return d })() : undefined
    where = { createdAt: { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) } }
  }

  const requests = await prisma.contactRequest.findMany({ where, orderBy: { createdAt: 'desc' } })

  const messengerMap: Record<string, string> = { telegram: 'Telegram', whatsapp: 'WhatsApp', max: 'MAX' }

  const header = ['Дата', 'Имя', 'Телефон', 'Желаемый авто', 'Бюджет', 'Город доставки', 'Мессенджер', 'Комментарий', 'Статус']

  const rows = requests.map((r) => [
    new Date(r.createdAt).toLocaleString('ru-RU'),
    r.name,
    r.phone,
    r.desiredCar || '',
    r.budget || '',
    r.deliveryCity || '',
    messengerMap[r.preferredMessenger] || r.preferredMessenger,
    r.comment || '',
    r.isRead ? 'Прочитано' : 'Новая',
  ])

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const csv = [header, ...rows].map((row) => row.map(escape).join(',')).join('\r\n')
  const bom = '\uFEFF' // UTF-8 BOM for correct Cyrillic in Excel/Google Sheets

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="requests-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
