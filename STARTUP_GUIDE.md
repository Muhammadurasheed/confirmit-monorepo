# ConfirmIT - Startup & Troubleshooting Guide

## 🎯 Issues Fixed

### 1. Cloudinary API Key Issue ✅
**Problem:** `Must supply api_key` error when uploading receipts
**Root Cause:** Cloudinary configuration was initialized at module level before environment variables were loaded
**Solution:** Moved Cloudinary initialization to the service constructor using ConfigService

### 2. Configuration Loading ✅
**Problem:** Environment variables not being properly accessed
**Solution:** Updated to use both nested config paths (`cloudinary.apiKey`) and direct env vars as fallback

---

## 🚀 Required Manual Setup Steps

### 1. Cloudinary Upload Preset Configuration ⚠️ CRITICAL
The frontend uses **unsigned uploads** to Cloudinary, which requires an upload preset to be configured.

**Steps to Configure:**
1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings → Upload**
3. Scroll to **Upload Presets**
4. Click **Add upload preset**
5. Configure as follows:
   - **Preset name:** `confirmit_uploads` (MUST match the .env value)
   - **Signing Mode:** **Unsigned** (CRITICAL - allows frontend uploads without API secret)
   - **Folder:** `confirmit/receipts` (optional but recommended)
   - **Resource type:** Image
   - **Access mode:** Public
   - **Quality:** Auto:best
   - **Format:** Auto
6. Click **Save**

**Verification:** 
```bash
curl -X POST "https://api.cloudinary.com/v1_1/dlmrufbme/image/upload" \
  -F "upload_preset=confirmit_uploads" \
  -F "file=@/path/to/test-image.jpg"
```

### 2. Firebase Console Configuration ⚠️
The Cross-Origin-Opener-Policy warnings in the browser console are from Firebase Auth. To minimize them:

1. Go to [Firebase Console](https://console.firebase.google.com/project/confirmit-8e623/authentication/settings)
2. Navigate to **Authentication → Settings → Authorized domains**
3. Add:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain when deploying

**Note:** These warnings won't break functionality, but proper domain configuration improves user experience.

---

## 🏃‍♂️ Running the Application

### Prerequisites
```bash
# Ensure you have the required runtime versions
node --version  # Should be >= 18.x
python --version  # Should be >= 3.11
```

### Step 1: Start AI Service (Python FastAPI)
```bash
cd ai-service

# Install dependencies (first time only)
pip install -r requirements.txt

# Verify .env file exists and has correct values
cat .env | grep GEMINI_API_KEY

# Start the service
python run.py

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Verify AI Service:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### Step 2: Start Backend (NestJS)
```bash
cd backend

# Install dependencies (first time only)
npm install

# Verify .env file exists and has correct values
cat .env | grep CLOUDINARY_API_KEY

# Start in development mode
npm run start:dev

# You should see:
# 🚀 ConfirmIT Backend API is running!
# 📡 Server: http://localhost:8080
# 📚 API Docs: http://localhost:8080/api/docs
```

**Verify Backend:**
```bash
curl http://localhost:8080/api
# Should return welcome message
```

### Step 3: Start Frontend (React + Vite)
```bash
# From project root

# Install dependencies (first time only)
npm install

# Verify .env file exists
cat .env | grep VITE_API_BASE_URL

# Start development server
npm run dev

# You should see:
# VITE ready in XXXms
# ➜ Local: http://localhost:5173/
```

---

## 🧪 Testing the Receipt Upload Flow

### 1. Test Cloudinary Upload Preset
Before testing the full flow, verify the upload preset:
```bash
# Create a test file
echo "test" > test.txt

# Test unsigned upload
curl -X POST "https://api.cloudinary.com/v1_1/dlmrufbme/image/upload" \
  -F "upload_preset=confirmit_uploads" \
  -F "file=@test.txt"

# Expected: JSON response with secure_url
# If error: "Upload preset not found" → Preset not configured (see Step 1 above)
# If error: "Must supply api_key" → Preset is not set to "Unsigned" mode
```

### 2. Test Full Receipt Upload Flow
1. Open browser: http://localhost:5173/quick-scan
2. Upload a test receipt image (JPG, PNG, or WEBP)
3. Monitor the backend logs for:
   ```
   [ReceiptsService] Starting receipt scan: RCP-XXXXX
   🔧 Cloudinary config: dlmrufbme / ✅ API key present
   [ReceiptsService] Calling AI service: http://localhost:8000/analyze-receipt
   ```
4. Monitor the AI service logs for:
   ```
   INFO: Received analysis request for receipt: RCP-XXXXX
   INFO: Vision agent analyzing: /tmp/RCP-XXXXX.jpg
   ```

### 3. Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Must supply api_key` | Upload preset not configured | Configure unsigned upload preset in Cloudinary |
| `Upload preset not found` | Preset name mismatch | Verify preset name is exactly `confirmit_uploads` |
| `AI service is currently unavailable` | AI service not running | Start AI service (Step 1) |
| `ECONNREFUSED localhost:8000` | AI service not accessible | Check AI_SERVICE_URL in backend/.env |
| `GEMINI_API_KEY is not configured` | Missing API key | Add GEMINI_API_KEY to ai-service/.env |
| `Firebase initialization failed` | Invalid credentials | Verify Firebase private key in .env (check for proper escaping) |

---

## 🔍 Debugging Checklist

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8080/api

# Check Cloudinary config
cd backend && cat .env | grep CLOUDINARY

# Check logs for Cloudinary initialization
# Should see: "🔧 Cloudinary config: dlmrufbme / ✅ API key present"
```

### AI Service Issues
```bash
# Check if AI service is running
curl http://localhost:8000/health

# Check Gemini API key
cd ai-service && cat .env | grep GEMINI_API_KEY

# Test AI service directly
curl -X POST http://localhost:8000/analyze-receipt \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://example.com/test.jpg","receipt_id":"TEST-123"}'
```

### Frontend Issues
```bash
# Check environment variables
cat .env | grep VITE

# Verify API endpoint is correct
# Should be: VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📊 Environment Variables Summary

### Backend (.env)
```bash
# Critical for receipt upload
CLOUDINARY_CLOUD_NAME=dlmrufbme
CLOUDINARY_API_KEY=243879246376513
CLOUDINARY_API_SECRET=cxL9Yd6sm1FTfMxs5GeeDRYDWl0

# Critical for AI analysis
AI_SERVICE_URL=http://localhost:8000

# Firebase (already configured)
FIREBASE_PROJECT_ID=confirmit-8e623
# ... rest of Firebase config
```

### AI Service (.env)
```bash
# Critical for analysis
GEMINI_API_KEY=AIzaSyCW9K3ow9HCgxXT4wD6IN-KwAhAGSOkQ0I

# Cloudinary (for downloading images)
CLOUDINARY_URL=cloudinary://243879246376513:cxL9Yd6sm1FTfMxs5GeeDRYDWl0@dlmrufbme
```

### Frontend (.env)
```bash
# Critical for uploads
VITE_CLOUDINARY_CLOUD_NAME=dlmrufbme
VITE_CLOUDINARY_UPLOAD_PRESET=confirmit_uploads  # MUST be configured in Cloudinary

# API endpoints
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=http://localhost:8080
```

---

## 🎯 Hedera Hackathon Readiness

### Track Alignment
**Your project fits in:** DLT for Operations (Track 2)

**Why?**
- Solves real operational problem: Receipt fraud in African commerce
- Uses Hedera DLT for immutable verification anchoring
- Addresses trust and transparency in supply chains and transactions
- Targets a critical pain point in African markets

### Key Features to Highlight
1. **Multi-Agent AI System** - Sophisticated fraud detection using Vision, Forensic, Metadata, Reputation, and Reasoning agents
2. **Hedera Blockchain Anchoring** - Immutable proof of verification on Hedera Consensus Service (HCS)
3. **Real-World Impact** - Protects consumers and businesses from receipt fraud in African markets
4. **Enterprise-Ready** - Business directory, API access, tiered verification system
5. **Web3 Integration** - TrustID NFTs, on-chain reputation system

### Pre-Submission Checklist
- [ ] All services running without errors
- [ ] Receipt upload and analysis working end-to-end
- [ ] Hedera anchoring functional (test on testnet)
- [ ] Business registration and verification flows working
- [ ] API endpoints documented (available at http://localhost:8080/api/docs)
- [ ] Demo video prepared (recommended: show full receipt verification flow)
- [ ] Clear README with project description and setup instructions
- [ ] Deploy to production for live demo (optional but recommended)

---

## 🆘 Still Having Issues?

### Get More Help
1. **Check logs:** Look for specific error messages in all three services
2. **Verify API keys:** Ensure all API keys are valid and have proper permissions
3. **Test endpoints individually:** Use curl to isolate issues
4. **Check network connectivity:** Ensure services can communicate (firewalls, ports)

### Quick Reset
If things get completely broken:
```bash
# Stop all services (Ctrl+C in each terminal)

# Clean install
cd backend && rm -rf node_modules && npm install
cd ../ai-service && pip install -r requirements.txt --force-reinstall
cd .. && rm -rf node_modules && npm install

# Restart services (Steps 1-3 above)
```

---

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ All three services start without errors
2. ✅ Backend logs show: "🔧 Cloudinary config: dlmrufbme / ✅ API key present"
3. ✅ You can upload a receipt image through the frontend
4. ✅ You see real-time progress updates during analysis
5. ✅ You get a trust score and verification report
6. ✅ (Optional) Hedera transaction appears on HashScan testnet

---

**May Allah grant you success in the hackathon! Bismillah - Building trust for African commerce! 🌍**
