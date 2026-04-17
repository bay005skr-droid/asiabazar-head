import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getAdminSession, getAdminName } from '@/lib/auth'
import { parseCar, slugify } from '@/lib/utils'

function generateShortDescription(full: string): string {
  const words = full.trim().split(/\s+/)
  const slice = words.slice(0, 22)
  return slice.join(' ') + (words.length > 22 ? '...' : '')
}

const carSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(['comfort', 'standard', 'business', 'premium']),
  price: z.number().int().positive(),
  year: z.number().int().min(2000).max(2030),
  mileage: z.number().int().min(0),
  engineType: z.string().min(1),
  engineVolume: z.string().min(1),
  horsepower: z.number().int().positive(),
  transmission: z.string().min(1),
  drive: z.string().min(1),
  bodyType: z.string().min(1),
  seats: z.number().int().positive(),
  configuration: z.string().min(1),
  fullDescription: z.string().min(1),
  mainImage: z.string().min(1),
  galleryImages: z.array(z.string()).default([]),
  damageImages: z.array(z.string()).default([]),
  insuranceImages: z.array(z.string()).default([]),
  damageText: z.string().nullable().optional(),
  status: z.enum(['active', 'sold', 'hidden']).default('active'),
  similarCars: z.array(z.string()).default([]),
})

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const cars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ cars: cars.map(parseCar) })
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const data = carSchema.parse(body)
    const slug = slugify(`${data.brand}-${data.model}-${data.year}-${Date.now()}`)
    const adminName = await getAdminName()

    const car = await prisma.car.create({
      data: {
        ...data,
        slug,
        shortDescription: generateShortDescription(data.fullDescription),
        galleryImages: JSON.stringify(data.galleryImages),
        damageImages: JSON.stringify(data.damageImages),
        insuranceImages: JSON.stringify(data.insuranceImages),
        similarCars: JSON.stringify(data.similarCars),
        addedAt: new Date(),
        addedBy: adminName || 'unknown',
      },
    })
    return NextResponse.json({ car: parseCar(car as Record<string, unknown>) }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation', details: e.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
