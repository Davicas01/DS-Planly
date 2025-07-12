import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getFirebaseAuth, isFirebaseInitialized } from '@/lib/firebaseClient'

/**
 * Determines if a user has completed onboarding based on multiple criteria
 * This handles existing users who might not have the onboarding cookie
 */
function hasCompletedOnboarding(cookieStore: any, currentUser: any): boolean {
  // Check if onboarding cookie is explicitly set
  const onboardingCookie = cookieStore.get('planly_onboarding_completed')
  if (onboardingCookie?.value === 'true') return true

  // Check if user is explicitly marked as incomplete (new users)
  const explicitlyIncomplete = cookieStore.get('planly_onboarding_incomplete')
  if (explicitlyIncomplete?.value === 'true') return false

  // For existing users without the incomplete flag, check if they have basic profile data
  if (currentUser && currentUser.displayName && currentUser.email && currentUser.emailVerified) {
    return true
  }

  return false
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('firebase-auth-token')
    
    if (!authToken?.value) {
      return NextResponse.json({ 
        authenticated: false, 
        onboardingCompleted: false,
        profileComplete: false,
        user: null 
      })
    }

    // Verify Firebase Auth
    if (!isFirebaseInitialized()) {
      return NextResponse.json({ 
        authenticated: false, 
        onboardingCompleted: false,
        profileComplete: false,
        user: null 
      })
    }

    const auth = getFirebaseAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      return NextResponse.json({ 
        authenticated: false, 
        onboardingCompleted: false,
        profileComplete: false,
        user: null 
      })
    }

    // Check if user profile is complete
    const profileComplete = Boolean(
      currentUser.displayName && 
      currentUser.email && 
      currentUser.emailVerified
    )

    // Check if onboarding is complete using improved logic
    const onboardingCompleted = hasCompletedOnboarding(cookieStore, currentUser)

    return NextResponse.json({
      authenticated: true,
      onboardingCompleted,
      profileComplete,
      user: {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        isOnboardingComplete: onboardingCompleted
      }
    })
  } catch (error) {
    console.error('Error checking auth status:', error)
    return NextResponse.json({ 
      authenticated: false, 
      onboardingCompleted: false,
      profileComplete: false,
      user: null 
    })
  }
}
