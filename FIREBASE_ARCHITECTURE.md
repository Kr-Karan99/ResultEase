# Firebase Auth - Architecture & Patterns

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App (App Router)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Root Layout (app/layout.tsx)             │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │  <AuthProvider>                                   │ │   │
│  │  │    ┌────────────────────────────────────────────┐ │ │   │
│  │  │    │         Page Components                     │ │ │   │
│  │  │    │  • useAuth() hook available everywhere     │ │ │   │
│  │  │    │  • useProtectedRoute() on private routes   │ │ │   │
│  │  │    └────────────────────────────────────────────┘ │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    AuthProvider (Context)                    │
│  • Manages user state                                        │
│  • Listens to Firebase auth changes                          │
│  • Provides login/logout functions                           │
│  • Exposes useAuth() hook                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FirebaseAuthService (Infrastructure)            │
│  • Implements AuthPort interface                             │
│  • Handles Google OAuth                                      │
│  • Maps Firebase user to app User model                      │
│  • Token management & error handling                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Firebase SDK (v9+)                         │
│  • auth - Authentication service                             │
│  • db - Firestore (for future use)                          │
│  • storage - Storage (for future use)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

### Sign-In / Sign-Up Flow

```
User on Landing Page
        ↓
Click "Continue with Google"
        ↓
GoogleAuthButton.onClick()
        ↓
useAuth().loginWithGoogle()
        ↓
FirebaseAuthService.signIn()
        ↓
signInWithPopup(auth, googleProvider)
        ↓
[Google Sign-In Popup]
User enters Google credentials
        ↓
Google returns user data
        ↓
Firebase creates/logs in user
        ↓
onAuthStateChanged listener fires
        ↓
AuthContext updates with user data
        ↓
useProtectedRoute() allows access
        ↓
User redirected to /dashboard
        ↓
Avatar shows in Header
```

---

## 🎯 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 Google OAuth Provider                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [Sign-In Popup]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Auth                             │
│  • Authenticates user                                        │
│  • Returns access token                                      │
│  • Returns user data (uid, email, displayName, photoURL)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FirebaseAuthService                             │
│  • Maps Firebase User → App User                             │
│  • Stores token                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  AuthContext                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ user: User | null                                    │   │
│  │ loading: boolean                                     │   │
│  │ firebaseUser: FirebaseUser | null                   │   │
│  │ loginWithGoogle: () => Promise<void>                │   │
│  │ logout: () => Promise<void>                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    useAuth() Hook
                            ↓
         Available in all child components
```

---

## 📦 Component Dependencies

```
app/layout.tsx (Root)
    ↓
    ├─ <AuthProvider>
    │   ├─ app/(marketing)/page.tsx
    │   │   └─ <GoogleAuthButton />
    │   │       └─ useAuth()
    │   │
    │   ├─ components/layout/Header.tsx
    │   │   ├─ <GoogleAuthButton />
    │   │   └─ <UserAvatar />
    │   │       └─ useAuth()
    │   │
    │   ├─ app/dashboard/page.tsx
    │   │   └─ useProtectedRoute()
    │   │       └─ useAuth()
    │   │
    │   ├─ app/upload/page.tsx
    │   │   └─ useProtectedRoute()
    │   │
    │   └─ app/reports/[id]/page.tsx
    │       └─ useProtectedRoute()
    │
    └─ middleware.ts (Optional route guard)
```

---

## 🎭 State Management Pattern

### Local Component State
```typescript
const [selectedFile, setSelectedFile] = useState(null)
const [formData, setFormData] = useState({})
```

### Global Auth State
```typescript
const { user, loading, loginWithGoogle, logout } = useAuth()
```

### Pattern: Where to Store What
| State Type | Storage | Scope |
|-----------|---------|-------|
| User auth info | AuthContext | Global (entire app) |
| Loading state | AuthContext | Global |
| Form inputs | useState | Component |
| UI toggles | useState | Component |
| Navigation state | useRouter | Next.js |
| Report data | useState + API | Page level |

---

## 🔐 Security Patterns

### 1. Protected Route Pattern

```typescript
'use client'

import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

export default function SecretPage() {
  // This hook checks auth and redirects if needed
  useProtectedRoute()
  
  // If we reach here, user is authenticated
  return <SecretContent />
}
```

### 2. Conditional Rendering Pattern

```typescript
'use client'

import { useAuth } from '@/context/AuthContext'

export function Header() {
  const { user, loading } = useAuth()
  
  if (loading) return <Spinner />
  
  return (
    <header>
      {user ? <UserAvatar /> : <GoogleAuthButton />}
    </header>
  )
}
```

### 3. Error Handling Pattern

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export function LoginForm() {
  const { loginWithGoogle } = useAuth()
  const [error, setError] = useState('')
  
  const handleLogin = async () => {
    try {
      setError('')
      await loginWithGoogle()
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    }
  }
  
  return (
    <>
      <button onClick={handleLogin}>Sign In</button>
      {error && <div className="text-red-600">{error}</div>}
    </>
  )
}
```

---

## 📊 User Flow

### First Time Visitor
```
Landing Page (/marketing)
    ↓
Sees "Continue with Google" button
    ↓
Clicks button → Google Sign-In
    ↓
Google Account → Creates Firebase account
    ↓
Redirected to /dashboard
    ↓
Profile picture shows
    ↓
Can access upload, reports, etc.
```

### Returning Visitor
```
Landing Page (/marketing)
    ↓
AuthContext loads
    ↓
Firebase persistence recognizes user
    ↓
Auto-redirects to /dashboard (can be added)
    ↓
OR shows "You're signed in as [Name]"
```

### Sign Out
```
Click Avatar → Sign Out
    ↓
logout() called
    ↓
Firebase clears session
    ↓
AuthContext updates (user = null)
    ↓
Redirects to /marketing
    ↓
Avatar disappears
    ↓
Sign-In button reappears
```

---

## 🎨 UI Component Hierarchy

```
Header
├─ Logo
├─ Navigation Menu (md+)
│  ├─ Home
│  ├─ Dashboard
│  ├─ Upload
│  └─ Reports
├─ Actions (Desktop)
│  └─ if !user: GoogleAuthButton
│  └─ if user: UserAvatar
└─ Mobile Menu
   └─ Mobile Navigation
   └─ if !user: GoogleAuthButton
   └─ if user: UserAvatar

UserAvatar
├─ Avatar Image/Initials (button)
└─ Dropdown Menu (hidden by default)
   ├─ User Info
   │  ├─ Name
   │  └─ Email
   └─ Sign Out Button

GoogleAuthButton
├─ Loading Spinner (during auth)
├─ Button Text
└─ Error Message (if any)
```

---

## ⚙️ Configuration Management

### Environment Variables
```env
# .env.local (never commit this)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Firebase Configuration
```typescript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... rest of config
}
```

### Why NEXT_PUBLIC_ Prefix?
- Firebase SDK runs in browser
- Needs to access credentials from client-side
- Values are NOT secrets (API keys are scoped)
- Use security rules to protect actual data

---

## 🚀 Performance Patterns

### 1. Lazy Loading Auth Components
```typescript
import dynamic from 'next/dynamic'

const UserAvatar = dynamic(() => import('./UserAvatar'), {
  loading: () => <div className="w-10 h-10 bg-gray-200 rounded-full" />,
  ssr: false
})
```

### 2. Memoization
```typescript
import { memo } from 'react'

const UserAvatar = memo(function UserAvatar() {
  // Only re-renders if user data changes
  const { user } = useAuth()
  return <Avatar user={user} />
})
```

### 3. Use Client Directive
```typescript
'use client'
// Marks component as client-only
// Optimizes bundle for SSR
```

---

## 🧪 Testing Patterns

### Testing Auth Hook
```typescript
import { useAuth } from '@/context/AuthContext'

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User' },
    loading: false,
    loginWithGoogle: jest.fn(),
    logout: jest.fn(),
  }))
}))
```

### Testing Protected Route
```typescript
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

jest.mock('@/lib/hooks/useProtectedRoute', () => ({
  useProtectedRoute: jest.fn()
}))
```

---

## 📈 Scaling Patterns

### Adding More OAuth Providers
```typescript
// In FirebaseAuthService
signInWithGitHub() { /* ... */ }
signInWithMicrosoft() { /* ... */ }

// In GoogleAuthButton
<GoogleAuthButton provider="google" />
<GoogleAuthButton provider="github" />
```

### Adding Custom Claims
```typescript
// Future: With Firebase Cloud Functions
const token = await user.getIdTokenResult()
const role = token.claims.role // 'teacher' | 'admin'
```

### Adding Firestore Adapter
```typescript
// Follow same pattern as FirebaseAuthService
export class FirestoreReportRepository implements ReportRepositoryPort {
  // Implement ReportRepositoryPort interface
}
```

---

## 🔄 Error Recovery Patterns

### Retry Logic
```typescript
async function loginWithRetry(maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await loginWithGoogle()
    } catch (err) {
      if (i === maxAttempts - 1) throw err
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}
```

### Graceful Degradation
```typescript
try {
  await loginWithGoogle()
} catch (err) {
  // Show user-friendly message
  setError('Sign-in failed. Please try again or contact support.')
  // Log to error tracking service
  trackError(err)
}
```

---

## 📝 Type Safety Patterns

### User Type
```typescript
interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  role: 'teacher' | 'admin'
  institution?: string
  createdAt: Date
  lastLoginAt?: Date
}
```

### Auth Context Type
```typescript
interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}
```

### Component Props
```typescript
interface GoogleAuthButtonProps {
  variant?: 'default' | 'outline' | 'school-blue'
  size?: 'default' | 'lg'
  className?: string
  showIcon?: boolean
}
```

---

## 🎯 Best Practices Checklist

- ✅ Use `'use client'` for components using hooks
- ✅ Wrap app with AuthProvider in root layout
- ✅ Check loading state before rendering auth content
- ✅ Use useProtectedRoute() on private pages
- ✅ Keep Firebase config in env variables
- ✅ Handle errors gracefully
- ✅ Show loading spinners during auth
- ✅ Implement proper TypeScript types
- ✅ Use clean architecture patterns
- ✅ Test auth flows thoroughly

---

Generated: December 29, 2025
Version: 1.0
