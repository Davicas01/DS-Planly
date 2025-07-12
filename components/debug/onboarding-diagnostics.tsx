'use client'

import { useAuth } from '@/contexts/auth-context'
import { useOnboardingStatus } from '@/hooks/use-onboarding-status'
import { getCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

interface OnboardingDiagnostics {
  authCookie: string | null
  onboardingCookie: string | null
  incompleteCookie: string | null
  preferenceCookie: string | null
  localStorageOnboarding: any
  localStoragePreferences: any
  userAuth: any
  onboardingStatus: any
}

export const OnboardingDiagnostics: React.FC = () => {
  const { user, loading } = useAuth()
  const onboardingStatus = useOnboardingStatus()
  const [diagnostics, setDiagnostics] = useState<OnboardingDiagnostics | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDiagnostics({
        authCookie: getCookie('firebase-auth-token') || null,
        onboardingCookie: getCookie('planly_onboarding_completed') || null,
        incompleteCookie: getCookie('planly_onboarding_incomplete') || null,
        preferenceCookie: getCookie('planly_user_preferences') || null,
        localStorageOnboarding: localStorage.getItem('planly_onboarding') 
          ? JSON.parse(localStorage.getItem('planly_onboarding')!) 
          : null,
        localStoragePreferences: localStorage.getItem('planly_user_preferences') 
          ? JSON.parse(localStorage.getItem('planly_user_preferences')!) 
          : null,
        userAuth: user,
        onboardingStatus: onboardingStatus
      })
    }
  }, [user, onboardingStatus])

  if (loading) {
    return <div>Loading diagnostics...</div>
  }

  if (!diagnostics) {
    return <div>Diagnostics not available</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-4">Onboarding Diagnostics</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Auth Cookie:</strong> {diagnostics.authCookie ? 'Present' : 'Not present'}
        </div>
        <div>
          <strong>Onboarding Cookie:</strong> {diagnostics.onboardingCookie || 'Not set'}
        </div>
        <div>
          <strong>Incomplete Cookie:</strong> {diagnostics.incompleteCookie || 'Not set'}
        </div>
        <div>
          <strong>Preference Cookie:</strong> {diagnostics.preferenceCookie ? 'Present' : 'Not present'}
        </div>
        <div>
          <strong>User Authenticated:</strong> {diagnostics.userAuth ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>User Email:</strong> {diagnostics.userAuth?.email || 'N/A'}
        </div>
        <div>
          <strong>User Display Name:</strong> {diagnostics.userAuth?.displayName || 'N/A'}
        </div>
        <div>
          <strong>Email Verified:</strong> {diagnostics.userAuth?.emailVerified ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Onboarding Complete (Status):</strong> {diagnostics.onboardingStatus.isOnboardingComplete ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Should Redirect to Dashboard:</strong> {diagnostics.onboardingStatus.shouldRedirectToDashboard ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Should Redirect to Onboarding:</strong> {diagnostics.onboardingStatus.shouldRedirectToOnboarding ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>LocalStorage Onboarding:</strong> {diagnostics.localStorageOnboarding ? 'Present' : 'Not present'}
        </div>
        {diagnostics.localStorageOnboarding && (
          <div className="ml-4">
            <strong>Completed At:</strong> {diagnostics.localStorageOnboarding.completedAt || 'Not set'}
          </div>
        )}
      </div>
    </div>
  )
}

export default OnboardingDiagnostics
