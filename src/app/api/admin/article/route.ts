import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[а-яёА-ЯЁ]/g, (c) => {
      const map: Record<string, string> = {
        а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'j',
        к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
        х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
      }
      return map[c.toLowerCase()] ?? ''
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' } })
  return NextResponse.json({ articles })
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { title, excerpt, coverImage, content, publishedAt } = body
  const slug = slugify(title) + '-' + Date.now()
  const article = await prisma.article.create({
    data: { title, excerpt, coverImage, content: JSON.stringify(content), slug, publishedAt: publishedAt ? new Date(publishedAt) : new Date() }
  })
  return NextResponse.json({ article }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, title, excerpt, coverImage, content, publishedAt } = await request.json()
  const data: Record<string, unknown> = { title, excerpt, coverImage }
  if (content !== undefined) data.content = JSON.stringify(content)
  if (publishedAt) data.publishedAt = new Date(publishedAt)
  const article = await prisma.article.update({ where: { id }, data })
  return NextResponse.json({ article })
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.article.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
