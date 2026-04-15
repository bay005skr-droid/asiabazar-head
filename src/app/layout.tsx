import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'АзияБазар — Автомобили из Южной Кореи под заказ',
    template: '%s | АзияБазар',
  },
  description:
    'Подбор, проверка, видеообзор, оформление и доставка автомобилей из Кореи. Прозрачная сделка, гарантия чистоты истории. Работаем с 2019 года.',
  keywords: [
    'автомобили из Кореи',
    'пригнать авто из Кореи',
    'Hyundai из Кореи',
    'Kia из Кореи',
    'Genesis из Кореи',
    'купить авто в Корее',
    'доставка авто из Кореи',
    'АзияБазар',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'АзияБазар',
    title: 'АзияБазар — Автомобили из Южной Кореи под заказ',
    description:
      'Подбор, проверка, видеообзор и доставка автомобилей из Кореи. Прозрачная сделка с сопровождением.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'АзияБазар — Автомобили из Южной Кореи',
    description: 'Подбор и доставка автомобилей из Кореи под заказ',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export const viewport: Viewport = {
  themeColor: '#0F0F0F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-brand-dark text-white overflow-x-hidden">
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
        <Toaster />
      </body>
    </html>
  )
}
