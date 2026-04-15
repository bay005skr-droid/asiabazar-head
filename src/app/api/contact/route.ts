import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(10).max(30),
  desiredCar: z.string().optional(),
  budget: z.string().optional(),
  deliveryCity: z.string().optional(),
  comment: z.string().optional(),
  preferredMessenger: z.enum(['telegram', 'max', 'whatsapp']).default('telegram'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const record = await prisma.contactRequest.create({ data })

    return NextResponse.json({ success: true, id: record.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
