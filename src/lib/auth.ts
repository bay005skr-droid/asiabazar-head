import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'asiabazar-secret-key-change-in-production'
)
const COOKIE_NAME = 'ab_admin_session'

const ADMIN_USERS = [
  { password: 'bayer004code', name: 'admin' },
  { password: 'bayer005code', name: 'admin2' },
  { password: 'bayer006code', name: 'admin3' },
]

export async function signAdminToken(adminName: string): Promise<string> {
  return await new SignJWT({ role: 'admin', adminName })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function getAdminNameFromToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (payload.role !== 'admin') return null
    return (payload.adminName as string) || null
  } catch {
    return null
  }
}

/** Returns the admin name (buyer004 / buyer005 / buyer006) or null if not authed */
export async function getAdminName(): Promise<string | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return getAdminNameFromToken(token)
}

/** Returns the matching admin name if password is correct, null otherwise */
export async function checkAdminPassword(password: string): Promise<string | null> {
  const user = ADMIN_USERS.find((u) => u.password === password)
  return user ? user.name : null
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export function setAdminCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  return response
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

export async function adminMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return null
}
