import { NextRequest, NextResponse } from 'next/server'
import { adminMiddleware } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes except the login page itself
  if (
    (pathname === '/admin' || pathname.startsWith('/admin/')) &&
    !pathname.startsWith('/admin/login')
  ) {
    const redirect = await adminMiddleware(request)
    if (redirect) return redirect
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
