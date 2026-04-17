'use client'

import { useEffect } from 'react'
import { trackEvent } from './AnalyticsTracker'

export function CarViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent('car_view', { carSlug: slug })
  }, [slug])
  return null
}
