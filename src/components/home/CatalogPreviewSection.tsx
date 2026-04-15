import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CarCard } from '@/components/cars/CarCard'
import { Car } from '@/types'

interface CatalogPreviewProps {
  cars: Car[]
}

export function CatalogPreviewSection({ cars }: CatalogPreviewProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="divider-red mb-4" />
            <h2 className="section-title">Актуальный каталог</h2>
            <p className="text-white/40 text-base mt-2">Автомобили с проверенной историей, готовые к заказу</p>
          </div>
          <Link href="/catalog" className="btn-outline-red whitespace-nowrap self-start sm:self-auto">
            Весь каталог
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-16 text-white/30">
            Нет доступных автомобилей
          </div>
        )}
      </div>
    </section>
  )
}
