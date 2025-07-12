'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

interface AuthStatus {
  authenticated: boolean
  onboardingCompleted: boolean
  profileComplete: boolean
  user: {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    emailVerified: boolean
  } | null
}

export const useAuthRedirect = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First check local storage for quick access
      const localStatus = localStorage.getItem('planly_auth_status')
      const localStatusTime = localStorage.getItem('planly_auth_status_time')
      
      // If we have recent local data (less than 5 minutes old), use it
      if (localStatus && localStatusTime) {
        const statusTime = parseInt(localStatusTime)
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        
        if (now - statusTime < fiveMinutes) {
          const parsedStatus = JSON.parse(localStatus)
          setAuthStatus(parsedStatus)
          setLoading(false)
          return parsedStatus
        }
      }
      
      // Check server status
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to check auth status')
      }
      
      const status = await response.json()
      setAuthStatus(status)
      
      // Cache the status locally
      localStorage.setItem('planly_auth_status', JSON.stringify(status))
      localStorage.setItem('planly_auth_status_time', Date.now().toString())
      
      return status
    } catch (error) {
      console.error('Error checking auth status:', error)
      setError('Failed to check authentication status')
      
      // Fallback to local checks
      const authToken = getCookie('firebase-auth-token')
      const onboardingCompleted = getCookie('planly_onboarding_completed')
      
      const fallbackStatus = {
        authenticated: Boolean(authToken),
        onboardingCompleted: Boolean(onboardingCompleted === 'true'),
        profileComplete: false,
        user: null
      }
      
      setAuthStatus(fallbackStatus)
      return fallbackStatus
    } finally {
      setLoading(false)
    }
  }, [])

  const redirectBasedOnAuth = useCallback(async (currentPath: string) => {
    const status = await checkAuthStatus()
    
    if (!status) return
    
    // Don't redirect if already on the correct path
    if (currentPath === '/dashboard' && status.authenticated && status.onboardingCompleted) {
      return
    }
    
    if (currentPath === '/onboarding' && status.authenticated && !status.onboardingCompleted) {
      return
    }
    
    if (currentPath.startsWith('/auth/') && !status.authenticated) {
      return
    }
    
    // Redirect logic
    if (status.authenticated && status.onboardingCompleted) {
      // User is fully set up, redirect to dashboard
      if (!currentPath.startsWith('/dashboard')) {
        router.push('/dashboard')
      }
    } else if (status.authenticated && !status.onboardingCompleted) {
      // User is authenticated but needs to complete onboarding
      if (currentPath !== '/onboarding') {
        router.push('/onboarding')
      }
    } else {
      // User is not authenticated, redirect to login
      if (!currentPath.startsWith('/auth/')) {
        router.push('/auth/login')
      }
    }
  }, [router, checkAuthStatus])

  const completeOnboarding = useCallback(async (preferences?: any) => {
    try {
      const response = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to complete onboarding')
      }
      
      // Update local state
      setCookie('planly_onboarding_completed', 'true', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/'
      })
      
      // Clear cached status to force refresh
      localStorage.removeItem('planly_auth_status')
      localStorage.removeItem('planly_auth_status_time')
      
      // Refresh auth status
      await checkAuthStatus()
      
      // Redirect to dashboard
      router.push('/dashboard')
      
      return true
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setError('Failed to complete onboarding')
      return false
    }
  }, [router, checkAuthStatus])

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }
      
      // Clear cached status to force refresh
      localStorage.removeItem('planly_auth_status')
      localStorage.removeItem('planly_auth_status_time')
      
      // Refresh auth status
      await checkAuthStatus()
      
      return true
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
  }, [checkAuthStatus])

  const clearAuthData = useCallback(() => {
    // Clear cookies
    deleteCookie('firebase-auth-token')
    deleteCookie('planly_onboarding_completed')
    deleteCookie('planly_user_preferences')
    
    // Clear local storage
    localStorage.removeItem('planly_auth_status')
    localStorage.removeItem('planly_auth_status_time')
    
    // Reset state
    setAuthStatus({
      authenticated: false,
      onboardingCompleted: false,
      profileComplete: false,
      user: null
    })
  }, [])

  // Initialize auth status check
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'planly_auth_status') {
        checkAuthStatus()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkAuthStatus])

  return {
    authStatus,
    loading,
    error,
    checkAuthStatus,
    redirectBasedOnAuth,
    completeOnboarding,
    refreshToken,
    clearAuthData
  }
}
