'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Car, LogOut, Menu, X, Globe, BarChart2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/cars', label: 'Автомобили', icon: Car },
  { href: '/admin/article', label: 'Статьи', icon: FileText },
  { href: '/admin/analytics', label: 'Аналитика', icon: BarChart2 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === '/admin/login') return null

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
          <span className="text-white font-black text-sm">АБ</span>
        </div>
        <div>
          <div className="text-white font-bold text-sm">АзияБазар</div>
          <div className="text-white/30 text-xs">Панель управления</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive(item.href, item.exact)
                ? 'bg-brand-red text-white shadow-red'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/5 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={17} />
          Открыть сайт
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={17} />
          Выйти
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden bg-brand-dark-2 border-b border-white/5 flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-red flex items-center justify-center">
            <span className="text-white font-black text-xs">АБ</span>
          </div>
          <span className="text-white font-bold text-sm">Админка</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white/50">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-brand-dark-2 border-r border-white/5 flex-col z-40">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-brand-dark-2 border-r border-white/5 flex flex-col pt-16">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
