'use client'

import { useAuth } from '@/contexts/auth-context'
import { useOnboardingStatus } from '@/hooks/use-onboarding-status'
import OnboardingDiagnostics from '@/components/debug/onboarding-diagnostics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { markOnboardingComplete, clearOnboardingStatus } from '@/lib/user-status'
import { useRouter } from 'next/navigation'
import { deleteCookie, setCookie } from 'cookies-next'

export default function OnboardingTestPage() {
  const { user, loading } = useAuth()
  const onboardingStatus = useOnboardingStatus()
  const router = useRouter()

  const handleMarkComplete = () => {
    markOnboardingComplete({ test: true })
    window.location.reload()
  }

  const handleClearStatus = () => {
    clearOnboardingStatus()
    deleteCookie('planly_onboarding_incomplete')
    window.location.reload()
  }

  const handleMarkIncomplete = () => {
    setCookie('planly_onboarding_incomplete', 'true', {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    deleteCookie('planly_onboarding_completed')
    window.location.reload()
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleGoToOnboarding = () => {
    router.push('/onboarding')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleMarkComplete} variant="default">
                Mark Onboarding Complete
              </Button>
              <Button onClick={handleMarkIncomplete} variant="outline">
                Mark Onboarding Incomplete
              </Button>
              <Button onClick={handleClearStatus} variant="destructive">
                Clear All Status
              </Button>
              <Button onClick={handleGoToDashboard} variant="secondary">
                Go to Dashboard
              </Button>
              <Button onClick={handleGoToOnboarding} variant="secondary">
                Go to Onboarding
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>User Authenticated:</strong> {user ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>User Email:</strong> {user?.email || 'N/A'}
              </div>
              <div>
                <strong>Display Name:</strong> {user?.displayName || 'N/A'}
              </div>
              <div>
                <strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Onboarding Complete:</strong> {onboardingStatus.isOnboardingComplete ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Profile Complete:</strong> {onboardingStatus.isProfileComplete ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Should → Dashboard:</strong> {onboardingStatus.shouldRedirectToDashboard ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Should → Onboarding:</strong> {onboardingStatus.shouldRedirectToOnboarding ? 'Yes' : 'No'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingDiagnostics />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
