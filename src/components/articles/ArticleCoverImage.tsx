'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt: string
}

export function ArticleCoverImage({ src, alt }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-3">🚗</div>
          <p className="text-gray-400 text-sm">Изображение недоступно</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}
