import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseCar } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const where: Prisma.CarWhereInput = {}

  const status = searchParams.get('status')
  if (status) where.status = status
  else where.status = 'active'

  const category = searchParams.get('category')
  if (category) where.category = category

  const brand = searchParams.get('brand')
  if (brand) where.brand = brand

  const engineType = searchParams.get('engineType')
  if (engineType) where.engineType = { contains: engineType }

  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  if (priceMin || priceMax) {
    where.price = {
      ...(priceMin ? { gte: parseInt(priceMin) } : {}),
      ...(priceMax ? { lte: parseInt(priceMax) } : {}),
    }
  }

  const sort = searchParams.get('sort') || 'newest'
  let orderBy: Prisma.CarOrderByWithRelationInput = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  if (sort === 'price_desc') orderBy = { price: 'desc' }
  if (sort === 'year_desc') orderBy = { year: 'desc' }
  if (sort === 'mileage_asc') orderBy = { mileage: 'asc' }

  const take = parseInt(searchParams.get('take') || '12')
  const skip = parseInt(searchParams.get('skip') || '0')

  const [cars, total] = await Promise.all([
    prisma.car.findMany({ where, orderBy, take, skip }),
    prisma.car.count({ where }),
  ])

  return NextResponse.json({ cars: cars.map(parseCar), total })
}
