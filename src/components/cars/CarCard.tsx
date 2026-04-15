'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Fuel, Gauge, Calendar, ArrowRight, Zap } from 'lucide-react'
import { Car, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import { formatPrice, formatMileage, cn } from '@/lib/utils'

interface CarCardProps {
  car: Car
  featured?: boolean
}

export function CarCard({ car, featured }: CarCardProps) {
  return (
    <Link href={`/catalog/${car.slug}`} className="group block">
      <article className={cn('card h-full flex flex-col overflow-hidden', featured && 'ring-1 ring-brand-red/30')}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10] bg-brand-gray">
          <Image
            src={car.mainImage}
            alt={car.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status badge */}
          {car.status === 'sold' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-black text-xl tracking-widest opacity-80">ПРОДАН</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={cn('badge-category', CATEGORY_COLORS[car.category])}>
              {CATEGORY_LABELS[car.category]}
            </span>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <span className="text-white font-black text-lg drop-shadow-lg">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-white font-bold text-base leading-tight mb-3 group-hover:text-brand-red transition-colors line-clamp-2">
            {car.title}
          </h3>

          {/* Specs row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-white/50 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-white/30" />
              {car.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge size={13} className="text-white/30" />
              {formatMileage(car.mileage)}
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel size={13} className="text-white/30" />
              {car.engineType}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={13} className="text-white/30" />
              {car.horsepower} л.с.
            </span>
          </div>

          {/* Short description */}
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {car.shortDescription}
          </p>

          {/* Transmission */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/40 border border-white/5">
              {car.transmission}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/40 border border-white/5">
              {car.drive}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-brand-red text-sm font-semibold group-hover:gap-2 flex items-center gap-1.5 transition-all">
              Подробнее
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-white/20 text-xs">{car.bodyType}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function CarCardSkeleton() {
  return (
    <div className="card overflow-hidden">
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
