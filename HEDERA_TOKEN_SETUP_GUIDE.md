# Hedera NFT Token Setup Guide - Complete Step-by-Step

## 🎯 Problem
Your current token `0.0.7131340` was created **without a supply key**, which prevents minting new NFTs. You need to create a NEW token with supply key enabled.

---

## ✅ Option 1: Create Token Manually (Recommended for Beginners)

### Step 1: Go to Hedera Portal
1. Open your browser and go to: **https://hashscan.io/testnet**
2. Click on "Create Token" or visit: **https://testnet.mirrornode.hedera.com/api/v1/tokens**

### Step 2: Use Hedera SDK Portal (Alternative - Easier)
**The best way is using a JavaScript script (see Option 2 below)**. 

For manual creation via portal, you'll need to use Hedera's official tools, but they don't have a direct web UI. So we'll use a script instead.

---

## ✅ Option 2: Create Token via Script (RECOMMENDED)

### Step 1: Create the Token Creation Script

Create a new file: `backend/scripts/create-nft-token.js`

```javascript
const { 
  Client, 
  TokenCreateTransaction, 
  TokenType, 
  TokenSupplyType,
  PrivateKey,
  AccountId
} = require("@hashgraph/sdk");
require('dotenv').config();

async function createNFTToken() {
  console.log("🚀 Creating Hedera NFT Token for ConfirmIT...\n");

  // Initialize Hedera client
  const client = Client.forTestnet();
  const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
  
  client.setOperator(operatorId, operatorKey);

  console.log(`📋 Using Account: ${operatorId.toString()}`);
  console.log(`📋 Network: Testnet\n`);

  try {
    // Create the NFT token with supply key
    const transaction = new TokenCreateTransaction()
      .setTokenName("ConfirmIT Trust ID")
      .setTokenSymbol("CTID")
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(operatorId)
      .setSupplyKey(operatorKey) // ✅ THIS IS THE KEY FIX!
      .setAdminKey(operatorKey)  // Optional: Allows token management
      .setMaxTransactionFee(20); // 20 HBAR max fee

    console.log("⏳ Submitting token creation transaction...");
    
    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId;

    console.log("\n✅ SUCCESS! Token created:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🎫 Token ID: ${tokenId.toString()}`);
    console.log(`🔍 Explorer: https://hashscan.io/testnet/token/${tokenId.toString()}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    console.log("📝 NEXT STEPS:");
    console.log(`1. Copy this Token ID: ${tokenId.toString()}`);
    console.log(`2. Update backend/.env:`);
    console.log(`   HEDERA_TOKEN_ID=${tokenId.toString()}`);
    console.log(`3. Restart backend server`);
    console.log(`4. Test NFT minting by approving a business!\n`);

    client.close();
    return tokenId.toString();

  } catch (error) {
    console.error("\n❌ ERROR creating token:", error.message);
    console.error("Full error:", error);
    client.close();
    process.exit(1);
  }
}

// Run the script
createNFTToken();
```

### Step 2: Run the Script

Open terminal in your backend folder:

```bash
cd backend
node scripts/create-nft-token.js
```

### Step 3: Expected Output

You should see something like:

```
🚀 Creating Hedera NFT Token for ConfirmIT...

📋 Using Account: 0.0.7098369
📋 Network: Testnet

⏳ Submitting token creation transaction...

✅ SUCCESS! Token created:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 Token ID: 0.0.7234567
🔍 Explorer: https://hashscan.io/testnet/token/0.0.7234567
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 NEXT STEPS:
1. Copy this Token ID: 0.0.7234567
2. Update backend/.env:
   HEDERA_TOKEN_ID=0.0.7234567
3. Restart backend server
4. Test NFT minting by approving a business!
```

### Step 4: Update Your Backend .env

Open `backend/.env` and replace the old token ID:

```bash
# OLD (no supply key - doesn't work)
HEDERA_TOKEN_ID=0.0.7131340

# NEW (with supply key - works!)
HEDERA_TOKEN_ID=0.0.7234567  # Use YOUR new token ID from the script
```

### Step 5: Restart Backend Server

```bash
# Stop the current backend (Ctrl+C)
# Then restart:
npm run start:dev
```

---

## 🧪 Testing NFT Minting

### Test 1: Register a Business
1. Go to frontend: `http://localhost:8081/business/register`
2. Fill in business details
3. Complete payment via Paystack
4. You should be redirected to payment pending page

### Test 2: Approve Business & Mint NFT
1. Go to admin dashboard: `http://localhost:8081/admin`
2. Click "Approve & Mint NFT" on a pending business
3. Check backend logs - you should see:
   ```
   [HederaService] Minting Trust ID NFT for business: BIZ-XXX
   [HederaService] NFT metadata size: 62 bytes
   [HederaService] ✅ Trust ID NFT minted successfully!
   ```

### Test 3: Verify on HashScan
1. Copy the NFT serial number from backend logs
2. Go to: `https://hashscan.io/testnet/token/YOUR_TOKEN_ID`
3. You should see your minted NFT!

---

## 🔍 Troubleshooting

### Error: "Insufficient balance"
**Solution:** Fund your Hedera account with testnet HBAR:
- Go to: https://portal.hedera.com/faucet
- Enter your account ID: `0.0.7098369`
- Get free testnet HBAR

### Error: "Invalid key"
**Solution:** Double-check your `HEDERA_PRIVATE_KEY` in `.env` is correct.

### Error: "Transaction expired"
**Solution:** Your system clock might be wrong. Sync your computer's time.

---

## 📋 Summary - What Changed?

### Before (Broken)
```javascript
// Token created WITHOUT supply key
Token ID: 0.0.7131340
Supply Key: NONE ❌
Result: Cannot mint NFTs
```

### After (Working)
```javascript
// Token created WITH supply key
Token ID: 0.0.7234567 (your new one)
Supply Key: YOUR_PRIVATE_KEY ✅
Result: Can mint unlimited NFTs
```

---

## 🎯 The Key Difference

When creating a Hedera NFT token, you MUST specify `.setSupplyKey()`:

```javascript
// ❌ WRONG - No supply key
const transaction = new TokenCreateTransaction()
  .setTokenName("ConfirmIT Trust ID")
  .setTokenType(TokenType.NonFungibleUnique);

// ✅ CORRECT - With supply key
const transaction = new TokenCreateTransaction()
  .setTokenName("ConfirmIT Trust ID")
  .setTokenType(TokenType.NonFungibleUnique)
  .setSupplyKey(operatorKey); // This line is critical!
```

---

## ✅ Final Checklist

- [ ] Run `node scripts/create-nft-token.js`
- [ ] Copy new token ID (e.g., `0.0.7234567`)
- [ ] Update `backend/.env` with new `HEDERA_TOKEN_ID`
- [ ] Restart backend server
- [ ] Test business registration
- [ ] Test business approval & NFT minting
- [ ] Verify NFT on HashScan explorer
- [ ] Celebrate! 🎉

---

**Need help?** Drop a message and I'll guide you through any step!

May Allah grant you success! 🚀
