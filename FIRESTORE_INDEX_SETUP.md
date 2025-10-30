# Firestore Composite Index Setup

## Required Indexes for ConfirmIT

The following composite indexes are required for the application to function correctly. When you encounter errors mentioning missing indexes, Firebase will provide direct links to create them.

### 1. Fraud Reports Index (demo_fraud_reports)

**Collection**: `demo_fraud_reports`  
**Fields**:
- `account_hash` (Ascending)
- `reported_at` (Descending)

**Purpose**: Enable querying fraud reports for a specific account sorted by date.

**Creation Link** (when error occurs):  
Click the link provided in the error message, or manually create via Firebase Console:
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection ID: `demo_fraud_reports`
4. Add fields:
   - `account_hash` → Ascending
   - `reported_at` → Descending
5. Click "Create"

### 2. Fraud Reports Index (fraud_reports - Production)

**Collection**: `fraud_reports`  
**Fields**:
- `account_hash` (Ascending)
- `reported_at` (Descending)

**Purpose**: Same as above, but for production data.

### 3. Business Reviews Index (demo_reviews)

**Collection**: `demo_reviews`  
**Fields**:
- `business_id` (Ascending)
- `created_at` (Descending)

**Purpose**: Fetch reviews for a specific business sorted by date.

### 4. Business Reviews Index (reviews - Production)

**Collection**: `reviews`  
**Fields**:
- `business_id` (Ascending)
- `created_at` (Descending)

**Purpose**: Same as above, but for production data.

### 5. Businesses by Account Number

**Collection**: `businesses`  
**Fields**:
- `bank_account.number_encrypted` (Ascending)
- `verification.verified` (Ascending)

**Purpose**: Link bank account numbers to verified businesses.

## How to Create Indexes

### Method 1: Click the Error Link (Easiest)
When you see a "FAILED_PRECONDITION: The query requires an index" error, it will include a direct link. Click it to automatically create the index.

### Method 2: Firebase Console
1. Open Firebase Console
2. Navigate to Firestore Database → Indexes
3. Click "Create Index" (or "Add composite index")
4. Enter collection ID and add fields
5. Select sort direction (Ascending/Descending)
6. Click "Create"

### Method 3: Using firestore.indexes.json (Recommended for Deployment)

Create a `firestore.indexes.json` file:

```json
{
  "indexes": [
    {
      "collectionGroup": "demo_fraud_reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "account_hash", "order": "ASCENDING" },
        { "fieldPath": "reported_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "fraud_reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "account_hash", "order": "ASCENDING" },
        { "fieldPath": "reported_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "demo_reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "business_id", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "business_id", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "businesses",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "bank_account.number_encrypted", "order": "ASCENDING" },
        { "fieldPath": "verification.verified", "order": "ASCENDING" }
      ]
    }
  ]
}
```

Deploy with: `firebase deploy --only firestore:indexes`

## Index Build Time

⏱️ **Note**: Firestore indexes can take several minutes to build, especially for collections with existing data. The Firebase Console will show build progress.

## Testing Indexes

After creating indexes, wait for them to show as "Enabled" in Firebase Console before testing queries.

## Troubleshooting

**Q: Query still failing after creating index?**  
A: Wait 2-5 minutes for the index to fully build. Check Firebase Console → Firestore → Indexes for status.

**Q: Need to delete an index?**  
A: Go to Firebase Console → Firestore → Indexes, find the index, click the three dots, and select "Delete".

**Q: Index taking too long to build?**  
A: For large collections (>10,000 docs), indexes can take 15-30 minutes. Be patient.
