import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Car } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('ru-RU').format(mileage) + ' км'
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num)
}

export function parseCar(raw: Record<string, unknown>): Car {
  return {
    ...raw,
    galleryImages: parseJsonArray(raw.galleryImages as string),
    damageImages: parseJsonArray(raw.damageImages as string),
    insuranceImages: parseJsonArray(raw.insuranceImages as string),
    similarCars: parseJsonArray(raw.similarCars as string),
  } as Car
}

export function parseJsonArray(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '...'
}

export const MESSENGERS = [
  { value: 'telegram', label: 'Telegram', href: 'https://t.me/asiabazar25', color: '#29A8EB' },
  { value: 'max', label: 'MAX', href: 'https://max.ru/asiabazar25', color: '#FF4F00' },
  { value: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/79149999999', color: '#25D366' },
] as const
