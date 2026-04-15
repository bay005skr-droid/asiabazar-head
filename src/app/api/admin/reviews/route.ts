import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

const schema = z.object({
  author: z.string().min(1),
  city: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1),
  date: z.string().min(1),
  isActive: z.boolean().default(true),
})

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ reviews })
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const data = schema.parse(body)
  const review = await prisma.review.create({ data })
  return NextResponse.json({ review }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await request.json()
  const review = await prisma.review.update({ where: { id }, data })
  return NextResponse.json({ review })
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.review.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
