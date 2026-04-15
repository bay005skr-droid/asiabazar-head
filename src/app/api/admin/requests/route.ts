import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const requests = await prisma.contactRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ requests })
}

export async function PATCH(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, isRead } = await request.json()
  const updated = await prisma.contactRequest.update({ where: { id }, data: { isRead } })
  return NextResponse.json({ request: updated })
}
