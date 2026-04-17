import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { parseCar } from '@/lib/utils'

function generateShortDescription(full: string): string {
  const words = full.trim().split(/\s+/)
  const slice = words.slice(0, 22)
  return slice.join(' ') + (words.length > 22 ? '...' : '')
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const update: Record<string, unknown> = { ...body }

    if (Array.isArray(body.galleryImages)) update.galleryImages = JSON.stringify(body.galleryImages)
    if (Array.isArray(body.damageImages)) update.damageImages = JSON.stringify(body.damageImages)
    if (Array.isArray(body.insuranceImages)) update.insuranceImages = JSON.stringify(body.insuranceImages)
    if (Array.isArray(body.similarCars)) update.similarCars = JSON.stringify(body.similarCars)
    if (typeof body.fullDescription === 'string') {
      update.shortDescription = generateShortDescription(body.fullDescription)
    }

    const car = await prisma.car.update({ where: { id: params.id }, data: update })
    return NextResponse.json({ car: parseCar(car as Record<string, unknown>) })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.car.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
