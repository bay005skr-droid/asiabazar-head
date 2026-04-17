import { Metadata } from 'next'
import { CatalogFilters } from '@/components/cars/CatalogFilters'
import { CarCard } from '@/components/cars/CarCard'
import { ContactSection } from '@/components/home/ContactSection'
import prisma from '@/lib/prisma'
import { parseCar } from '@/lib/utils'
import { CarCategory } from '@/types'
import { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Каталог автомобилей из Кореи',
  description: 'Подборка автомобилей Hyundai, Kia, Genesis из Южной Кореи под заказ. Все категории: комфорт, стандарт, бизнес, премиум.',
}

interface Props {
  searchParams: {
    category?: string
    brand?: string
    engineType?: string
    transmission?: string
    yearMin?: string
    yearMax?: string
    mileageMax?: string
    priceMin?: string
    priceMax?: string
    bodyType?: string
    drive?: string
    sort?: string
    page?: string
  }
}

const PAGE_SIZE = 12

export default async function CatalogPage({ searchParams }: Props) {
  const where: Prisma.CarWhereInput = { status: 'active' }

  if (searchParams.category) where.category = searchParams.category as CarCategory
  if (searchParams.brand) where.brand = searchParams.brand
  if (searchParams.engineType) where.engineType = { contains: searchParams.engineType }
  if (searchParams.transmission) where.transmission = { contains: searchParams.transmission }
  if (searchParams.yearMin || searchParams.yearMax) {
    where.year = {
      ...(searchParams.yearMin ? { gte: parseInt(searchParams.yearMin) } : {}),
      ...(searchParams.yearMax ? { lte: parseInt(searchParams.yearMax) } : {}),
    }
  }
  if (searchParams.mileageMax) where.mileage = { lte: parseInt(searchParams.mileageMax) }
  if (searchParams.priceMin || searchParams.priceMax) {
    where.price = {
      ...(searchParams.priceMin ? { gte: parseInt(searchParams.priceMin) } : {}),
      ...(searchParams.priceMax ? { lte: parseInt(searchParams.priceMax) } : {}),
    }
  }
  if (searchParams.bodyType) where.bodyType = { contains: searchParams.bodyType }
  if (searchParams.drive) where.drive = { contains: searchParams.drive }

  let orderBy: Prisma.CarOrderByWithRelationInput = { createdAt: 'desc' }
  switch (searchParams.sort) {
    case 'price_asc': orderBy = { price: 'asc' }; break
    case 'price_desc': orderBy = { price: 'desc' }; break
    case 'year_desc': orderBy = { year: 'desc' }; break
    case 'mileage_asc': orderBy = { mileage: 'asc' }; break
  }

  const page = parseInt(searchParams.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const [carsRaw, total] = await Promise.all([
    prisma.car.findMany({ where, orderBy, take: PAGE_SIZE, skip }),
    prisma.car.count({ where }),
  ])

  const cars = carsRaw.map(parseCar)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const hasFilters = !!(
    searchParams.category || searchParams.brand || searchParams.engineType ||
    searchParams.transmission || searchParams.yearMin || searchParams.yearMax ||
    searchParams.mileageMax || searchParams.priceMin || searchParams.priceMax ||
    searchParams.bodyType || searchParams.drive ||
    (searchParams.sort && searchParams.sort !== 'newest')
  )

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="mb-8">
          <div className="divider-red mb-4" />
          <h1 className="section-title mb-2">Каталог автомобилей</h1>
          <p className="text-gray-400 text-base">
            {total > 0 ? `Найдено ${total} автомобил${total === 1 ? 'ь' : total < 5 ? 'я' : 'ей'}` : 'Нет результатов'}
          </p>
        </div>

        {/* Filters — props passed from server, no useSearchParams / no Suspense needed */}
        <CatalogFilters
          currentCategory={searchParams.category || ''}
          currentBrand={searchParams.brand || ''}
          currentEngineType={searchParams.engineType || ''}
          currentTransmission={searchParams.transmission || ''}
          currentYearMin={searchParams.yearMin || ''}
          currentYearMax={searchParams.yearMax || ''}
          currentMileageMax={searchParams.mileageMax || ''}
          currentPriceMin={searchParams.priceMin || ''}
          currentPriceMax={searchParams.priceMax || ''}
          currentBodyType={searchParams.bodyType || ''}
          currentDrive={searchParams.drive || ''}
          hasFilters={hasFilters}
        />

        {/* Grid */}
        <div className="mt-8">
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <div className="text-5xl">🔍</div>
              <h3 className="text-xl font-bold text-gray-900">Ничего не найдено</h3>
              <p className="text-gray-400 text-sm">Попробуйте изменить фильтры или оставьте заявку — мы подберём под ваш запрос</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                  p === page
                    ? 'bg-brand-red text-white shadow-red'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="mt-20">
        <ContactSection />
      </div>
    </div>
  )
}
