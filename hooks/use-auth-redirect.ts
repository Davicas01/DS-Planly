'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { setCookie, getCookie } from 'cookies-next'

interface UserStatus {
  isAuthenticated: boolean
  isOnboardingComplete: boolean
  isProfileComplete: boolean
  lastLoginAt?: Date
  onboardingCompletedAt?: Date
}

export const useAuthRedirect = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isAuthenticated: false,
    isOnboardingComplete: false,
    isProfileComplete: false
  })

  // Função para verificar o status completo do usuário
  const checkUserStatus = async (): Promise<UserStatus> => {
    if (!user) {
      return {
        isAuthenticated: false,
        isOnboardingComplete: false,
        isProfileComplete: false
      }
    }

    // Verificar se o onboarding foi completado
    const onboardingCompleted = getCookie('planly_onboarding_completed') === 'true'
    const profileComplete = getCookie('planly_profile_complete') === 'true'
    
    // Verificar dados do usuário para determinar se o perfil está completo
    const hasBasicInfo = !!(user.displayName && user.email)
    const hasVerifiedEmail = user.emailVerified
    
    // Lógica para determinar se o perfil está completo
    const isProfileComplete = hasBasicInfo && hasVerifiedEmail && profileComplete

    const status: UserStatus = {
      isAuthenticated: true,
      isOnboardingComplete: onboardingCompleted,
      isProfileComplete: isProfileComplete,
      lastLoginAt: new Date()
    }

    return status
  }

  // Função para marcar onboarding como completo
  const completeOnboarding = () => {
    setCookie('planly_onboarding_completed', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    setCookie('planly_profile_complete', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    setUserStatus(prev => ({
      ...prev,
      isOnboardingComplete: true,
      isProfileComplete: true,
      onboardingCompletedAt: new Date()
    }))
  }

  // Função para determinar o redirecionamento correto
  const getRedirectPath = (status: UserStatus, requestedPath?: string): string => {
    if (!status.isAuthenticated) {
      return '/auth/login'
    }

    if (!status.isOnboardingComplete) {
      return '/onboarding'
    }

    if (!status.isProfileComplete) {
      return '/onboarding'
    }

    return requestedPath || '/dashboard'
  }

  // Função para realizar redirecionamento
  const redirectUser = (targetPath: string) => {
    if (typeof window !== 'undefined') {
      router.push(targetPath)
    }
  }

  // Efeito principal para verificar status e redirecionar
  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (loading) return // Ainda carregando

      const status = await checkUserStatus()
      setUserStatus(status)

      // Obter a URL atual
      const currentPath = window.location.pathname
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get('redirect')

      // Determinar o caminho correto
      const targetPath = getRedirectPath(status, redirectTo || undefined)

      // Redirecionar apenas se necessário
      if (currentPath !== targetPath) {
        // Casos específicos que precisam de redirecionamento
        const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verify-email']
        const isInPublicRoute = publicRoutes.includes(currentPath)
        const isInOnboarding = currentPath === '/onboarding'
        const isInDashboard = currentPath.startsWith('/dashboard')

        if (status.isAuthenticated) {
          if (isInPublicRoute) {
            // Usuário autenticado em rota pública
            redirectUser(targetPath)
          } else if (isInOnboarding && status.isOnboardingComplete) {
            // Usuário completo na página de onboarding
            redirectUser('/dashboard')
          } else if (isInDashboard && !status.isOnboardingComplete) {
            // Usuário incompleto tentando acessar dashboard
            redirectUser('/onboarding')
          }
        } else if (!isInPublicRoute) {
          // Usuário não autenticado em rota protegida
          const loginUrl = `/auth/login${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`
          redirectUser(loginUrl)
        }
      }
    }

    handleAuthRedirect()
  }, [user, loading, router])

  return {
    userStatus,
    completeOnboarding,
    redirectUser,
    getRedirectPath,
    checkUserStatus
  }
}

// Hook para verificar se o usuário deve ter acesso a uma rota
export const useRouteGuard = (requiredLevel: 'public' | 'authenticated' | 'onboarded' = 'public') => {
  const { userStatus } = useAuthRedirect()
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let access = false

    switch (requiredLevel) {
      case 'public':
        access = true
        break
      case 'authenticated':
        access = userStatus.isAuthenticated
        break
      case 'onboarded':
        access = userStatus.isAuthenticated && userStatus.isOnboardingComplete
        break
    }

    setHasAccess(access)
    setIsLoading(false)
  }, [userStatus, requiredLevel])

  return { hasAccess, isLoading }
}
