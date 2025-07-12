import { AuthUser } from '@/hooks/use-firebase-auth-safe'
import { getCookie } from 'cookies-next'

export interface UserStatus {
  isAuthenticated: boolean
  isOnboardingComplete: boolean
  isProfileComplete: boolean
  shouldRedirectToOnboarding: boolean
  shouldRedirectToDashboard: boolean
  user: AuthUser | null
}

/**
 * Determines if a user has completed onboarding based on multiple criteria
 */
export function getUserOnboardingStatus(user: AuthUser | null): boolean {
  if (!user) return false

  // Check if onboarding cookie is set
  const onboardingCookie = getCookie('planly_onboarding_completed')
  if (onboardingCookie === 'true') return true

  // For existing users, check if they have key profile data
  // This handles the case where existing users don't have the onboarding cookie
  const hasBasicProfile = Boolean(
    user.displayName && 
    user.email && 
    user.emailVerified
  )

  // Check if user has onboarding data in localStorage (fallback)
  if (typeof window !== 'undefined') {
    const storedOnboarding = localStorage.getItem('planly_onboarding')
    if (storedOnboarding) {
      try {
        const onboardingData = JSON.parse(storedOnboarding)
        return Boolean(onboardingData.completedAt)
      } catch (e) {
        console.warn('Error parsing onboarding data:', e)
      }
    }
  }

  // If user has basic profile data, consider them as having completed onboarding
  // This is especially important for existing users who signed up before onboarding was implemented
  return hasBasicProfile
}

/**
 * Determines if a user's profile is complete
 */
export function getUserProfileStatus(user: AuthUser | null): boolean {
  if (!user) return false

  return Boolean(
    user.displayName && 
    user.email && 
    user.emailVerified
  )
}

/**
 * Gets comprehensive user status for routing decisions
 */
export function getUserStatus(user: AuthUser | null, loading: boolean = false): UserStatus {
  if (loading) {
    return {
      isAuthenticated: false,
      isOnboardingComplete: false,
      isProfileComplete: false,
      shouldRedirectToOnboarding: false,
      shouldRedirectToDashboard: false,
      user: null
    }
  }

  const isAuthenticated = Boolean(user)
  const isOnboardingComplete = getUserOnboardingStatus(user)
  const isProfileComplete = getUserProfileStatus(user)

  return {
    isAuthenticated,
    isOnboardingComplete,
    isProfileComplete,
    shouldRedirectToOnboarding: isAuthenticated && !isOnboardingComplete,
    shouldRedirectToDashboard: isAuthenticated && isOnboardingComplete,
    user
  }
}

/**
 * Marks onboarding as complete for a user
 */
export function markOnboardingComplete(preferences?: any): void {
  // Set the cookie
  if (typeof window !== 'undefined') {
    document.cookie = `planly_onboarding_completed=true; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${
      process.env.NODE_ENV === 'production' ? '; secure' : ''
    }`

    // Store preferences if provided
    if (preferences) {
      localStorage.setItem('planly_user_preferences', JSON.stringify(preferences))
    }

    // Update onboarding data in localStorage
    const onboardingData = {
      completedAt: new Date().toISOString(),
      preferences: preferences || {}
    }
    localStorage.setItem('planly_onboarding', JSON.stringify(onboardingData))
  }
}

/**
 * Clears onboarding status (for logout)
 */
export function clearOnboardingStatus(): void {
  if (typeof window !== 'undefined') {
    // Clear cookies
    document.cookie = 'planly_onboarding_completed=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'planly_user_preferences=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    // Clear localStorage
    localStorage.removeItem('planly_onboarding')
    localStorage.removeItem('planly_user_preferences')
  }
}
