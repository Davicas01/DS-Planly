import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não precisam de autenticação (rotas exatas)
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/verify-email',
  '/offline',
  '/debug-env',
  '/onboarding-test'
]

// Rotas que precisam de autenticação mas não são dashboard
const protectedRoutes = [
  '/habits',
  '/finance',
  '/health',
  '/chat'
]

/**
 * Determines if a user has completed onboarding based on multiple criteria
 * This is important for existing users who might not have the onboarding cookie
 */
function hasCompletedOnboarding(request: NextRequest): boolean {
  // Check if onboarding cookie is explicitly set
  const onboardingCookie = request.cookies.get('planly_onboarding_completed')?.value
  if (onboardingCookie === 'true') return true

  // Check if user is explicitly marked as incomplete (new users)
  const explicitlyIncomplete = request.cookies.get('planly_onboarding_incomplete')?.value
  if (explicitlyIncomplete === 'true') return false

  // For existing users, check if they have authentication token
  const firebaseToken = request.cookies.get('firebase-auth-token')?.value
  const userPreferences = request.cookies.get('planly_user_preferences')?.value
  
  // If user has auth token and preferences, they're likely an existing user
  if (firebaseToken && userPreferences) {
    return true
  }

  // If user has been authenticated, assume they've completed onboarding
  // unless explicitly marked as incomplete
  if (firebaseToken) {
    return true
  }

  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|json|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }
  
  // Log para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${pathname}`)
  }
  
  try {
    // Verificar se o usuário está autenticado através do token Firebase
    const firebaseToken = request.cookies.get('firebase-auth-token')?.value
    const isAuthenticated = !!firebaseToken
    
    // Verificar se o usuário completou o onboarding
    const onboardingCompleted = hasCompletedOnboarding(request)
    
    // 🔥 CORREÇÃO PRINCIPAL: Verificar se é uma rota pública EXATA
    const isExactPublicRoute = publicRoutes.includes(pathname)
    
    // 🔥 CORREÇÃO PRINCIPAL: Verificar se é uma rota do dashboard (permitir TODAS as sub-rotas)
    const isDashboardRoute = pathname.startsWith('/dashboard')
    
    // 🔥 CORREÇÃO PRINCIPAL: Verificar se é uma rota protegida não-dashboard
    const isOtherProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    // 🔥 CORREÇÃO PRINCIPAL: Verificar se é rota de onboarding
    const isOnboardingRoute = pathname === '/onboarding'
    
    // 🔥 CORREÇÃO PRINCIPAL: Verificar se é rota de auth
    const isAuthRoute = pathname.startsWith('/auth/')
    
    // === LÓGICA DE REDIRECIONAMENTO CORRIGIDA ===
    
    // 1. Usuário não autenticado tentando acessar rotas protegidas
    if (!isAuthenticated && (isDashboardRoute || isOtherProtectedRoute || isOnboardingRoute)) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log(`[Middleware] Redirecting unauthenticated user to login`)
      return NextResponse.redirect(loginUrl)
    }
    
    // 2. Usuário autenticado em rota pública EXATA (exceto páginas de auth para logout)
    if (isAuthenticated && isExactPublicRoute && !isAuthRoute) {
      if (onboardingCompleted) {
        console.log(`[Middleware] Redirecting authenticated user to dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        console.log(`[Middleware] Redirecting authenticated user to onboarding`)
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
    
    // 3. Usuário autenticado, onboarding incompleto, mas não está na página de onboarding
    if (isAuthenticated && !onboardingCompleted && !isOnboardingRoute && !isAuthRoute) {
      // Só redireciona se foi explicitamente marcado como incompleto
      const explicitlyIncomplete = request.cookies.get('planly_onboarding_incomplete')?.value === 'true'
      if (explicitlyIncomplete) {
        console.log(`[Middleware] Redirecting user with incomplete onboarding`)
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
    
    // 4. Usuário autenticado, onboarding completo, mas está na página de onboarding
    if (isAuthenticated && onboardingCompleted && isOnboardingRoute) {
      console.log(`[Middleware] Redirecting completed user away from onboarding`)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // 5. Usuário autenticado, onboarding completo, em página de auth (exceto logout)
    if (isAuthenticated && onboardingCompleted && isAuthRoute && !pathname.includes('logout')) {
      console.log(`[Middleware] Redirecting completed user away from auth`)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // 🔥 CORREÇÃO PRINCIPAL: Permitir todas as rotas do dashboard sem redirecionamento
    if (isAuthenticated && isDashboardRoute) {
      console.log(`[Middleware] Allowing access to dashboard route: ${pathname}`)
      return NextResponse.next()
    }
    
    // Criar response normal para todas as outras situações
    const response = NextResponse.next()
    
    // Headers de debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('x-debug-path', pathname)
      response.headers.set('x-debug-timestamp', new Date().toISOString())
      response.headers.set('x-authenticated', isAuthenticated.toString())
      response.headers.set('x-onboarding-completed', onboardingCompleted.toString())
    }
    
    return response
  } catch (error) {
    // Em caso de erro, log e continuar
    console.error('[Middleware Error]:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
