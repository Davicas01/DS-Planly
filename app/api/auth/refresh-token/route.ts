import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getFirebaseAuth, isFirebaseInitialized } from '@/lib/firebaseClient'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('firebase-auth-token')
    
    if (!authToken?.value) {
      return NextResponse.json({ 
        success: false, 
        message: 'No token found' 
      }, { status: 401 })
    }

    if (!isFirebaseInitialized()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Firebase not initialized' 
      }, { status: 500 })
    }

    const auth = getFirebaseAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not authenticated' 
      }, { status: 401 })
    }

    // Force refresh token
    const newToken = await currentUser.getIdToken(true)
    
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully'
    })

    response.cookies.set('firebase-auth-token', newToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error refreshing token:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Token refresh failed' 
    }, { status: 500 })
  }
}
