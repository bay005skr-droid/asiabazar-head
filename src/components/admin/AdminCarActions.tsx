'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, ExternalLink, Loader2, Copy } from 'lucide-react'

export function AdminCarActions({ carId, carSlug }: { carId: string; carSlug: string }) {
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Удалить автомобиль? Это действие нельзя отменить.')) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/cars/${carId}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    setDuplicating(true)
    try {
      const res = await fetch(`/api/admin/cars/${carId}`, { method: 'POST' })
      if (res.ok) router.refresh()
    } finally {
      setDuplicating(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/catalog/${carSlug}`}
        target="_blank"
        className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        title="Открыть на сайте"
      >
        <ExternalLink size={14} />
      </Link>
      <Link
        href={`/admin/cars/${carId}/edit`}
        className="p-1.5 text-white/30 hover:text-brand-red rounded-lg hover:bg-brand-red/10 transition-all"
        title="Редактировать"
      >
        <Pencil size={14} />
      </Link>
      <button
        onClick={handleDuplicate}
        disabled={duplicating}
        className="p-1.5 text-white/30 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all"
        title="Дублировать"
      >
        {duplicating ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
        title="Удалить"
      >
        {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
    </div>
  )
}
