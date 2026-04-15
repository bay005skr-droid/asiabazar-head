import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const stats = await prisma.stats.findUnique({ where: { id: 'main' } })
  return NextResponse.json({ stats })
}

export async function PATCH(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await request.json()
  const stats = await prisma.stats.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  })
  return NextResponse.json({ stats })
}
