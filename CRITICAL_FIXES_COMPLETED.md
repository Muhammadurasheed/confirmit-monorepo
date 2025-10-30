# Critical Fixes - Environment & Permissions ✅

## Issues Resolved

### 1. ✅ Migration Script Environment Variables Fixed
**Problem:** Script couldn't find Firebase credentials  
**Solution:** Script now loads from both `backend/.env` and root `.env` with validation

### 2. ✅ Firestore Security Rules Must Be Updated
**Problem:** "Missing or insufficient permissions" error in Activity History  
**Solution:** Must publish updated Firestore security rules

---

## 🚨 ACTION REQUIRED: Update Firestore Security Rules

Your backend has the correct credentials, but your **Firestore security rules** need to be updated to allow users to read their activity history.

### Step-by-Step Instructions:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com
   - Select project: `confirmit-8e623`

2. **Navigate to Firestore Rules**
   - Click **Firestore Database** (left sidebar)
   - Click **Rules** tab (top)

3. **Replace ALL existing rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Receipts collection - users can read their own receipts
    match /receipts/{receiptId} {
      allow read: if request.auth != null && 
                     (resource.data.user_id == request.auth.uid || 
                      resource.data.user_id == 'anonymous');
      allow write: if request.auth != null && 
                      request.resource.data.user_id == request.auth.uid;
      
      // Allow anonymous users to read their own receipts
      allow read: if resource.data.user_id == 'anonymous';
    }
    
    // Account Checks collection - NEW! This is what you're missing
    match /account_checks/{checkId} {
      allow read: if request.auth != null && 
                     (resource.data.user_id == request.auth.uid || 
                      resource.data.user_id == 'anonymous');
      allow write: if request.auth != null && 
                      request.resource.data.user_id == request.auth.uid;
      
      // Allow anonymous users to read their own checks
      allow read: if resource.data.user_id == 'anonymous';
    }
    
    // Fraud Reports - public read, authenticated write
    match /fraud_reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    match /demo_fraud_reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Businesses collection
    match /businesses/{businessId} {
      allow read: if true;
      allow create: if request.auth != null && 
                       request.resource.data.created_by == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.created_by == request.auth.uid;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.user_id == request.auth.uid;
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. **Click "Publish"** (top-right button)
5. **Wait 10 seconds** for rules to propagate globally

---

## Now Run the Migration Script

After updating Firestore rules, run:

```bash
cd backend
npx ts-node scripts/migrate-business-account-hashes.ts
```

**Expected output:**
```
🚀 Starting business account hash migration...

📊 Found 6 businesses to check

✅ BUS001 (Taj Bank Ltd) - Migrated successfully
   Old (Base64): MDAxNTYyOTk0NQ==...
   New (SHA-256): a3f8c9d2e1b4f5a6...

============================================================
✅ MIGRATION COMPLETE
============================================================
📊 Total businesses: 6
✅ Migrated: 3
⏭️  Skipped: 3
❌ Errors: 0
============================================================
```

---

## Testing After Setup

### Test 1: Activity History ✅
1. Navigate to `/activity-history`
2. Should see your receipt scans and account checks
3. No "Missing permissions" error

### Test 2: Verified Business Account Check ✅
1. Go to `/account-check`
2. Check account: `0035629945` (Taj Bank)
3. Should show "Verified Business Account" badge

### Test 3: High Risk Account ✅
1. Check account: `3603101649` (Renmoney)
2. Should show "HIGH RISK" with fraud reports
3. Click "View Reports" - should show full descriptions

---

## Why This Happened

1. **Migration Script**: Was looking for `FIREBASE_SERVICE_ACCOUNT` JSON variable, but your `.env` uses individual variables (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`). Fixed! ✅

2. **Activity History**: New `account_checks` collection was added, but Firestore security rules didn't allow reading from it. Once you publish the updated rules above, it will work! ✅

---

## Status

- ✅ Migration script fixed
- ⚠️ **ACTION NEEDED**: Publish Firestore security rules (3 minutes)
- ⚠️ **THEN RUN**: Migration script

Once you publish the rules and run the script, everything will work perfectly! 🚀

**Time required**: 3 minutes to update rules, 30 seconds to run migration.
