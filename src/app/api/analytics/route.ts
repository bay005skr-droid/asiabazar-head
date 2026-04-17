import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, meta } = body

    if (!type || typeof type !== 'string') {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }

    await prisma.analyticsEvent.create({
      data: {
        type,
        meta: meta ? JSON.stringify(meta) : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
