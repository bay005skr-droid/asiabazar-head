'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function trackEvent(type: string, meta?: Record<string, string>) {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, meta }),
  }).catch(() => {})
}

export { trackEvent }

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (pathname === lastPath.current) return
    if (pathname.startsWith('/admin')) return
    lastPath.current = pathname
    trackEvent('session', { page: pathname })
  }, [pathname])

  return null
}
