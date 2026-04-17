'use client'

import { usePathname } from 'next/navigation'

export function AdminContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return <main className="flex-1 min-w-0">{children}</main>
  }

  return (
    <main className="flex-1 min-w-0 lg:ml-64">
      <div className="p-4 md:p-8 pt-20 lg:pt-8">{children}</div>
    </main>
  )
}
