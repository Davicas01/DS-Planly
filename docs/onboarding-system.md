# Onboarding System Documentation

## Overview
The new onboarding system addresses the issue where existing users were being forced through onboarding again. It implements intelligent user status detection and appropriate redirection logic.

## Key Features

### 1. Smart Onboarding Detection
- **Existing Users**: Users with complete profiles are considered as having completed onboarding
- **New Users**: Explicitly marked as incomplete until they complete the flow
- **Fallback Logic**: Multiple checks ensure proper state detection

### 2. User Status Logic
The system determines user status based on:
- `planly_onboarding_completed` cookie (explicit completion)
- `planly_onboarding_incomplete` cookie (explicit incomplete state for new users)
- User profile completeness (displayName, email, emailVerified)
- LocalStorage data (fallback)

### 3. Redirection Logic
- **Authenticated + Onboarding Complete** → Dashboard
- **Authenticated + Onboarding Incomplete** → Onboarding
- **Not Authenticated** → Login page

## File Structure

### Core Files
```
lib/
├── user-status.ts                 # Core logic for user status determination
hooks/
├── use-onboarding-status.ts      # React hook for onboarding status
├── use-firebase-auth-safe.ts     # Updated with onboarding logic
components/
├── auth/
│   ├── onboarding-guard.tsx      # Component that handles auto-redirection
│   └── auth-guard.tsx            # Existing auth guard
├── debug/
│   └── onboarding-diagnostics.tsx # Debug component
app/
├── api/auth/
│   ├── status/route.ts           # Updated API endpoint
│   └── complete-onboarding/route.ts # Updated completion endpoint
├── auth/login/page.tsx           # Updated login page
├── onboarding/page.tsx           # Updated onboarding page
└── onboarding-test/page.tsx      # Test page for debugging
middleware.ts                     # Updated middleware logic
```

### Key Components

#### 1. `lib/user-status.ts`
Core utility functions:
- `getUserOnboardingStatus()` - Determines if user completed onboarding
- `getUserProfileStatus()` - Checks if profile is complete
- `getUserStatus()` - Comprehensive status check
- `markOnboardingComplete()` - Marks completion
- `clearOnboardingStatus()` - Clears all status

#### 2. `hooks/use-onboarding-status.ts`
React hook that:
- Provides current user status
- Handles smart redirection
- Updates reactively to auth changes

#### 3. `components/auth/onboarding-guard.tsx`
Auto-redirection component:
- Monitors path and user status
- Redirects automatically when needed
- Prevents unwanted onboarding loops

#### 4. `middleware.ts`
Server-side logic:
- Handles auth verification
- Implements smart onboarding detection
- Redirects based on user status

## How It Works

### For Existing Users
1. User logs in
2. System checks for onboarding cookie
3. If not found, checks profile completeness
4. If profile complete → considers onboarding complete
5. Redirects to dashboard

### For New Users
1. User signs up
2. System sets `planly_onboarding_incomplete` cookie
3. Redirects to onboarding
4. After completion, removes incomplete cookie and sets complete cookie
5. Redirects to dashboard

### State Management
```typescript
// User states
interface UserStatus {
  isAuthenticated: boolean
  isOnboardingComplete: boolean
  isProfileComplete: boolean
  shouldRedirectToOnboarding: boolean
  shouldRedirectToDashboard: boolean
  user: AuthUser | null
}
```

## Usage Examples

### Basic Usage
```typescript
import { useOnboardingStatus } from '@/hooks/use-onboarding-status'

function MyComponent() {
  const { 
    isAuthenticated, 
    isOnboardingComplete, 
    redirectToAppropriateRoute 
  } = useOnboardingStatus()

  // Auto-redirect when needed
  redirectToAppropriateRoute('/current-path')
}
```

### Manual Status Check
```typescript
import { getUserStatus } from '@/lib/user-status'

const status = getUserStatus(user, loading)
if (status.shouldRedirectToDashboard) {
  router.push('/dashboard')
}
```

### Marking Onboarding Complete
```typescript
import { markOnboardingComplete } from '@/lib/user-status'

// After onboarding completion
markOnboardingComplete(userPreferences)
```

## Testing & Debugging

### Test Page
Visit `/onboarding-test` to:
- View current status
- Manually change onboarding state
- Debug redirection logic
- See detailed diagnostics

### Debug Component
```typescript
import OnboardingDiagnostics from '@/components/debug/onboarding-diagnostics'

// Shows all cookies, localStorage, and status
<OnboardingDiagnostics />
```

### Manual Testing
1. **Existing User Flow**:
   - Login with existing account
   - Should go directly to dashboard
   - Should not see onboarding

2. **New User Flow**:
   - Sign up new account
   - Should go to onboarding
   - Complete onboarding
   - Should go to dashboard

3. **Edge Cases**:
   - Clear cookies and localStorage
   - Login again
   - Should still detect as existing user

## Configuration

### Environment Variables
```env
NODE_ENV=production  # Affects cookie security
```

### Cookie Configuration
```typescript
{
  maxAge: 60 * 60 * 24 * 365, // 1 year
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
}
```

## Migration Guide

### From Old System
1. No database changes needed
2. Existing users will be automatically detected
3. New users will go through proper onboarding
4. All existing cookies remain valid

### Troubleshooting
1. **User stuck in onboarding loop**:
   - Check if `planly_onboarding_incomplete` cookie is set
   - Verify user profile completeness
   - Use debug component to diagnose

2. **Existing user forced to onboarding**:
   - Check profile completeness
   - Verify auth token validity
   - Clear and reset cookies if needed

3. **Redirections not working**:
   - Check middleware configuration
   - Verify route protection
   - Test OnboardingGuard component

## API Endpoints

### GET `/api/auth/status`
Returns comprehensive user status:
```json
{
  "authenticated": true,
  "onboardingCompleted": true,
  "profileComplete": true,
  "user": {
    "uid": "...",
    "email": "...",
    "displayName": "...",
    "emailVerified": true,
    "isOnboardingComplete": true
  }
}
```

### POST `/api/auth/complete-onboarding`
Marks onboarding as complete:
```json
{
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

## Security Considerations

1. **Cookie Security**: Secure cookies in production
2. **Token Validation**: Always verify auth tokens
3. **State Consistency**: Multiple checks prevent bypassing
4. **Data Persistence**: LocalStorage as fallback only

## Performance Optimizations

1. **Lazy Loading**: Components load only when needed
2. **Memo Hooks**: Prevent unnecessary re-renders
3. **Efficient Checks**: Fast cookie/localStorage reads
4. **Minimal API Calls**: Client-side state management

## Future Enhancements

1. **Database Integration**: Store onboarding status in database
2. **Multi-step Onboarding**: Progressive disclosure
3. **Personalization**: Adaptive onboarding based on user type
4. **Analytics**: Track onboarding completion rates
5. **A/B Testing**: Different onboarding flows

## Support

For issues or questions:
1. Check the debug component first
2. Review middleware logs
3. Test with the onboarding test page
4. Verify cookie and localStorage state
