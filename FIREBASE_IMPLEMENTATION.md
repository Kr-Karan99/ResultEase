# Firebase Authentication - Implementation Guide & Examples

## 🎯 Quick Reference

### Import Statements

```typescript
// Use auth context in any component
import { useAuth } from '@/context/AuthContext'

// Use route protection
import { useProtectedRoute, usePublicOnlyRoute } from '@/lib/hooks/useProtectedRoute'

// Access Firebase directly
import { auth } from '@/lib/firebase'

// Use Firebase service
import { firebaseAuthService } from '@/infrastructure/firebase/FirebaseAuthService'
```

---

## 💻 Code Examples

### Example 1: Display User Info

```typescript
'use client'

import { useAuth } from '@/context/AuthContext'

export function UserProfile() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading user info...</div>
  
  if (!user) return <div>Not signed in</div>

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt={user.name} 
          className="rounded-full w-16 h-16"
        />
      )}
    </div>
  )
}
```

### Example 2: Conditional Rendering Based on Auth

```typescript
'use client'

import { useAuth } from '@/context/AuthContext'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'

export function Header() {
  const { user, loading } = useAuth()

  return (
    <header>
      <nav>
        <h1>My App</h1>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <span>Hello, {user.name}!</span>
        ) : (
          <GoogleAuthButton />
        )}
      </nav>
    </header>
  )
}
```

### Example 3: Protect a Route

```typescript
'use client'

import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

export default function SecretPage() {
  // Automatically redirects to /marketing if not authenticated
  useProtectedRoute()

  return <h1>This page is only for authenticated users</h1>
}
```

### Example 4: Redirect Authenticated Users Away

```typescript
'use client'

import { usePublicOnlyRoute } from '@/lib/hooks/useProtectedRoute'

export default function LoginPage() {
  // Automatically redirects to /dashboard if already authenticated
  usePublicOnlyRoute()

  return <h1>Sign in to your account</h1>
}
```

### Example 5: Manual Sign-In/Sign-Out

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export function AuthControls() {
  const { user, loading, loginWithGoogle, logout } = useAuth()
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    try {
      setError('')
      await loginWithGoogle()
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    }
  }

  const handleSignOut = async () => {
    try {
      setError('')
      await logout()
    } catch (err) {
      setError('Failed to sign out. Please try again.')
    }
  }

  if (loading) return <div>Checking authentication...</div>

  return (
    <div>
      {user ? (
        <>
          <p>Signed in as {user.name}</p>
          <button onClick={handleSignOut} disabled={loading}>
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={handleSignIn} disabled={loading}>
            Sign In with Google
          </button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
```

### Example 6: Custom Firebase Service Usage

```typescript
import { firebaseAuthService } from '@/infrastructure/firebase/FirebaseAuthService'

// Sign out directly
await firebaseAuthService.signOut()

// Check if user is authenticated
const isAuthenticated = await firebaseAuthService.isAuthenticated()

// Get current user
const user = await firebaseAuthService.getCurrentUser()

// Refresh token
const tokenResult = await firebaseAuthService.refreshToken()
```

### Example 7: Access Firebase Auth Instance

```typescript
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Listen to auth changes directly (Advanced)
const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    console.log('User logged in:', firebaseUser.uid)
  } else {
    console.log('User logged out')
  }
})

// Cleanup listener
return () => unsubscribe()
```

---

## 🚨 Troubleshooting

### Problem: Components Showing "Module not found"

**Cause**: TypeScript path aliases not resolved

**Solution**:
```bash
# Clear Next.js cache and rebuild
rm -r .next
npm run dev
```

---

### Problem: Auth context returns `undefined`

**Cause**: Component not wrapped with `AuthProvider`

**Solution**: Make sure `app/layout.tsx` has:
```typescript
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

---

### Problem: useAuth hook throws error: "useAuth must be used within AuthProvider"

**Cause**: Using `useAuth()` in a component that's not wrapped with AuthProvider

**Solution**: 
- Mark component with `'use client'` at the top
- Make sure it's rendered inside AuthProvider (which is in root layout)

---

### Problem: Google Sign-In popup doesn't open

**Cause**: 
1. Popup blocker enabled
2. Domain not authorized in Firebase
3. Firebase not properly configured

**Solution**:
1. Disable popup blocker for localhost
2. Add domain to Firebase → Authentication → Settings → Authorized domains
3. Check `.env.local` has correct values

**Debug**: Check browser console for error messages

---

### Problem: User stays logged in after browser restart

**Expected Behavior**: This is correct! Firebase persistence keeps user logged in.

**If you don't want this**: Modify `FirebaseAuthService.ts`:
```typescript
// Comment out or remove:
// await setPersistence(auth, browserLocalPersistence)
```

**To clear user session**: Clear browser localStorage and cookies, or users can manually sign out.

---

### Problem: Profile picture not showing

**Cause**: Google account doesn't have a profile picture

**Expected**: Fallback to user initials shows instead (working as designed)

---

### Problem: "NEXT_PUBLIC_FIREBASE_API_KEY is not defined"

**Cause**: `.env.local` file missing or not loaded

**Solution**:
1. Create `.env.local` (copy from `.env.local.example`)
2. Add Firebase credentials
3. Restart dev server: `npm run dev`

---

### Problem: TypeScript error: "Property 'photoURL' does not exist on type 'User'"

**Cause**: User interface not updated

**Solution**: Make sure `application/ports/AuthPort.ts` has:
```typescript
export interface User {
  id: string
  email: string
  name: string
  photoURL?: string  // This line should exist
  role: 'teacher' | 'admin'
  institution?: string
  createdAt: Date
  lastLoginAt?: Date
}
```

---

### Problem: "Error: Permission denied in Firestore"

**Cause**: Not a sign-in issue, but Firestore rules issue (when you add Firestore later)

**Solution**: Update Firestore rules in Firebase Console → Firestore → Rules

---

## 🔍 Debug Mode

### Enable Detailed Logging

Add to your component or middleware:

```typescript
import { enableDebugErrorMap } from 'firebase/auth'

// Enable Firebase auth error debugging
if (process.env.NODE_ENV === 'development') {
  enableDebugErrorMap()
}
```

### Check Auth State in Browser Console

```javascript
// In browser console while app is running:
firebase.auth().onAuthStateChanged(user => {
  console.log('Current user:', user)
})
```

---

## 🧪 Testing Checklist

Before deploying, test:

- [ ] Google Sign-In button appears on landing page
- [ ] Clicking button opens Google Sign-In popup
- [ ] Can sign in with Google account
- [ ] User redirected to dashboard after sign-in
- [ ] Profile picture shows in header
- [ ] User name appears in avatar
- [ ] Clicking avatar shows dropdown menu
- [ ] Dropdown shows user email
- [ ] Logout button signs user out
- [ ] User redirected to landing page after logout
- [ ] Protected routes redirect to landing page if not signed in
- [ ] Protected routes accessible after sign-in
- [ ] User stays logged in after page refresh
- [ ] User stays logged in after browser restart
- [ ] Works on mobile (responsive avatar)
- [ ] Error messages display if sign-in fails
- [ ] No errors in browser console

---

## 🚀 Deployment Checklist

### Before Deploying to Production

1. **Add production domain to Firebase**
   ```
   Firebase Console → Authentication → Settings → Authorized domains
   Add: your-domain.com
   ```

2. **Set environment variables on hosting platform**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables

3. **Test on staging environment**
   - Deploy to staging URL
   - Test Google Sign-In flow
   - Test user data persistence

4. **Review Firebase security rules** (for future features)
   - Ensure only authenticated users can access data
   - Restrict data access by user ID

5. **Monitor Firebase usage**
   - Firebase Console → Authentication → Users
   - Check daily active users
   - Monitor failed sign-in attempts

6. **Set up error tracking** (optional)
   - Add Sentry, LogRocket, or similar
   - Monitor auth-related errors in production

---

## 📚 File Structure Deep Dive

### `lib/firebase.ts`
- Initializes Firebase app
- Exports auth, db, storage instances
- Handles Firebase emulator connection (if enabled)
- Ensures single Firebase instance (no duplicates)

### `infrastructure/firebase/FirebaseAuthService.ts`
- Implements `AuthPort` interface
- Handles Google OAuth flow
- Maps Firebase user to app User model
- Converts error codes to user-friendly messages
- Handles token refresh and persistence

### `context/AuthContext.tsx`
- Manages global auth state
- Listens to Firebase auth changes
- Provides `useAuth()` hook
- Exposes `loginWithGoogle()` and `logout()` methods
- Handles loading states

### `components/auth/GoogleAuthButton.tsx`
- Reusable sign-in button component
- Shows loading spinner during auth
- Displays error messages
- Multiple style variants

### `components/auth/UserAvatar.tsx`
- Displays user profile picture
- Shows fallback initials
- Dropdown menu for logout
- Closes dropdown on outside click

### `middleware.ts`
- Placeholder for future route protection enhancements
- Currently uses client-side route guards via hooks
- Can be extended for backend verification

---

## 🔐 Security Best Practices

1. **Never expose sensitive keys in code**
   - Always use environment variables
   - Keep `.env.local` in `.gitignore`

2. **Use HTTPS in production**
   - Firebase automatically enforces this
   - Don't use HTTP for production URLs

3. **Implement CSRF protection** (if building API)
   - Use Next.js built-in CSRF protection
   - Validate origin headers

4. **Rate limit sign-in attempts** (future)
   - Can be implemented with Firebase Auth emulator
   - Or custom backend API

5. **Use secure session storage**
   - Firebase uses secure browser storage
   - Don't store tokens in localStorage manually

6. **Validate user permissions on backend** (future)
   - When adding Firestore/APIs
   - Verify user ID from Firebase auth

---

## 📖 Learn More

- [Firebase Web Docs](https://firebase.google.com/docs/web)
- [Firebase Auth Best Practices](https://firebase.google.com/docs/auth/where-to-start)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/useContext)

---

Generated: December 29, 2025
Last Updated: Implementation Complete
