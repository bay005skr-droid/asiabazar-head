'use client'

import { useState, useEffect } from 'react'

const BASE_VIEWS = 4_847
const KEY = 'ab_article_views'

export function useArticleViews() {
  const [views, setViews] = useState(BASE_VIEWS)

  useEffect(() => {
    // Init from session
    const stored = sessionStorage.getItem(KEY)
    const initial = stored ? parseInt(stored) : BASE_VIEWS
    setViews(initial)
    if (!stored) sessionStorage.setItem(KEY, String(initial))

    // Increment every 60s by 15-50
    const interval = setInterval(() => {
      setViews((prev) => {
        const delta = Math.floor(Math.random() * 36) + 15
        const next = prev + delta
        sessionStorage.setItem(KEY, String(next))
        return next
      })
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  return views
}
