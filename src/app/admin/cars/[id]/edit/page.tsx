import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CarForm } from '@/components/admin/CarForm'
import prisma from '@/lib/prisma'
import { parseCar } from '@/lib/utils'

interface Props { params: { id: string } }

export const metadata: Metadata = { title: 'Редактировать автомобиль' }

export default async function EditCarPage({ params }: Props) {
  const raw = await prisma.car.findUnique({ where: { id: params.id } })
  if (!raw) notFound()
  const car = parseCar(raw as Record<string, unknown>)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/cars" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Назад к списку
        </Link>
        <h1 className="text-2xl font-black text-white">Редактировать</h1>
        <p className="text-white/40 text-sm mt-0.5">{car.title}</p>
      </div>
      <CarForm mode="edit" car={car} />
    </div>
  )
}
