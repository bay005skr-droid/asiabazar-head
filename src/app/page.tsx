import { HeroSection } from '@/components/home/HeroSection'
import { ArticlePromoSection } from '@/components/home/ArticlePromoSection'
import { CatalogPreviewSection } from '@/components/home/CatalogPreviewSection'
import { HomeStatsSection } from '@/components/home/HomeStatsSection'
import { HowWeWorkSection } from '@/components/home/HowWeWorkSection'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { FaqSection } from '@/components/home/FaqSection'
import { ContactSection } from '@/components/home/ContactSection'
import prisma from '@/lib/prisma'
import { parseCar } from '@/lib/utils'

export const revalidate = 60

export default async function HomePage() {
  const [carsRaw, statsRow] = await Promise.all([
    prisma.car.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.stats.findUnique({ where: { id: 'main' } }),
  ])

  const cars = carsRaw.map(parseCar)
  const deliveryDays = statsRow?.deliveryDays ?? 12

  // Cars for the slideshow in ArticlePromoSection (with price + title)
  const articleCars = cars
    .filter((c) => c.mainImage)
    .slice(0, 8)
    .map((c) => ({ mainImage: c.mainImage, price: c.price, title: c.title, slug: c.slug }))

  return (
    <>
      <HeroSection cars={cars} deliveryDays={deliveryDays} />
      <CatalogPreviewSection cars={cars} />
      <HomeStatsSection />
      <ArticlePromoSection cars={articleCars} />
      <HowWeWorkSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  )
}
