import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('firebase-auth-token')
    
    if (!authToken?.value) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { preferences } = body

    // Set onboarding completed cookie
    const response = NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully'
    })

    response.cookies.set('planly_onboarding_completed', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    // Remove the incomplete flag
    response.cookies.set('planly_onboarding_incomplete', '', {
      maxAge: 0,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    // Store user preferences if needed
    if (preferences) {
      response.cookies.set('planly_user_preferences', JSON.stringify(preferences), {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
    }

    return response
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}
