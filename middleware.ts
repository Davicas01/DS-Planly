import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/verify-email'
]

// Rotas protegidas que precisam de autenticação
const protectedRoutes = [
  '/dashboard',
  '/habits',
  '/finance',
  '/health',
  '/chat',
  '/onboarding'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se o usuário está autenticado através do token Firebase
  const firebaseToken = request.cookies.get('firebase-auth-token')?.value
  const isAuthenticated = !!firebaseToken
  
  // Verificar se o usuário completou o onboarding
  const onboardingCompleted = request.cookies.get('planly_onboarding_completed')?.value === 'true'
  
  // Se está em uma rota pública e está autenticado, redirecionar para dashboard
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Se está em uma rota protegida e não está autenticado, redirecionar para login
  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Se está autenticado mas não completou o onboarding, redirecionar para onboarding
  // (exceto se já estiver na página de onboarding)
  if (isAuthenticated && !onboardingCompleted && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }
  
  // Se completou o onboarding mas está tentando acessar a página de onboarding, redirecionar para dashboard
  if (isAuthenticated && onboardingCompleted && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
