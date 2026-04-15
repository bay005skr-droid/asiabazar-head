export type CarCategory = 'comfort' | 'standard' | 'business' | 'premium'
export type CarStatus = 'active' | 'sold' | 'hidden'
export type MessengerType = 'telegram' | 'max' | 'whatsapp'

export interface Car {
  id: string
  slug: string
  brand: string
  model: string
  title: string
  category: CarCategory
  price: number
  year: number
  addedAt: Date | string
  mileage: number
  engineType: string
  engineVolume: string
  horsepower: number
  transmission: string
  drive: string
  bodyType: string
  seats: number
  configuration: string
  shortDescription: string
  fullDescription: string
  mainImage: string
  galleryImages: string[]
  damageImages: string[]
  insuranceImages: string[]
  damageText: string | null
  status: CarStatus
  similarCars: string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface Review {
  id: string
  author: string
  city: string
  rating: number
  text: string
  date: string
  isActive: boolean
  createdAt?: Date | string
}

export interface Stats {
  id: string
  selectedCars: number
  deliveredCars: number
  completedDeals: number
  happyClients: number
}

export interface ArticleCategory {
  name: string
  emoji: string
  description: string
  whoFor: string
  advantages: string[]
  budget: string
  examples: string[]
}

export interface ArticleContent {
  intro: string
  categories: ArticleCategory[]
  conclusion: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  publishedAt: Date | string
  updatedAt?: Date | string
}

export interface ContactRequest {
  id: string
  name: string
  phone: string
  desiredCar?: string
  budget?: string
  deliveryCity?: string
  comment?: string
  preferredMessenger: MessengerType
  createdAt: Date | string
  isRead: boolean
}

export interface CatalogFilters {
  category?: CarCategory
  priceMin?: number
  priceMax?: number
  yearMin?: number
  yearMax?: number
  mileageMax?: number
  brand?: string
  engineType?: string
  sort?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest'
}

export const CATEGORY_LABELS: Record<CarCategory, string> = {
  comfort: 'Комфорт',
  standard: 'Стандарт',
  business: 'Бизнес',
  premium: 'Премиум',
}

export const CATEGORY_COLORS: Record<CarCategory, string> = {
  comfort: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  standard: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  business: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  premium: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export const STATUS_LABELS: Record<CarStatus, string> = {
  active: 'В наличии',
  sold: 'Продан',
  hidden: 'Скрыт',
}
