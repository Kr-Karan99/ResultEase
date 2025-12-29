# Firebase Auth - Quick Reference Card

## 🎯 1-Minute Setup

```bash
# 1. Create Firebase project at https://console.firebase.google.com/
# 2. Enable Google Sign-In
# 3. Copy Firebase config

cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials

npm install firebase
npm run dev
# Visit http://localhost:3000/marketing
# Click "Continue with Google"
```

---

## 📚 Documentation Map

```
Start Here → FIREBASE_QUICKSTART.md (5 min read)
     ↓
Detailed Setup → FIREBASE_SETUP.md (complete guide)
     ↓
Code Examples → FIREBASE_IMPLEMENTATION.md (reference)
     ↓
Architecture → FIREBASE_ARCHITECTURE.md (patterns)
     ↓
Testing → PRE_LAUNCH_CHECKLIST.md (verify)
```

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

**Never commit `.env.local`** ✋

---

## 💻 Common Code Snippets

### Use Auth Context
```typescript
'use client'
import { useAuth } from '@/context/AuthContext'

const { user, loading, loginWithGoogle, logout } = useAuth()
```

### Check if Signed In
```typescript
if (!user) return <div>Please sign in</div>
return <div>Hello, {user.name}!</div>
```

### Protect Route
```typescript
'use client'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

export default function SecretPage() {
  useProtectedRoute() // Auto-redirects if not signed in
  return <h1>Secret</h1>
}
```

### Handle Sign-In Error
```typescript
try {
  await loginWithGoogle()
} catch (err) {
  setError('Sign-in failed. Please try again.')
}
```

---

## 🔑 Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `lib/firebase.ts` | Firebase config | When Firebase settings change |
| `infrastructure/firebase/FirebaseAuthService.ts` | Auth logic | When adding auth methods |
| `context/AuthContext.tsx` | State management | When changing auth state |
| `components/auth/GoogleAuthButton.tsx` | Sign-in button | When changing UI |
| `components/auth/UserAvatar.tsx` | Profile avatar | When changing user display |
| `app/layout.tsx` | Root provider | Don't change (already set up) |

---

## ✨ Features at a Glance

✅ Google OAuth Sign-In (1-click)  
✅ Automatic Sign-Up (new users)  
✅ Profile Picture Display (from Google)  
✅ User Avatar Dropdown (name, email, logout)  
✅ Route Protection (private pages)  
✅ Session Persistence (survives refresh)  
✅ Error Messages (user-friendly)  
✅ Loading States (spinners)  
✅ Mobile Responsive (works on all devices)  
✅ TypeScript Support (fully typed)  

---

## 🚦 Auth Flow

```
Landing Page
    ↓
Click "Continue with Google"
    ↓
Google Sign-In Popup
    ↓
Firebase Authenticates
    ↓
AuthContext Updates
    ↓
Redirect to Dashboard
    ↓
Avatar Shows in Header
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| "Module not found" | `rm -r .next && npm run dev` |
| "Popup blocked" | Disable popup blocker for localhost |
| "Domain not authorized" | Add domain in Firebase → Auth → Settings |
| "No profile picture" | Google account needs photo (or initials show) |
| "useAuth error" | Add `'use client'` at top of file |
| "Not persisting" | Check browser localStorage is enabled |
| "TypeScript errors" | Run `npm run build` to see all errors |

---

## 📱 Responsive Design

**Desktop**: Avatar top-right of header  
**Mobile**: Avatar still top-right, tap to open dropdown  
**Loading**: Hidden while auth checking  
**Signed Out**: Not shown, sign-in button instead  

---

## 🔐 Security Checklist

- ✅ API key in `.env.local` (not in code)
- ✅ `.env.local` in `.gitignore`
- ✅ Firebase handles token management
- ✅ HTTPS enforced in production
- ✅ No passwords stored
- ✅ Google OAuth = secure by default

---

## 🎯 User Journey

```
First Time Visitor:
  Landing Page → Sign In → Dashboard (auto-registered)
  
Returning Visitor:
  Landing Page → Already Signed In → Dashboard (auto-detected)
  
Logout Flow:
  Click Avatar → Sign Out → Landing Page (session cleared)
  
Access Restrictions:
  Not Signed In → Try /dashboard → Redirect to Landing Page
  Signed In → Access All Routes ✅
```

---

## 🚀 Deployment

1. Create Firebase project in production
2. Enable Google Sign-In
3. Add production domain to authorized domains
4. Set environment variables on hosting platform (Vercel, Netlify, etc.)
5. Deploy

---

## 📞 When You Need Help

1. **Setup help**: Read FIREBASE_QUICKSTART.md
2. **Code examples**: Check FIREBASE_IMPLEMENTATION.md
3. **Architecture**: See FIREBASE_ARCHITECTURE.md
4. **Firebase docs**: https://firebase.google.com/docs
5. **Error in console**: Check FIREBASE_IMPLEMENTATION.md troubleshooting

---

## ✅ Pre-Launch Checklist (Quick)

- [ ] Firebase project created & Google OAuth enabled
- [ ] `.env.local` filled with credentials
- [ ] `npm install firebase` ran successfully
- [ ] `npm run dev` works with no errors
- [ ] Can sign in on landing page
- [ ] Avatar shows after sign-in
- [ ] Can logout from avatar dropdown
- [ ] Route protection works (try `/dashboard` without signing in)
- [ ] Profile picture displays correctly
- [ ] Works on mobile (test in DevTools)

---

## 🎊 You're Ready!

Your ResultEase app now has production-ready Google authentication.

**Next**: Follow FIREBASE_QUICKSTART.md to complete setup.

**Questions?** Check the documentation files or Firebase docs.

**Ready to deploy?** Use PRE_LAUNCH_CHECKLIST.md before going live.

---

**Quick Links**:
- 📖 [FIREBASE_QUICKSTART.md](./FIREBASE_QUICKSTART.md) - 5-minute setup
- 🔧 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Detailed guide
- 💻 [FIREBASE_IMPLEMENTATION.md](./FIREBASE_IMPLEMENTATION.md) - Code examples
- 🏗️ [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) - Architecture
- ✅ [PRE_LAUNCH_CHECKLIST.md](./PRE_LAUNCH_CHECKLIST.md) - Testing guide
- 🎉 [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Summary

---

Generated: December 29, 2025  
Version: 1.0
