import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await request.json()
  const article = await prisma.article.update({ where: { id }, data })
  return NextResponse.json({ article })
}
