'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, ArrowRight, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { Car, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import { formatPrice, formatMileage, cn } from '@/lib/utils'

interface CarCardProps {
  car: Car
  featured?: boolean
}

export function CarCard({ car, featured }: CarCardProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const allImages = [car.mainImage, ...car.galleryImages.filter((i) => i !== car.mainImage)]
  const hasMultiple = allImages.length > 1

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + allImages.length) % allImages.length)
    setLoaded(false)
  }

  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % allImages.length)
    setLoaded(false)
  }

  return (
    <Link href={`/catalog/${car.slug}`} className="group block">
      <article
        className={cn(
          'bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col',
          featured && 'ring-1 ring-brand-red/20'
        )}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
          <img
            key={imgIdx}
            src={allImages[imgIdx] || car.mainImage}
            alt={car.title}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Sold overlay */}
          {car.status === 'sold' && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="text-gray-600 font-black text-xl tracking-widest">ПРОДАН</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={cn('badge-category', CATEGORY_COLORS[car.category])}>
              {CATEGORY_LABELS[car.category]}
            </span>
          </div>

          {/* Prev / Next buttons */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label="Следующее фото"
              >
                <ChevronRight size={14} />
              </button>
            </>
          )}

          {/* Dots — centered at bottom */}
          {hasMultiple && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1 pointer-events-none">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === imgIdx ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-gray-900 font-bold text-base leading-tight mb-1 group-hover:text-brand-red transition-colors line-clamp-2">
            {car.title}
          </h3>
          <p className="text-brand-red font-black text-lg mb-3">
            {formatPrice(car.price)}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-300" />
              {car.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge size={13} className="text-gray-300" />
              {formatMileage(car.mileage)}
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel size={13} className="text-gray-300" />
              {car.engineType}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={13} className="text-gray-300" />
              {car.horsepower} л.с.
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
            {car.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-md text-xs bg-gray-50 text-gray-500 border border-gray-100">
              {car.transmission}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs bg-gray-50 text-gray-500 border border-gray-100">
              {car.drive}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-brand-red text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              Подробнее
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-gray-300 text-xs">{car.bodyType}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function CarCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="flex gap-3">
          <div className="h-4 skeleton rounded w-16" />
          <div className="h-4 skeleton rounded w-20" />
          <div className="h-4 skeleton rounded w-14" />
        </div>
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-2/3" />
      </div>
    </div>
  )
}
