import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import path from 'path'
import { getAdminSession } from '@/lib/auth'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.CF_R2_BUCKET_NAME!
const PUBLIC_URL = process.env.CF_R2_PUBLIC_URL! // e.g. https://pub-xxx.r2.dev

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.CF_ACCOUNT_ID || !process.env.CF_R2_ACCESS_KEY_ID) {
    return NextResponse.json({ error: 'R2 не настроен — добавьте переменные окружения' }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name) || '.jpg'
    const filename = `cars/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: file.type || 'image/jpeg',
      CacheControl: 'public, max-age=31536000',
    }))

    return NextResponse.json({ url: `${PUBLIC_URL}/${filename}` })
  } catch (e) {
    console.error('[upload]', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
