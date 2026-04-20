'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCheck, MessageSquare } from 'lucide-react'

export function AdminRequestActions({ requestId, isRead, comment }: { requestId: string; isRead: boolean; comment: string }) {
  const [loading, setLoading] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const router = useRouter()

  const markRead = async () => {
    setLoading(true)
    await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: requestId, isRead: true }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {comment && (
        <div className="relative">
          <button onClick={() => setShowComment(!showComment)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all">
            <MessageSquare size={14} />
          </button>
          {showComment && (
            <div className="absolute right-0 bottom-8 w-64 bg-brand-dark-3 border border-white/10 rounded-xl p-3 text-white/60 text-xs shadow-xl z-10">
              {comment}
            </div>
          )}
        </div>
      )}
      {!isRead && (
        <button
          onClick={markRead}
          disabled={loading}
          className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
          title="Отметить прочитанным"
        >
          <CheckCheck size={14} />
        </button>
      )}
    </div>
  )
}
