import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminContentWrapper } from '@/components/admin/AdminContentWrapper'

export const metadata: Metadata = {
  title: { default: 'Панель управления | АзияБазар', template: '%s | Admin' },
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-dark text-white min-h-screen flex">
      <AdminSidebar />
      <AdminContentWrapper>{children}</AdminContentWrapper>
    </div>
  )
}
