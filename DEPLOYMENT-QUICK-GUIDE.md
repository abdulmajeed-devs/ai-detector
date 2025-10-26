# 🚀 Quick Deployment Guide - Updated Security

## For Production VPS (138.197.80.103)

### Step 1: Create Production Environment File

SSH into your VPS and create the environment file:

```bash
cd /var/www/ai-content-detector
nano .env.production
```

### Step 2: Add Configuration

Paste this (replace `yourdomain.com` with your actual domain):

```bash
# ZeroGPT API
ZEROGPT_API_KEY=your_actual_zerogpt_api_key_here
ZEROGPT_BASE_URL=https://api.zerogpt.com

# Security - ENABLE for production!
DOMAIN_VALIDATION_ENABLED=true
ALLOWED_DOMAINS=yourdomain.com,www.yourdomain.com
SERVER_IP=138.197.80.103

# Application
NEXT_PUBLIC_APP_NAME="AI Content Detector"
NEXT_PUBLIC_APP_URL=https://yourdomain.com
MAX_TEXT_CHARS=50000
RATE_LIMIT_DETECT=10
CACHE_TTL_SECONDS=86400
NODE_ENV=production
```

**Important:** Replace:
- `your_actual_zerogpt_api_key_here` → Your real ZeroGPT API key
- `yourdomain.com` → Your actual domain name

### Step 3: Deploy

```bash
# Pull latest code
git pull

# Install dependencies (if needed)
npm install

# Build
npm run build

# Restart
pm2 restart ai-detector

# Check logs
pm2 logs ai-detector
```

### Step 4: Verify

**Test from browser (should work):**
- Visit `https://yourdomain.com`
- Paste text and click "Detect AI Content"
- ✅ Should work perfectly!

**Test direct API call (should fail):**
```bash
curl -X POST https://yourdomain.com/api/detect \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
```
- ❌ Should get "Access denied" message

---

## For Local Development

### Your `.env.local` file should have:

```bash
ZEROGPT_API_KEY=your_api_key_here
ZEROGPT_BASE_URL=https://api.zerogpt.com

# Disable validation for local testing
DOMAIN_VALIDATION_ENABLED=false
ALLOWED_DOMAINS=localhost:3000
SERVER_IP=138.197.80.103

NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_TEXT_CHARS=50000
```

---

## What Changed?

### Old System ❌
- Checked visitor's IP address
- Blocked legitimate users
- Confused user IPs with server IPs

### New System ✅
- Checks request origin (domain)
- Allows all legitimate users
- Protects API from external access
- Only processes requests from your domain

---

## Key Points

1. **Your VPS IP (138.197.80.103):**
   - This is where your Next.js app runs
   - All ZeroGPT API calls come from this IP
   - Users can have ANY IP address

2. **Domain Validation:**
   - Development: `DOMAIN_VALIDATION_ENABLED=false`
   - Production: `DOMAIN_VALIDATION_ENABLED=true`

3. **User Access:**
   - ✅ Users can visit from anywhere
   - ✅ Users can have any IP address
   - ✅ Only requests from your domain are processed
   - ❌ External tools/websites can't use your API

---

## Troubleshooting

### Users getting "Access denied"?

1. Check allowed domains in `.env.production`:
   ```bash
   ALLOWED_DOMAINS=yourdomain.com,www.yourdomain.com
   ```

2. Include all variations (www, non-www)

3. Restart the app:
   ```bash
   pm2 restart ai-detector
   ```

### Need to test without domain validation?

Temporarily disable in production:
```bash
DOMAIN_VALIDATION_ENABLED=false
```

Then rebuild and restart.

---

## Security Layers Now Active

1. ✅ **Domain Validation** - Only your domain can make requests
2. ✅ **API Key Protection** - Never exposed to browsers
3. ✅ **Rate Limiting** - 10 requests/minute per IP
4. ✅ **Input Validation** - Character limits, sanitization

---

**Your API is now properly secured! 🔒**

Users worldwide can access your website, but only requests from YOUR domain are processed.
