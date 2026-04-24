import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getAdminSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
  },
})

async function uploadToR2(url: string): Promise<string> {
  // Already on R2 — skip
  if (url.includes('r2.dev') || url.startsWith('/')) return url

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return url
    const buffer = Buffer.from(await res.arrayBuffer())
    const ext = url.match(/\.(jpg|jpeg|png|webp)/i)?.[1] ?? 'jpg'
    const key = `cars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      CacheControl: 'public, max-age=31536000',
    }))
    return `${process.env.CF_R2_PUBLIC_URL}/${key}`
  } catch {
    return url // keep original on failure
  }
}

export async function POST() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cars = await prisma.car.findMany()
  const results: { id: string; title: string; migrated: number; skipped: number }[] = []

  for (const car of cars) {
    let migrated = 0
    let skipped = 0

    // mainImage
    const newMain = await uploadToR2(car.mainImage)
    if (newMain !== car.mainImage) migrated++; else skipped++

    // galleryImages
    const gallery: string[] = JSON.parse(car.galleryImages || '[]')
    const newGallery: string[] = []
    for (const url of gallery) {
      const r = await uploadToR2(url)
      newGallery.push(r)
      if (r !== url) migrated++; else skipped++
    }

    // damageImages
    const damage: string[] = JSON.parse(car.damageImages || '[]')
    const newDamage: string[] = []
    for (const url of damage) {
      const r = await uploadToR2(url)
      newDamage.push(r)
      if (r !== url) migrated++; else skipped++
    }

    await prisma.car.update({
      where: { id: car.id },
      data: {
        mainImage: newMain,
        galleryImages: JSON.stringify(newGallery),
        damageImages: JSON.stringify(newDamage),
      },
    })

    results.push({ id: car.id, title: car.title, migrated, skipped })
    console.log(`[migrate] ${car.title}: migrated=${migrated} skipped=${skipped}`)
  }

  const totalMigrated = results.reduce((s, r) => s + r.migrated, 0)
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0)

  return NextResponse.json({
    ok: true,
    cars: results.length,
    totalMigrated,
    totalSkipped,
    details: results,
  })
}
