import { NextRequest, NextResponse } from 'next/server'
import { checkAdminPassword, signAdminToken, setAdminCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }
    const adminName = await checkAdminPassword(password)
    if (!adminName) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }
    const token = await signAdminToken(adminName)
    const response = NextResponse.json({ success: true })
    return setAdminCookie(response, token)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
