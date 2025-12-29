# 🔧 Firebase Setup Troubleshooting

## ✅ Fixed: "auth/invalid-api-key" Error

**Cause:** `.env.local` file was missing or had placeholder values

**Solution:** Created `.env.local` with your actual Firebase credentials

**Status:** ✅ **FIXED** - Restart your dev server now!

---

## 📋 Verification Checklist

Before testing, make sure:

- [x] `.env.local` file created with real credentials
- [ ] Dev server restarted (stop and `npm run dev` again)
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Authorized domains added (localhost, 127.0.0.1)
- [ ] .env.local is in .gitignore (don't commit it!)

---

## 🚀 Quick Test

After restart, test these:

### Test 1: Check Environment Variables Loaded
```bash
# In terminal, check if Next.js loaded the env:
# You should see your Firebase config in console (development only)
# If you see "Firebase configuration is missing" - env not loaded
```

### Test 2: Visit Landing Page
```
http://localhost:3000/marketing
```
Should load without errors ✓

### Test 3: Click "Continue with Google"
```
Button should show loading state ✓
Google popup should appear ✓
You can sign in with Google account ✓
Should redirect to /dashboard ✓
Avatar should show in header ✓
```

---

## ❌ Common Issues & Fixes

### Issue 1: "Firebase configuration is missing"
**Cause:** `.env.local` not being read by Next.js

**Fix:**
```bash
1. Make sure .env.local exists in root directory (not in subfolder)
2. Restart dev server: Stop (Ctrl+C) then npm run dev
3. Wait 5 seconds for Next.js to reload
```

### Issue 2: Google popup says "Unauthorized domain"
**Cause:** Domain not added to Firebase authorized domains

**Fix:**
```
1. Go to Firebase Console
2. Authentication → Settings
3. Scroll to "Authorized domains"
4. Add: localhost
5. Add: 127.0.0.1
6. Save
7. Refresh browser
```

### Issue 3: "NEXT_PUBLIC_FIREBASE_API_KEY is undefined"
**Cause:** Environment variables not loaded yet

**Fix:**
```bash
1. Restart dev server: npm run dev
2. Delete .next folder: rm -r .next
3. Restart dev server again
```

### Issue 4: Still getting auth errors
**Cause:** Credentials might be wrong

**Fix:**
```
1. Go to: https://console.firebase.google.com/project/resultease-d0aa5/settings/general
2. Copy the entire Firebase config from "Your apps > Web"
3. Replace values in .env.local
4. Restart server
```

### Issue 5: Localhost shows "origin is not authorized"
**Cause:** Need to add localhost to authorized domains

**Fix:**
```
Firebase Console → Authentication → Settings → Authorized domains
Add: localhost
(It should already show up after you enable Google Sign-In)
```

---

## 📝 Your Firebase Project Details

```
Project Name: resultease-d0aa5
Project ID:   resultease-d0aa5
Auth Domain:  resultease-d0aa5.firebaseapp.com

Firebase Console: 
https://console.firebase.google.com/project/resultease-d0aa5
```

---

## ✨ Success Signs

When everything is working:

✅ No error messages in browser console
✅ Landing page loads without errors
✅ "Continue with Google" button is visible
✅ Clicking button opens Google Sign-In popup
✅ After signing in, redirects to /dashboard
✅ User avatar appears in top-right corner

---

## 🆘 Still Having Issues?

1. **Check browser console** (F12) for error messages
2. **Check terminal** for Next.js error messages
3. **Verify .env.local** has all 6 variables
4. **Check Firebase Console** for Google Sign-In enabled
5. **Restart server** completely (stop and npm run dev)

---

## 📱 If Testing on Different Device/Port

If you're testing on a different:
- **Port** (e.g., 3001): Add to authorized domains
- **Domain** (e.g., 192.168.x.x): Add to authorized domains
- **Computer** (e.g., from phone): Add that IP to authorized domains

Steps:
```
Firebase Console → Authentication → Settings → Authorized domains
Click "+ Add domain"
Enter the exact domain/port you're using
Save
```

---

**Your setup is complete! Just restart the server and you're good to go!** 🎉

Generated: December 29, 2025
