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

// ── Article block types ───────────────────────────────────────────────────
export interface TextBlock {
  type: 'text'
  heading: string
  body: string // \n\n-separated paragraphs
}

export interface CarItem { name: string; desc: string }
export interface StrategyGroup { label: string; cars: CarItem[] }

export interface StrategyBlock {
  type: 'strategy'
  title: string
  color: 'blue' | 'violet' | 'amber' | 'red' | 'slate'
  groups: StrategyGroup[]
  advantages: string[]
}

export interface HighlightBlock {
  type: 'highlight'
  heading: string
  color: 'amber' | 'blue' | 'emerald' | 'red'
  items: string[]
}

export interface SummaryBlock {
  type: 'summary'
  heading: string
  rows: { label: string; models: string }[]
  note: string
}

export type ArticleBlock = TextBlock | StrategyBlock | HighlightBlock | SummaryBlock

export interface ArticleContent {
  blocks: ArticleBlock[]
}

// legacy — kept for potential migration
export interface ArticleCategory {
  name: string; emoji: string; description: string
  whoFor: string; advantages: string[]; budget: string; examples: string[]
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
  comfort: 'bg-blue-50 text-blue-700 border-blue-100',
  standard: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  business: 'bg-amber-50 text-amber-700 border-amber-100',
  premium: 'bg-red-50 text-red-700 border-red-100',
}

export const STATUS_LABELS: Record<CarStatus, string> = {
  active: 'В наличии',
  sold: 'Продан',
  hidden: 'Скрыт',
}
