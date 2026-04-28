'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/#how-we-work', label: 'Как мы работаем' },
  { href: '/#reviews', label: 'Отзывы' },
]

const messengerLinks = [
  {
    href: 'https://t.me/+79269264042',
    label: 'Telegram',
    bg: 'bg-[#29A8EB]',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    href: 'https://wa.me/79950648966',
    label: 'WhatsApp',
    bg: 'bg-[#25D366]',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    ),
  },
  {
    href: 'https://max.ru/u/f9LHodD0cOIQ9QxqkpNUSEYyXfBvpTTJp3ofefBq261OWTGHB5aCfJjgZfk',
    label: 'MAX',
    bg: 'overflow-hidden',
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg/1280px-%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg.png"
        alt="MAX"
        className="w-full h-full object-contain block"
      />
    ),
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        isScrolled
          ? 'bg-white border-b border-gray-200 shadow-sm'
          : 'bg-white/95 border-b border-gray-100 backdrop-blur-sm'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <img src="/logo.webp" alt="AZIA BAZAR" className="h-9 w-auto" />
              <span
                className="text-gray-900 group-hover:text-brand-red transition-colors tracking-widest uppercase leading-none"
                style={{ fontFamily: "'Futura PT', 'Century Gothic', sans-serif", fontWeight: 600, fontSize: '1.05rem' }}
              >
                AZIA<br />BAZAR
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-brand-red bg-red-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Messengers — shifted slightly closer to buttons */}
              <div className="flex items-center gap-1.5 mr-1">
                {messengerLinks.map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={m.label}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md',
                      m.bg
                    )}
                  >
                    {m.icon}
                  </a>
                ))}
              </div>

              {/* Both buttons — identical size */}
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold
                  bg-white border border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-900
                  transition-all duration-200 active:scale-95"
              >
                Каталог
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold
                  bg-brand-red hover:bg-brand-red-dark text-white shadow-red
                  transition-all duration-200 active:scale-95"
              >
                Подобрать авто
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              aria-label="Меню"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — only in DOM when open, so overlay never blocks clicks when closed */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-white border-l border-gray-100 shadow-2xl animate-slide-in-right">
            <div className="flex flex-col h-full pt-20 pb-8 px-6">
              <nav className="flex flex-col gap-1 mb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                      pathname === link.href ? 'text-brand-red bg-red-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-2 justify-center">
                  {messengerLinks.map((m) => (
                    <a
                      key={m.label}
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all', m.bg)}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </a>
                  ))}
                </div>
                <Link href="/catalog" className="btn-secondary w-full justify-center text-sm">Каталог</Link>
                <Link href="/quiz" className="btn-primary w-full justify-center">Подобрать авто</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
