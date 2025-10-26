# 🔒 Security Update - Domain-Based API Protection

## What Changed?

Your IP whitelist system has been **completely redesigned** to properly protect your ZeroGPT API key while allowing all legitimate users to access your website.

---

## ❌ Old System (BROKEN)

### The Problem:
```
User visits your website (Friend's IP: 203.0.113.45)
    ↓
Submits text for AI detection
    ↓
Your API checks: "Is 203.0.113.45 in whitelist?"
    ↓
❌ REJECTED - Friend can't use your website!
```

**Why it was wrong:**
- Blocked legitimate users (your friends, visitors)
- Confused **user IPs** with **server IPs**
- Made your website unusable for anyone except whitelisted IPs

---

## ✅ New System (CORRECT)

### How It Works Now:

```
User visits yourdomain.com (ANY IP - doesn't matter!)
    ↓
Submits text for AI detection
    ↓
Browser sends request to: https://yourdomain.com/api/detect
    ↓
Your Next.js API checks: "Does this request come from MY domain?"
    ↓
✅ YES - Request is from yourdomain.com
    ↓
Next.js API (running on VPS 138.197.80.103) calls ZeroGPT
    ↓
ZeroGPT sees request from: 138.197.80.103 (your server IP)
    ↓
✅ SUCCESS - User gets results!
```

---

## 🎯 What We Actually Protect

### ✅ What IS Protected:
1. **Your ZeroGPT API Key** - Never exposed to browsers
2. **Your API Routes** - Only accept requests from your domain
3. **Direct API Access** - Blocks external tools from calling your `/api/detect` endpoint
4. **Rate Limiting** - Per-IP limits prevent spam (but doesn't block users)

### ❌ What We DON'T Check:
1. **User's Home IP** - Irrelevant! Users can have any IP address
2. **Visitor Location** - Doesn't matter where they're visiting from

---

## 🔧 Technical Changes

### File: `src/lib/ip-whitelist.ts`

#### **Before (Wrong):**
```typescript
// Checked USER's IP address ❌
const clientIP = extractClientIP(request);
if (!WHITELISTED_IPS.includes(clientIP)) {
  return "Access denied. Your IP is not authorized";
}
```

#### **After (Correct):**
```typescript
// Checks request ORIGIN (your domain) ✅
const origin = extractRequestOrigin(request);
if (!isOriginAllowed(origin)) {
  return "Access denied. Must come from authorized domain";
}
```

---

## 📋 New Environment Variables

### Development (`.env.local`):
```bash
# Domain validation disabled for local testing
DOMAIN_VALIDATION_ENABLED=false
ALLOWED_DOMAINS=localhost:3000
SERVER_IP=138.197.80.103
```

### Production (`.env.production` on VPS):
```bash
# Domain validation ENABLED - protects your API key!
DOMAIN_VALIDATION_ENABLED=true
ALLOWED_DOMAINS=yourdomain.com,www.yourdomain.com
SERVER_IP=138.197.80.103
```

---

## 🚀 Deployment Steps

### On Your VPS (138.197.80.103):

1. **Create production environment file:**
```bash
cd /var/www/ai-content-detector
nano .env.production
```

2. **Add your configuration:**
```bash
ZEROGPT_API_KEY=your_actual_api_key_here
ZEROGPT_BASE_URL=https://api.zerogpt.com

DOMAIN_VALIDATION_ENABLED=true
ALLOWED_DOMAINS=yourdomain.com,www.yourdomain.com
SERVER_IP=138.197.80.103

NEXT_PUBLIC_APP_URL=https://yourdomain.com
MAX_TEXT_CHARS=50000
RATE_LIMIT_DETECT=10
CACHE_TTL_SECONDS=86400
NODE_ENV=production
```

3. **Replace `yourdomain.com` with your actual domain!**

4. **Rebuild and restart:**
```bash
npm run build
pm2 restart ai-detector
```

---

## 🧪 How to Test

### Test 1: Normal User Access (Should Work ✅)
```bash
# Visit your website normally
https://yourdomain.com

# Paste text and click "Detect AI Content"
# ✅ Should work perfectly!
```

### Test 2: Direct API Call (Should Fail ❌)
```bash
# Try calling API directly from terminal
curl -X POST https://yourdomain.com/api/detect \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'

# ❌ Should get: "Access denied. Must come from authorized domain"
```

### Test 3: From Different Website (Should Fail ❌)
```bash
# Someone tries to call your API from their website
# ❌ Should be blocked because origin doesn't match your domain
```

---

## 🛡️ Security Layers

Your application now has **multiple security layers**:

### Layer 1: Domain Validation (NEW!)
- ✅ Ensures requests come from your domain
- ✅ Blocks external websites from using your API
- ✅ Prevents direct API calls from tools/scripts

### Layer 2: API Key Protection (Already Had)
- ✅ ZeroGPT API key stays server-side only
- ✅ Never exposed to browsers or client code

### Layer 3: Rate Limiting (Already Had)
- ✅ 10 requests per minute per IP
- ✅ Prevents spam and abuse
- ✅ Doesn't block legitimate users, just slows down abusers

### Layer 4: Input Validation (Already Had)
- ✅ Character limits (50,000 max)
- ✅ Text sanitization
- ✅ Error handling

---

## 🔍 Understanding the Flow

### Development (Local):
```
Your Computer
    ↓
http://localhost:3000
    ↓
Domain validation: DISABLED
    ↓
All requests allowed (for testing)
```

### Production (VPS):
```
User Browser (ANY location)
    ↓
https://yourdomain.com (hosted on 138.197.80.103)
    ↓
Domain validation: ENABLED
    ↓
Check: Does Origin header = yourdomain.com?
    ↓
✅ YES → Process request
    ↓
Next.js API on VPS calls ZeroGPT
    ↓
ZeroGPT sees: Request from 138.197.80.103
```

---

## 📊 What Your VPS IP (138.197.80.103) Does

### Your VPS IP is used for:
1. ✅ **ZeroGPT API calls** - All requests to ZeroGPT come from this IP
2. ✅ **Environment reference** - Documented in your config
3. ✅ **Optional ZeroGPT IP whitelisting** - Some providers allow this

### Your VPS IP is NOT used for:
❌ Blocking user access (users can have any IP!)
❌ Validating visitors (domain validation handles this)

---

## 🎓 Key Concepts

### Origin/Referer Headers:
```
When browser makes request, it includes:
Origin: https://yourdomain.com
Referer: https://yourdomain.com/
```

These headers tell your API: "This request came from YOUR website"

### Why This Works:
- Browsers automatically send Origin/Referer
- Direct API calls (curl, Postman) won't have these headers
- External websites will send THEIR domain, not yours
- Your code checks: "Is this my domain?" → Approve/Reject

---

## 🐛 Troubleshooting

### Problem: "Access denied" for legitimate users

**Solution:**
1. Check `.env.production` has correct domain:
   ```bash
   ALLOWED_DOMAINS=yourdomain.com,www.yourdomain.com
   ```

2. Include all domain variations (www, non-www)

3. For testing, temporarily disable:
   ```bash
   DOMAIN_VALIDATION_ENABLED=false
   ```

### Problem: API still accessible from external tools

**Solution:**
1. Verify environment variable is set:
   ```bash
   DOMAIN_VALIDATION_ENABLED=true
   ```

2. Restart your application:
   ```bash
   pm2 restart ai-detector
   ```

3. Check logs:
   ```bash
   pm2 logs ai-detector
   ```

---

## 📝 Summary

### Before Update:
- ❌ Blocked legitimate users based on their IP
- ❌ Confused user IPs with server IPs
- ❌ Made website unusable for visitors

### After Update:
- ✅ All legitimate users can access your website
- ✅ API key protected from external access
- ✅ Only requests from your domain are processed
- ✅ Rate limiting prevents abuse
- ✅ Users can visit from anywhere in the world

### Your Server (138.197.80.103):
- ✅ Runs your Next.js application
- ✅ Makes all ZeroGPT API calls
- ✅ ZeroGPT only sees requests from this IP

---

## 🎯 Final Checklist

Before deploying to production:

- [ ] Created `.env.production` on VPS
- [ ] Set `DOMAIN_VALIDATION_ENABLED=true`
- [ ] Added your actual domain to `ALLOWED_DOMAINS`
- [ ] Added your ZeroGPT API key
- [ ] Set `SERVER_IP=138.197.80.103`
- [ ] Ran `npm run build`
- [ ] Restarted with `pm2 restart ai-detector`
- [ ] Tested from browser (should work!)
- [ ] Tested direct API call with curl (should fail!)

---

**Your API is now properly protected! 🎉**

Users can visit from anywhere, but only requests from YOUR domain are processed.
