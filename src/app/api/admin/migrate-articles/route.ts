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
  if (url.includes('r2.dev') || url.startsWith('/')) return url

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.google.com/',
      },
    })
    if (!res.ok) return url
    const buffer = Buffer.from(await res.arrayBuffer())
    const ext = url.match(/\.(jpg|jpeg|png|webp)/i)?.[1] ?? 'jpg'
    const key = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      CacheControl: 'public, max-age=31536000',
    }))
    return `${process.env.CF_R2_PUBLIC_URL}/${key}`
  } catch (e) {
    console.error('[migrate-articles] upload failed:', url, e)
    return url
  }
}

export async function POST() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const articles = await prisma.article.findMany()
  const results: { id: string; title: string; migrated: boolean }[] = []

  for (const article of articles) {
    const newCover = await uploadToR2(article.coverImage)
    const migrated = newCover !== article.coverImage

    if (migrated) {
      await prisma.article.update({
        where: { id: article.id },
        data: { coverImage: newCover },
      })
      console.log(`[migrate-articles] "${article.title}": ${article.coverImage} → ${newCover}`)
    }

    results.push({ id: article.id, title: article.title, migrated })
  }

  return NextResponse.json({
    ok: true,
    total: results.length,
    migrated: results.filter(r => r.migrated).length,
    skipped: results.filter(r => !r.migrated).length,
    details: results,
  })
}
