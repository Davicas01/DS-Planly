'use client'

import { useAuth } from '@/contexts/auth-context'
import { ReactNode } from 'react'

interface OnboardingGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * SIMPLIFIED Component that handles onboarding redirection logic
 * Middleware now handles most of the redirection logic to prevent conflicts
 */
export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  const { loading } = useAuth()
  
  // Show fallback while loading
  if (loading) {
    return <>{fallback}</>
  }

  // Let the middleware handle redirections
  // This component now just renders children
  return <>{children}</>
}

export default OnboardingGuard
