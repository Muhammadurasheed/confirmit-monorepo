# ConfirmIT Quick Start Guide

## 🚀 Get Up and Running in 10 Minutes

### Prerequisites
- Node.js 20+ installed
- Python 3.11+ installed
- Firebase account (free)
- Cloudinary account (free)

---

## Step 1: Frontend Setup (2 minutes)

### 1.1 Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/confirmit-8e623/settings/general)
2. Scroll to "Your apps" → Web app
3. Copy all the configuration values

### 1.2 Create `.env` File

Create a `.env` file in the **root directory** (same level as `package.json`):

```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

Then edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...                    # From Firebase Console
VITE_FIREBASE_AUTH_DOMAIN=confirmit-8e623.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=confirmit-8e623
VITE_FIREBASE_STORAGE_BUCKET=confirmit-8e623.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Keep these as-is for local development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=http://localhost:8080
VITE_CLOUDINARY_CLOUD_NAME=dlmrufbme
VITE_CLOUDINARY_UPLOAD_PRESET=confirmit_uploads
VITE_HEDERA_NETWORK=testnet
```

### 1.3 Install Dependencies and Start

```bash
npm install
npm run dev
```

**Frontend should now be running at: http://localhost:5173** ✅

---

## Step 2: Backend Setup (3 minutes)

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Verify `.env` File

The `backend/.env` file is already configured. Just verify these are present:

```env
# Firebase credentials (already configured)
FIREBASE_PROJECT_ID=confirmit-8e623
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...

# Cloudinary (already configured)
CLOUDINARY_CLOUD_NAME=dlmrufbme
CLOUDINARY_API_KEY=243879246376513
CLOUDINARY_API_SECRET=cxL9Yd6sm1FTfMxs5GeeDRYDWl0

# Hedera (already configured)
HEDERA_ACCOUNT_ID=0.0.7098369
HEDERA_PRIVATE_KEY=302e020100300506032b65700422042075942eec...
HEDERA_TOPIC_ID=0.0.7131312
HEDERA_TOKEN_ID=0.0.7131340
HEDERA_NETWORK=testnet

# AI Service
AI_SERVICE_URL=http://localhost:8000
```

### 2.3 Add Paystack Secret Key (Optional but Recommended)

To enable account name resolution:

1. Sign up at [Paystack](https://dashboard.paystack.com)
2. Get your Test Secret Key from Settings → API Keys & Webhooks
3. Add to `backend/.env`:

```env
PAYSTACK_SECRET_KEY=sk_test_your_key_here
```

### 2.4 Start Backend

```bash
npm run start:dev
```

**Backend should now be running at: http://localhost:8080** ✅

**Swagger API Docs**: http://localhost:8080/api/docs

---

## Step 3: AI Service Setup (5 minutes)

### 3.1 Create Virtual Environment

```bash
cd ai-service
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3.2 Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI + Uvicorn
- Google Generative AI (Gemini)
- OpenCV, scikit-image (forensics)
- Firebase Admin SDK
- And more...

### 3.3 Verify `.env` File

The `ai-service/.env` file is already configured:

```env
# Google Gemini API (already configured)
GEMINI_API_KEY=AIzaSyCW9K3ow9HCgxXT4wD6IN-KwAhAGSOkQ0I

# Firebase (same as backend)
FIREBASE_PROJECT_ID=confirmit-8e623
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...

# Cloudinary
CLOUDINARY_URL=cloudinary://243879246376513:cxL9Yd6sm1FTfMxs5GeeDRYDWl0@dlmrufbme
```

### 3.4 Start AI Service

```bash
uvicorn app.main:app --reload --port 8000
```

**AI Service should now be running at: http://localhost:8000** ✅

**API Docs**: http://localhost:8000/docs

---

## ✅ Verification Checklist

Open these URLs to verify everything is running:

1. **Frontend**: http://localhost:5173
   - Should see ConfirmIT landing page
   - No Firebase errors in console

2. **Backend API**: http://localhost:8080/api/docs
   - Should see Swagger documentation
   - Endpoints: `/receipts/scan`, `/accounts/check`, `/business/register`

3. **AI Service**: http://localhost:8000/docs
   - Should see FastAPI documentation
   - Endpoints: `/analyze-receipt`, `/api/check-account`

4. **WebSocket**: Open browser console on frontend
   - Should see "WebSocket connected" when uploading receipt

---

## 🧪 Test the Platform

### Test 1: QuickScan Receipt Verification

1. Go to http://localhost:5173/quick-scan
2. Upload any receipt image (screenshot of online purchase works)
3. Check "Anchor to Hedera Blockchain"
4. Click "Upload"
5. Watch real-time progress updates
6. See AI analysis results with trust score
7. View Hedera transaction on HashScan

**Expected**: Analysis completes in <10 seconds with trust score.

### Test 2: Account Check

1. Go to http://localhost:5173/account-check
2. Enter Nigerian account number: `0123456789`
3. Select any bank
4. Click "Check Account"
5. See trust score and fraud reports

**Expected**: Trust score displayed with risk level.

### Test 3: Business Registration

1. Go to http://localhost:5173/business/register
2. Select a tier (Verified recommended)
3. Fill in business details
4. Upload documents (any PDF/image)
5. Add bank account
6. Complete payment (test mode)
7. See confirmation

**Expected**: Business registered, redirect to dashboard.

---

## 🐛 Troubleshooting

### Issue: Frontend shows Firebase error

**Solution**: 
1. Verify `.env` file exists in root directory (not in `src/`)
2. Restart dev server: `npm run dev`
3. Check Firebase credentials are correct

### Issue: Backend can't connect to AI service

**Solution**:
1. Verify AI service is running: `curl http://localhost:8000/docs`
2. Check `backend/.env` has `AI_SERVICE_URL=http://localhost:8000`
3. Restart backend

### Issue: WebSocket not connecting

**Solution**:
1. Check browser console for errors
2. Verify backend is running
3. Test WebSocket manually: `wscat -c ws://localhost:8080/socket.io/`

### Issue: Python dependencies fail to install

**Solution**:
```bash
# On macOS, you might need:
brew install python@3.11

# On Ubuntu:
sudo apt-get install python3.11 python3.11-venv

# Recreate virtual environment
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: CORS errors in browser

**Solution**:
1. Check `backend/src/main.ts` has CORS enabled:
   ```typescript
   app.enableCors({
     origin: ['http://localhost:5173', 'http://localhost:5174'],
     credentials: true,
   });
   ```
2. Restart backend

---

## 🎯 Next Steps

Now that everything is running:

1. **Test all 4 user journeys** (QuickScan, AccountCheck, Business, API)
2. **Review the audit document**: `COMPREHENSIVE_AUDIT_AND_IMPLEMENTATION_PLAN.md`
3. **Check what needs to be completed** for the hackathon
4. **Start Phase 1 fixes** if anything isn't working

---

## 📞 Need Help?

If you run into issues:

1. Check console logs (browser + backend + AI service)
2. Review error messages carefully
3. Consult the comprehensive audit document
4. Ask me specific questions about what's not working

**Bismillah, happy building! 🚀**
