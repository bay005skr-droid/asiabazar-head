import type { Metadata } from 'next'
import '../globals.css'
import { Inter } from 'next/font/google'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Панель управления | АзияБазар', template: '%s | Admin' },
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-brand-dark text-white min-h-screen">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 min-w-0 lg:ml-64">
            <div className="p-4 md:p-8 pt-20 lg:pt-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
