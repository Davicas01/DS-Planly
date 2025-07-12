'use client'

import { useAuth } from '@/contexts/auth-context'
import { getUserStatus } from '@/lib/user-status'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useOnboardingStatus = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState(getUserStatus(null, true))

  useEffect(() => {
    if (!loading) {
      const currentStatus = getUserStatus(user, loading)
      setStatus(currentStatus)
    }
  }, [user, loading])

  const redirectToAppropriateRoute = (currentPath: string = '/') => {
    if (status.isAuthenticated) {
      if (status.isOnboardingComplete) {
        if (currentPath === '/onboarding' || currentPath === '/auth/login' || currentPath === '/auth/signup') {
          router.push('/dashboard')
        }
      } else {
        if (currentPath !== '/onboarding' && !currentPath.startsWith('/auth/')) {
          router.push('/onboarding')
        }
      }
    } else {
      if (currentPath !== '/auth/login' && currentPath !== '/auth/signup' && currentPath !== '/') {
        router.push('/auth/login')
      }
    }
  }

  return {
    ...status,
    redirectToAppropriateRoute
  }
}
