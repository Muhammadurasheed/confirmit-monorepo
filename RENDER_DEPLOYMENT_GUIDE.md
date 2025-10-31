# 🚀 ConfirmIT Deployment Guide - Render

Complete guide to deploy your NestJS backend and FastAPI AI service on Render.

---

## 📋 Prerequisites

- ✅ GitHub repository with both `backend/` and `ai-service/` pushed
- ✅ Dockerfiles in both directories (already have them!)
- ✅ All environment variables ready
- ✅ Render account created

---

## 🎯 Part 1: Deploy NestJS Backend

### Step 1: Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Muhammadrasheed/confirmit_backend`

### Step 2: Configure Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `confirmit-nest-api` |
| **Region** | Oregon (US West) - or closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Environment** | `Docker` |
| **Docker Command** | Leave empty (uses Dockerfile CMD) |
| **Plan** | Starter ($7/month) or Free (with limitations) |

### Step 3: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add these:

```bash
NODE_ENV=production
PORT=8080
API_PREFIX=api

# Firebase
FIREBASE_PROJECT_ID=confirmit-8e623
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@confirmit-8e623.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://confirmit-8e623.firebaseio.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFToQyBr4reW8S\nljCzLTDFql1O1Vc1ut6jGkieFJtoUhwba3PdpL55HleylM+216TAFl4dxbsqCfcr\nvPV3vtWldHNa1YP1tvWiL2/MZPDqElTPsdNGuLEDHtlJ1IVwR4tVmGNCUjxGFJLa\nHCivamiC25RwEJLbPBUKztZ3HhfJimTnOE8WDWrYaBNtTH7q+BslIcnJsPzgp7lW\nF5lQtK3ea2pUOlbSCN3SP4ixJGxWIZK5gx9UPO0hbPP9LeLN27Qm+KHhV0szeHwC\nF7aA5F+AFcoeiaA/CKMk4SPMwKiKNdlgA3zHGz2GhPndT89phIzHbiCPOs6S2yo7\nUqm9oGuLAgMBAAECggEAPToVObTv9Gu1dQ4YRLHETcKFO/5mFq1Lg0+Xsz5vz1qT\nkEqy5NfHp6wryKX3IyUd4eHPCOwgHXaENhVoEuWsRLCzTz+suGYzKUYRKls0i15u\n5RiomGyduXssMIX7dpEtAr3MJ3t/arvdqkNMuMqLbfgXwwLRn6iwWu8+jC5RcV+u\nVtemn9Jsams4+IHTnN74KAPZzgymgleSG/GrQ4PufZ0wVv1hqtUbM2bVU0DAUVzG\nyCzBz5G/1hdqAzdCIIJni47nB1F2D7z9pThs4cNPC05X82ZDmFr4P/w7hkbL6TAn\nSoA9TNY0EWN1ytKDAMce/vHtgba6eaInBcXxX0loaQKBgQDlTEAFjZJoBHCDPLQb\nANeoepFGCwt2Jm4fpK8X7G0wlpq9HelPlW60IWVw91pDnoyS7VpdS+LECJ7F1oxS\nP+fAXvYWWiXl8q2ckfqB0xIAGEFM1StK6EDMxm1NnvNca4IA9PMfh27PikNog1gs\nK/1TK2lxqh4bNaAxOvUO5XxTvQKBgQDcSI6bIm4K4uArhyCDpwakc5sNjuhV9kfk\n//jZI70ZFiwqf0rDiU2XHGpAr4eTEiAk21vNUeI0lD03futQFQ1XY8eM/4Oz9nKd\nP4Yf5N3BKwNWm3ORtx8J54QYAddKLnynbjRHr0i43QGeducv/pmLE9SxRBjvOkdJ\nt0fgVtQM5wKBgQCeU1wReYOSFx6pP40M6DQAvUD6ID41wqtfZhMQbcunNRZ7Zt/m\nd8QM1NJ6ghDth9iAyysOKIvX2CvpZw9U65NWHTvGi1CHyl1eMt3KLrfLIPRV3Qsb\nmerEem6Wnh5jvkfx6TDGoHk/DLUmwSpstaMhfmQ8e752Az0tQQxc0NBb8QKBgGN2\n/61c5oNT3hTJdwz7JiyrZp/An3fxNJVaX2rskD37nQWzZHbWUIqi8fczSuxFiu4Z\nfmI/Tvye0uV0EZyfZN7I1xn7ZeSkqywFuvI7zUWjvmYk2xI4tXMrbqHIcwWz5+VS\nBZk4tIWEhW6gEdPCCmKaGbfRH9ElZ3sJnxLVIfqRAoGAWegVwIm8b3NSeSTYH69N\neZfB56WaaFDTZ9EOYyPVTwZa6Zk81sb+3fGSsI7ECofGG6TzenSOkUeZFacM+4Bj\njLdiuC01VM4hmCxH0xthij8A+a97AfE7zk4Xq0pWJc4mpOxwyaIOEOtnt/jTNFQC\nJpQcFiLuSLOGgJg8cI3f2jk=\n-----END PRIVATE KEY-----\n

# Paystack
PAYSTACK_SECRET_KEY=sk_test_9af63204d5ffcdfa1591ae0583b8f23f43ca22ba

# Cloudinary
CLOUDINARY_CLOUD_NAME=dlmrufbme
CLOUDINARY_API_KEY=243879246376513
CLOUDINARY_API_SECRET=cxL9Yd6sm1FTfMxs5GeeDRYDWl0

# AI Service - IMPORTANT: Update after deploying AI service
AI_SERVICE_URL=https://confirmit-ai-service.onrender.com

# Hedera
HEDERA_ACCOUNT_ID=0.0.7098369
HEDERA_PRIVATE_KEY=302e020100300506032b65700422042075942eec1fef3f02b4cdafd6554d7789a4be45bbeed42d8001f74dc85c356a4f
HEDERA_TOPIC_ID=0.0.7131312
HEDERA_TOKEN_ID=0.0.7158192
HEDERA_NETWORK=testnet

# NOWPayments
NOWPAYMENTS_API_KEY=F5BRWDS-5YW4CSN-JNTQERP-JEC8XBZ
NOWPAYMENTS_IPN_SECRET=AnMSadAnqb8RO44bLk/Xd8arHzvD7pzF
NOWPAYMENTS_PUBLIC_KEY=d6872286-8857-444c-ad75-c6a9accf7cac

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://smart-louse-22752.upstash.io
UPSTASH_REDIS_REST_TOKEN=AVjgAAIncDJiN2M4M2EwZjU4NWM0ZDZmYWU3MTBmMjMyYjYwODBhNXAyMjI3NTI

# CORS - IMPORTANT: Update after deploying frontend
CORS_ORIGIN=https://confirmit.africa,https://www.confirmit.africa
FRONTEND_URL=https://confirmit.africa

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build & deployment
3. Once live, you'll get a URL like: `https://confirmit-nest-api.onrender.com`

### Step 5: Test Backend
```bash
# Health check
curl https://confirmit-nest-api.onrender.com/api/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-10-31T...",
  "uptime": 123.45
}
```

---

## 🤖 Part 2: Deploy FastAPI AI Service

### Step 1: Create Second Web Service
1. Click **"New +"** → **"Web Service"** again
2. Select the same repository: `Muhammadrasheed/confirmit_backend`

### Step 2: Configure Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `confirmit-ai-service` |
| **Region** | Oregon (US West) - same as backend |
| **Branch** | `main` |
| **Root Directory** | `ai-service` |
| **Environment** | `Docker` |
| **Docker Command** | Leave empty |
| **Plan** | Starter ($7/month) minimum - AI needs resources! |

### Step 3: Add Environment Variables
```bash
PORT=8000
ENVIRONMENT=production

# Google Gemini AI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Firebase (same as backend)
FIREBASE_PROJECT_ID=confirmit-8e623
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFToQyBr4reW8S\nljCzLTDFql1O1Vc1ut6jGkieFJtoUhwba3PdpL55HleylM+216TAFl4dxbsqCfcr\nvPV3vtWldHNa1YP1tvWiL2/MZPDqElTPsdNGuLEDHtlJ1IVwR4tVmGNCUjxGFJLa\nHCivamiC25RwEJLbPBUKztZ3HhfJimTnOE8WDWrYaBNtTH7q+BslIcnJsPzgp7lW\nF5lQtK3ea2pUOlbSCN3SP4ixJGxWIZK5gx9UPO0hbPP9LeLN27Qm+KHhV0szeHwC\nF7aA5F+AFcoeiaA/CKMk4SPMwKiKNdlgA3zHGz2GhPndT89phIzHbiCPOs6S2yo7\nUqm9oGuLAgMBAAECggEAPToVObTv9Gu1dQ4YRLHETcKFO/5mFq1Lg0+Xsz5vz1qT\nkEqy5NfHp6wryKX3IyUd4eHPCOwgHXaENhVoEuWsRLCzTz+suGYzKUYRKls0i15u\n5RiomGyduXssMIX7dpEtAr3MJ3t/arvdqkNMuMqLbfgXwwLRn6iwWu8+jC5RcV+u\nVtemn9Jsams4+IHTnN74KAPZzgymgleSG/GrQ4PufZ0wVv1hqtUbM2bVU0DAUVzG\nyCzBz5G/1hdqAzdCIIJni47nB1F2D7z9pThs4cNPC05X82ZDmFr4P/w7hkbL6TAn\nSoA9TNY0EWN1ytKDAMce/vHtgba6eaInBcXxX0loaQKBgQDlTEAFjZJoBHCDPLQb\nANeoepFGCwt2Jm4fpK8X7G0wlpq9HelPlW60IWVw91pDnoyS7VpdS+LECJ7F1oxS\nP+fAXvYWWiXl8q2ckfqB0xIAGEFM1StK6EDMxm1NnvNca4IA9PMfh27PikNog1gs\nK/1TK2lxqh4bNaAxOvUO5XxTvQKBgQDcSI6bIm4K4uArhyCDpwakc5sNjuhV9kfk\n//jZI70ZFiwqf0rDiU2XHGpAr4eTEiAk21vNUeI0lD03futQFQ1XY8eM/4Oz9nKd\nP4Yf5N3BKwNWm3ORtx8J54QYAddKLnynbjRHr0i43QGeducv/pmLE9SxRBjvOkdJ\nt0fgVtQM5wKBgQCeU1wReYOSFx6pP40M6DQAvUD6ID41wqtfZhMQbcunNRZ7Zt/m\nd8QM1NJ6ghDth9iAyysOKIvX2CvpZw9U65NWHTvGi1CHyl1eMt3KLrfLIPRV3Qsb\nmerEem6Wnh5jvkfx6TDGoHk/DLUmwSpstaMhfmQ8e752Az0tQQxc0NBb8QKBgGN2\n/61c5oNT3hTJdwz7JiyrZp/An3fxNJVaX2rskD37nQWzZHbWUIqi8fczSuxFiu4Z\nfmI/Tvye0uV0EZyfZN7I1xn7ZeSkqywFuvI7zUWjvmYk2xI4tXMrbqHIcwWz5+VS\nBZk4tIWEhW6gEdPCCmKaGbfRH9ElZ3sJnxLVIfqRAoGAWegVwIm8b3NSeSTYH69N\neZfB56WaaFDTZ9EOYyPVTwZa6Zk81sb+3fGSsI7ECofGG6TzenSOkUeZFacM+4Bj\njLdiuC01VM4hmCxH0xthij8A+a97AfE7zk4Xq0pWJc4mpOxwyaIOEOtnt/jTNFQC\nJpQcFiLuSLOGgJg8cI3f2jk=\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@confirmit-8e623.iam.gserviceaccount.com

# Cloudinary (same as backend)
CLOUDINARY_URL=cloudinary://243879246376513:cxL9Yd6sm1FTfMxs5GeeDRYDWl0@dlmrufbme

# Model Configuration
DEFAULT_MODEL=gemini-2.0-flash-exp
MAX_CONCURRENT_AGENTS=5
AGENT_TIMEOUT_SECONDS=30

# Forensics
ELA_QUALITY=95
FORENSIC_THRESHOLD=0.7
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 10-15 minutes (AI service has more dependencies)
3. You'll get a URL like: `https://confirmit-ai-service.onrender.com`

### Step 5: Test AI Service
```bash
# Health check
curl https://confirmit-ai-service.onrender.com/health

# Expected response
{
  "status": "healthy",
  "service": "ConfirmIT AI Service",
  "version": "1.0.0",
  "agents": {
    "vision": "ready",
    "forensic": "ready",
    ...
  }
}
```

---

## 🔗 Part 3: Connect Services

### Update Backend with AI Service URL
1. Go to your NestJS service settings
2. Update `AI_SERVICE_URL` environment variable:
   ```
   AI_SERVICE_URL=https://confirmit-ai-service.onrender.com
   ```
3. Click **"Save Changes"** (auto-redeploys)

### Update Frontend Environment
Update your frontend `.env` file:
```bash
VITE_API_BASE_URL=https://confirmit-nest-api.onrender.com/api
VITE_WS_BASE_URL=https://confirmit-nest-api.onrender.com
```

---

## 🎨 Part 4: Deploy Frontend (Lovable)

Your React frontend is already hosted on Lovable! But you need to update API URLs:

1. Update `.env` file with production backend URLs
2. Lovable will auto-deploy
3. Your app will be live at: `https://your-project.lovable.app`

For custom domain:
1. Go to Lovable Settings → Custom Domain
2. Add `confirmit.africa` and `www.confirmit.africa`
3. Update DNS records as instructed

---

## ⚙️ Important Configuration Notes

### Docker Build Issues?
If build fails, check:
- ✅ Dockerfile is in the correct directory (`backend/` or `ai-service/`)
- ✅ Dependencies are correct in `package.json` / `requirements.txt`
- ✅ No syntax errors in code

### Service Sleeping (Free Plan)
⚠️ **Free tier services sleep after 15 minutes of inactivity!**
- First request takes ~30 seconds to wake up
- Upgrade to Starter plan ($7/month) for always-on

### Cost Estimate
- **NestJS Backend**: $7/month (Starter)
- **AI Service**: $7/month (Starter) - minimum!
- **Total**: $14/month + usage fees

### Performance Tips
1. **Use same region** for all services (reduces latency)
2. **Enable auto-deploy** from `main` branch
3. **Set up health checks** in Render dashboard
4. **Monitor logs** for errors

---

## 🚨 Troubleshooting

### Build Failed?
```bash
# Check logs in Render dashboard
# Common issues:
- Missing dependencies
- Wrong Node/Python version
- Environment variables not set
```

### 502 Bad Gateway?
- Service is still starting (wait 2-3 minutes)
- Check if PORT matches Dockerfile EXPOSE
- Verify health check endpoint works

### CORS Errors?
- Update `CORS_ORIGIN` in backend env
- Include both `https://confirmit.africa` and `https://www.confirmit.africa`

### WebSocket Connection Failed?
- Ensure `VITE_WS_BASE_URL` uses `https://` (not `wss://`)
- Socket.IO handles protocol upgrade automatically

---

## ✅ Final Checklist

- [ ] NestJS backend deployed and healthy
- [ ] FastAPI AI service deployed and healthy
- [ ] Backend `AI_SERVICE_URL` updated with AI service URL
- [ ] Frontend `.env` updated with backend URLs
- [ ] CORS configured correctly
- [ ] All environment variables set
- [ ] Health checks passing
- [ ] Test receipt upload flow end-to-end

---

## 🎉 Success!

Your ConfirmIT platform is now live in production!

**URLs:**
- Backend API: `https://confirmit-nest-api.onrender.com/api`
- AI Service: `https://confirmit-ai-service.onrender.com`
- Frontend: `https://confirmit.africa` (or Lovable URL)
- API Docs: `https://confirmit-nest-api.onrender.com/api/docs`

**Next Steps:**
1. Set up monitoring (Render provides basic metrics)
2. Configure alerts for downtime
3. Enable auto-deploy from GitHub
4. Set up custom domains
5. Submit to Hedera Hackathon! 🏆

---

**Need Help?**
- 📧 Render Support: https://render.com/docs
- 🔥 Firebase Console: https://console.firebase.google.com
- ☁️ Cloudinary Dashboard: https://cloudinary.com/console
- 🌐 Hedera Explorer: https://hashscan.io/testnet

**Good luck with the hackathon! 🚀✨**
