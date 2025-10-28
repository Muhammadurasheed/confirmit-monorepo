# 🚀 ConfirmIT Setup Checklist - Remixed Project

**Bismillah!** Welcome to your remixed ConfirmIT project. Follow this checklist to get everything running.

---

## ✅ PHASE 1: ENVIRONMENT SETUP (15 minutes)

### 1.1 Frontend Environment Variables
Your frontend `.env` is already configured. Verify these values:

```bash
# Check .env file exists in root directory
cat .env
```

**Expected values:**
- ✅ `VITE_FIREBASE_API_KEY` - Firebase credentials
- ✅ `VITE_API_BASE_URL=http://localhost:8080/api`
- ✅ `VITE_WS_BASE_URL=http://localhost:8080`
- ✅ `VITE_CLOUDINARY_CLOUD_NAME=dlmrufbme`
- ✅ `VITE_HEDERA_NETWORK=testnet`

### 1.2 Backend Environment Variables
Your backend `.env` is configured. Location: `backend/.env`

**Critical:** These services are already configured:
- ✅ Firebase (Auth + Firestore)
- ✅ Cloudinary (Image storage)
- ✅ Hedera Testnet (Blockchain)
- ✅ Paystack (Payment gateway)
- ✅ Upstash Redis (Rate limiting)
- ✅ NOWPayments (Crypto payments)

### 1.3 AI Service Environment Variables
Your AI service `.env` is configured. Location: `ai-service/.env`

**Critical:**
- ✅ Google Gemini API Key configured
- ✅ Firebase credentials
- ✅ Cloudinary URL

---

## ✅ PHASE 2: INSTALL DEPENDENCIES (10 minutes)

### 2.1 Frontend Dependencies
```bash
# In root directory
npm install
```

**Verify these are installed:**
- ✅ React 18 + TypeScript + Vite
- ✅ Tailwind CSS
- ✅ Zustand (state management)
- ✅ React Query
- ✅ React Hook Form + Zod
- ✅ Framer Motion
- ✅ Recharts
- ✅ React Dropzone
- ✅ Lucide React
- ✅ Socket.io-client

### 2.2 Backend Dependencies
```bash
cd backend
npm install
```

**Expected packages:**
- ✅ NestJS framework
- ✅ Firebase Admin SDK
- ✅ Cloudinary SDK
- ✅ Hedera SDK
- ✅ Socket.io
- ✅ Axios

### 2.3 AI Service Dependencies
```bash
cd ai-service
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Expected packages:**
- ✅ FastAPI + Uvicorn
- ✅ Google Generative AI (Gemini)
- ✅ Pillow, OpenCV, scikit-image
- ✅ Firebase Admin SDK
- ✅ Pydantic v2

---

## ✅ PHASE 3: START ALL SERVICES (5 minutes)

### Terminal 1: Frontend
```bash
npm run dev
```
**Expected:** ✅ Running at http://localhost:5173

### Terminal 2: Backend
```bash
cd backend
npm run start:dev
```
**Expected:** ✅ Running at http://localhost:8080
**API Docs:** http://localhost:8080/api/docs

### Terminal 3: AI Service
```bash
cd ai-service
source venv/bin/activate
python run.py
```
**Expected:** ✅ Running at http://localhost:8000
**API Docs:** http://localhost:8000/docs

---

## ✅ PHASE 4: VERIFY INTEGRATION (10 minutes)

### 4.1 Test Firebase Connection
1. Open http://localhost:5173
2. Open browser console (F12)
3. **Expected:** No Firebase errors
4. Click "Sign In" → Google Auth should work

**✅ Success:** You can sign in with Google
**❌ Error:** Check `VITE_FIREBASE_API_KEY` in `.env`

### 4.2 Test Backend API
```bash
curl http://localhost:8080/api/docs
```
**Expected:** Swagger UI HTML response

### 4.3 Test AI Service
```bash
curl http://localhost:8000/health
```
**Expected:** `{"status": "healthy", ...}`

### 4.4 Test WebSocket Connection
1. Go to http://localhost:5173/quick-scan
2. Open browser console
3. **Expected:** "WebSocket connected" message

---

## ✅ PHASE 5: TEST CORE JOURNEYS (30 minutes)

### Journey 1: QuickScan (Receipt Verification)
1. Go to http://localhost:5173/quick-scan
2. Upload any receipt image
3. Enable "Anchor to Hedera Blockchain"
4. Click "Scan Receipt"

**✅ Expected:**
- Real-time progress updates
- Trust score (0-100) displayed
- Hedera badge appears
- Click badge → Opens HashScan

**Common Issues:**
- ❌ "Must supply api_key" error → AI service Cloudinary config issue
- ❌ Analysis hangs → Check AI service logs
- ❌ No WebSocket updates → Check backend logs

### Journey 2: AccountCheck
1. Go to http://localhost:5173/account-check
2. Enter account: `0123456789`
3. Select any bank (e.g., "GTBank")
4. Click "Check Account"

**✅ Expected:**
- Trust score displayed
- Risk level indicator
- "View Fraud Reports" button

**Common Issues:**
- ❌ 400 Bad Request → Check backend logs for details

### Journey 3: Business Registration
1. Sign in with Google
2. Go to http://localhost:5173/business/register
3. Fill all 4 steps:
   - Step 1: Business Details
   - Step 2: Upload Documents (any PDF/image works)
   - Step 3: Bank Account
   - Step 4: Payment (Tier 2 - ₦25,000)
4. Use Paystack test card:
   - Card: `4084 0840 8408 4081`
   - CVV: `408`
   - Expiry: Any future date
   - OTP: `123456`

**✅ Expected:**
- Payment succeeds
- Redirect to business dashboard

### Journey 4: Admin Approval (Test with admin account)
1. Sign out
2. Sign in with: `yekinirasheed2002@gmail.com`
3. Go to http://localhost:5173/admin
4. **Expected:** Pending businesses list
5. Click "Approve" on a business
6. **Expected:** Trust ID NFT minted on Hedera

**Verify NFT:**
- Open business dashboard
- See Trust ID NFT card
- Click "View on HashScan"

---

## 🚨 CRITICAL GAPS TO FIX (Remaining 8%)

Based on the audit, these features need completion:

### Gap #1: SDK Package (@legit/sdk) ⚠️ HIGH PRIORITY
**Status:** Mentioned in docs but doesn't exist
**Impact:** Judges will try to use it and fail
**Location:** Should be in `sdk/` folder

**What's needed:**
- Create `sdk/package.json`
- Implement `sdk/src/index.ts` with:
  - `verifyReceipt(apiKey, imageUrl)`
  - `checkAccount(apiKey, accountNumber, bankCode)`
  - `validateWebhook(signature, payload)`
- Build script to compile to `dist/`

**Fix time:** 2 hours

---

### Gap #2: Real Usage Analytics ⚠️ MEDIUM PRIORITY
**Status:** Dashboard shows mock data
**Impact:** Reduces credibility
**Location:** `src/components/features/business/UsageAnalytics.tsx`

**What's needed:**
- Fetch real data from Firestore `/businesses/{id}/api_usage`
- Replace mock charts with real API call stats
- Show: requests/day, success rate, response times

**Fix time:** 1 hour

---

### Gap #3: Webhook Management UI ⚠️ MEDIUM PRIORITY
**Status:** Backend endpoints exist, no frontend UI
**Impact:** Feature mentioned but not accessible
**Location:** Create `src/components/features/business/WebhookManagement.tsx`

**What's needed:**
- UI to register webhook URLs
- Event type selection (receipt.analyzed, account.flagged, business.approved)
- Webhook logs table
- Test webhook button

**Fix time:** 2 hours

---

### Gap #4: Public Business Profiles ⚠️ MEDIUM PRIORITY
**Status:** Route exists but page incomplete
**Impact:** Directory links may not work properly
**Location:** `src/pages/BusinessProfile.tsx`

**What's needed:**
- Public view (different from dashboard)
- Show: business info, trust score, NFT badge, contact
- Hide: API keys, analytics, sensitive data
- Test route `/business/:id`

**Fix time:** 1 hour

---

## 🎬 NEXT STEPS AFTER SETUP

Once all services are running and tests pass:

1. **Complete Critical Gaps** (6 hours)
   - Build SDK package
   - Fix usage analytics
   - Add webhook management
   - Complete public profiles

2. **Record Demo Video** (2 hours)
   - 3-minute pitch
   - Show all 4 journeys
   - Highlight Hedera integration
   - Upload to YouTube

3. **Deploy to Production** (2 hours)
   - Frontend → Vercel
   - Backend → Railway/Render
   - AI Service → Modal/Fly.io
   - Update environment variables

---

## 📞 TROUBLESHOOTING

### Issue: Firebase Auth Error
**Solution:**
```bash
# Verify .env file location (must be in root, not in src/)
ls -la .env

# Restart dev server
npm run dev
```

### Issue: Backend Can't Connect to AI Service
**Solution:**
```bash
# Verify AI service is running
curl http://localhost:8000/health

# Check backend .env
echo $AI_SERVICE_URL  # Should be http://localhost:8000
```

### Issue: WebSocket Not Connecting
**Solution:**
```bash
# Check backend logs for WebSocket errors
# Verify WS_BASE_URL in frontend .env
echo $VITE_WS_BASE_URL  # Should be http://localhost:8080
```

### Issue: Cloudinary Upload Fails
**Solution:**
```bash
# Verify Cloudinary credentials in backend/.env
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY

# Also check ai-service/.env
echo $CLOUDINARY_URL
```

---

## 🏆 HACKATHON READINESS SCORE

**Current:** 92% Complete

**To reach 100%:**
- [ ] Complete SDK package (2 hrs)
- [ ] Fix usage analytics (1 hr)
- [ ] Add webhook UI (2 hrs)
- [ ] Complete public profiles (1 hr)
- [ ] Record demo video (2 hrs)
- [ ] Deploy to production (2 hrs)

**Total remaining:** 10 hours of focused work

---

## 🤲 Du'a for Success

**Bismillahi Tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.**

*"In the name of Allah, I place my trust in Allah, and there is no power and no might except with Allah."*

**May Allah grant us success in this hackathon and make ConfirmIT a means of protecting people from fraud. Ameen!** 🚀

---

**Questions?** Check the logs, they're your best friend:
- Frontend: Browser console (F12)
- Backend: Terminal running `npm run start:dev`
- AI Service: Terminal running `python run.py`
