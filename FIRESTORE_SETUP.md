# Firestore Configuration Guide

## Critical Firebase Setup Required

Your application requires specific Firestore configurations to work properly. Please follow these steps:

---

## 1. Firestore Security Rules

Add these security rules to your Firestore to allow users to read/write their own data:

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
      
      // Allow anonymous users to read their own receipts (stored locally)
      allow read: if resource.data.user_id == 'anonymous';
    }
    
    // Businesses collection
    match /businesses/{businessId} {
      // Anyone can read businesses (public directory)
      allow read: if true;
      
      // Only authenticated users can create businesses
      allow create: if request.auth != null && 
                       request.resource.data.created_by == request.auth.uid;
      
      // Only the creator can update their business
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
    
    // User profiles (if you add them later)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**How to add:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `confirmit-8e623`
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the above
5. Click **Publish**

---

## 2. Create Required Firestore Indexes

Your app requires composite indexes for complex queries. Click these links to create them automatically:

### Index 1: Businesses by User (created_by + created_at)
**Required for:** My Business Dashboard (`/my-business`)

**Index URL:** 
```
https://console.firebase.google.com/v1/r/project/confirmit-8e623/firestore/indexes?create_composite=ClJwcm9qZWN0cy9jb25maXJtaXQtOGU2MjMvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2J1c2luZXNzZXMvaW5kZXhlcy9fEAEaDgoKY3JlYXRlZF9ieRABGg4KCmNyZWF0ZWRfYXQQAhoMCghfX25hbWVfXxAC
```

**Manual creation:**
1. Go to **Firestore Database** → **Indexes** → **Composite**
2. Click **Create Index**
3. Collection ID: `businesses`
4. Add fields:
   - `created_by` - Ascending
   - `created_at` - Descending
5. Click **Create**

### Index 2: Receipts by User (user_id + created_at)
**Required for:** Scan History (`/scan-history`)

**Manual creation:**
1. Go to **Firestore Database** → **Indexes** → **Composite**
2. Click **Create Index**
3. Collection ID: `receipts`
4. Add fields:
   - `user_id` - Ascending
   - `created_at` - Descending
5. Click **Create**

---

## 3. Verify Collections Exist

Make sure these collections are created in your Firestore:

- `receipts` - Stores scan history
- `businesses` - Stores registered businesses
- `reviews` - Stores business reviews (optional, for future)

Collections are created automatically when the first document is added, but you can create them manually:

1. Go to **Firestore Database** → **Data**
2. Click **Start Collection**
3. Enter collection ID (e.g., `receipts`)
4. Add a dummy document (you can delete it later)

---

## 4. Backend Configuration

Your backend (`backend/src/modules/business/business.service.ts`) is already configured correctly to use these indexes.

---

## Troubleshooting

### "Missing or insufficient permissions" error
- ✅ Check that Firestore security rules are published
- ✅ Verify user is authenticated when trying to write
- ✅ Check that `user_id` in the document matches `request.auth.uid`

### "The query requires an index" error
- ✅ Click the index creation link in the error message
- ✅ Wait 2-5 minutes for index to build
- ✅ Refresh your app and try again

### Index building takes too long
- Indexes typically build in 2-5 minutes
- For large collections (>10k docs), it may take 10-15 minutes
- Check index status in Firebase Console → Firestore → Indexes

---

## Testing

After completing the setup:

1. **Test Scan History:**
   - Go to `/quick-scan`
   - Upload a receipt
   - Wait for analysis
   - Go to `/scan-history`
   - You should see your scanned receipt

2. **Test My Business Dashboard:**
   - Register a business at `/business/register`
   - Go to `/my-business`
   - You should see your registered business

---

## Next Steps

Once these are configured, your app will:
- ✅ Save scan results to Firestore
- ✅ Show scan history to users
- ✅ Display user's registered businesses in dashboard
- ✅ Allow users to manage their businesses

---

**Status Check:**
- [ ] Firestore Security Rules published
- [ ] Businesses index created (created_by + created_at)
- [ ] Receipts index created (user_id + created_at)
- [ ] Collections verified to exist
- [ ] Tested scan history
- [ ] Tested my business dashboard

Once all items are checked, your Firebase setup is complete! 🎉
