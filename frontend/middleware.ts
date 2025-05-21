import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 这些路由需要登录才能访问
const protectedRoutes = [
  '/assistant',
  '/profile',
  '/watch-data',
  '/field-analysis',
  '/heatmap',
  '/training-recommendations',
  '/training-logs',
]

// 这些路由不需要登录也能访问
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
]

export function middleware(request: NextRequest) {
  // 获取当前路径
  const { pathname } = request.nextUrl
  
  // 检查用户是否已登录（通过cookie）
  const isAuthenticated = request.cookies.has('userId')
  
  console.log(`Visiting: ${pathname}, Authenticated: ${isAuthenticated}`)
  
  // 如果访问的是受保护的路由且未登录，重定向到登录页面
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    console.log('Unauthorized access, redirecting to login page')
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  // 如果访问的是登录或注册页面且已登录，重定向到首页
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && isAuthenticated) {
    console.log('User is logged in, redirecting to home page')
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// 配置匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，但排除以下情况:
     * - 以 /api 开头的路径
     * - 以 /_next/static 开头的路径
     * - 以 /_next/image 开头的路径
     * - 以 /favicon.ico 结尾的路径
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 