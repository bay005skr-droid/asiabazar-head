import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CarForm } from '@/components/admin/CarForm'

export const metadata: Metadata = { title: 'Новый автомобиль' }

export default function NewCarPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/cars" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Назад к списку
        </Link>
        <h1 className="text-2xl font-black text-white">Новый автомобиль</h1>
      </div>
      <CarForm mode="new" />
    </div>
  )
}
