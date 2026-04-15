import { HeroSection } from '@/components/home/HeroSection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { ArticlePromoSection } from '@/components/home/ArticlePromoSection'
import { CatalogPreviewSection } from '@/components/home/CatalogPreviewSection'
import { HowWeWorkSection } from '@/components/home/HowWeWorkSection'
import { StatsSection } from '@/components/home/StatsSection'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { FaqSection } from '@/components/home/FaqSection'
import { ContactSection } from '@/components/home/ContactSection'
import prisma from '@/lib/prisma'
import { parseCar } from '@/lib/utils'

export const revalidate = 60

export default async function HomePage() {
  const [carsRaw, reviews, statsRaw] = await Promise.all([
    prisma.car.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.review.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.stats.findUnique({ where: { id: 'main' } }),
  ])

  const cars = carsRaw.map(parseCar)
  const stats = statsRaw || { selectedCars: 847, deliveredCars: 624, completedDeals: 598, happyClients: 581 }

  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ArticlePromoSection />
      <CatalogPreviewSection cars={cars} />
      <HowWeWorkSection />
      <StatsSection stats={stats} />
      <ReviewsSection reviews={reviews} />
      <FaqSection />
      <ContactSection />
    </>
  )
}
