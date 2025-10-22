# AI Content Detector# 🤖 AI Content Detector



A production-ready Next.js application for detecting AI-generated content using the ZeroGPT Business API.> A production-ready Next.js application for detecting AI-generated content and checking plagiarism using ZeroGPT Business API



## Quick Start[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)

```bash[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

# 1. Clone and install

git clone <your-repo-url>---

cd ai-content-detector

npm install## 🚀 Quick Start



# 2. Configure environment```bash

cp .env.local.template .env.local# 1. Clone and install

# Edit .env.local and add your ZEROGPT_API_KEYgit clone <your-repo-url>

cd ai-content-detector

# 3. Run development servernpm install

npm run dev

# 2. Configure environment

# 4. Open http://localhost:3000cp .env.example .env.local

```# Edit .env.local and add your ZEROGPT_API_KEY



## Features# 3. Run development server

npm run dev

- Real-time AI detection analysis (0-100% probability)

- Sentence-by-sentence analysis with visual highlighting# 4. Open http://localhost:3000

- Confidence scoring (High/Medium/Low)```

- Supports up to 50,000 characters

- IP Whitelist security for production---

- Detailed word-level statistics

## ✨ Features

## Environment Setup

### 🤖 AI Content Detection

Create `.env.local` for development:- Sentence-level AI probability analysis

- Real-time character/word counting

```bash- Confidence scoring (High/Medium/Low)

# ZeroGPT API (Get your key from ZeroGPT Business Dashboard)- Color-coded sentence highlighting

ZEROGPT_API_KEY=your_api_key_here- 24-hour intelligent caching

ZEROGPT_BASE_URL=https://api.zerogpt.com

### 📋 Plagiarism Checking

# Security (set to true in production)- Search billions of indexed web pages

IP_WHITELIST_ENABLED=false- Source attribution with URLs

WHITELISTED_IPS=your_production_server_ip- Similarity scoring (0-100%)

- Multiple source identification

# Limits- Minimum 300 words required

MAX_TEXT_CHARS=50000

```### 🔒 Enterprise Security

- ✅ IP Whitelist Protection (production-only)

**IMPORTANT**: Never commit `.env.local` or `.env.production` to git!- ✅ Rate Limiting (10/min detection, 5/min plagiarism)

- ✅ API Key Protection (server-side only)

## Production Deployment- ✅ HTTPS Encryption

- ✅ Security Logging

### VPS Deployment (DigitalOcean, AWS, Linode, etc.)- ✅ Input Validation



```bash---

# 1. SSH into your server

ssh root@your-server-ip## 📁 Project Structure



# 2. Install Node.js 18+```

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -ai-content-detector/

sudo apt install -y nodejs├── src/

│   ├── app/                    # Next.js App Router

# 3. Install PM2│   │   ├── api/

sudo npm install -g pm2│   │   │   ├── detect/        # AI detection endpoint

│   │   │   └── plagiarism/    # Plagiarism endpoint

# 4. Clone and setup│   │   ├── detector/          # AI detection page

cd /var/www│   │   ├── plagiarism/        # Plagiarism checker page

git clone <your-repo-url> ai-detector│   │   ├── privacy/           # Privacy policy

cd ai-detector│   │   ├── terms/             # Terms of service

npm install│   │   ├── layout.tsx         # Root layout

│   │   └── page.tsx           # Landing page

# 5. Create production environment│   ├── components/            # React components

nano .env.production│   ├── lib/                   # Services & utilities

# Add:│   │   ├── ip-whitelist.ts   # IP security

# ZEROGPT_API_KEY=your_key│   │   └── zerogpt.service.ts # API integration

# IP_WHITELIST_ENABLED=true│   └── types/                 # TypeScript types

# WHITELISTED_IPS=your_server_ip├── public/                    # Static assets

├── .env.example              # Environment template

# 6. Build and start├── package.json              # Dependencies

npm run build└── README.md                 # This file

pm2 start npm --name "ai-detector" -- start```

pm2 save

pm2 startup---

```

## ⚙️ Configuration

### Nginx Configuration (Optional)

### Environment Variables

```nginx

server {Create `.env.local` for development:

    listen 80;

    server_name yourdomain.com;```bash

# ZeroGPT API Configuration (REQUIRED)

    location / {ZEROGPT_API_KEY=your-api-key-here

        proxy_pass http://localhost:3000;ZEROGPT_BASE_URL=https://api.zerogpt.com

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;# Application Configuration

        proxy_set_header Connection 'upgrade';NEXT_PUBLIC_APP_NAME="AI Content Detector"

        proxy_set_header Host $host;NEXT_PUBLIC_APP_URL=http://localhost:3000

        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;# Security (Production Only)

        proxy_cache_bypass $http_upgrade;WHITELISTED_IPS=your-server-ip-here

    }IP_WHITELIST_ENABLED=false  # Set to 'true' in production

}

```# Rate Limiting (requests per minute)

RATE_LIMIT_DETECT=10

### SSL Certificate (Free)RATE_LIMIT_PLAGIARISM=5



```bash# Caching (seconds)

sudo apt install certbot python3-certbot-nginx -yCACHE_TTL_SECONDS=86400  # 24 hours

sudo certbot --nginx -d yourdomain.com

```# Content Limits

MAX_TEXT_CHARS=50000

## API EndpointMIN_PLAGIARISM_WORDS=300

```

### POST /api/detect

### Important Notes:

**Request:**- **NEVER commit `.env.local` or `.env.production`** - They contain your API key!

```json- **Always use `.env.example`** as a template

{- **IP Whitelist MUST be enabled** in production (`IP_WHITELIST_ENABLED=true`)

  "text": "Your text to analyze..."

}---

```

## 🔒 Security Configuration

**Response:**

```json### IP Whitelist Setup (Production)

{

  "success": true,The application uses IP whitelisting to ensure only your server can access the ZeroGPT API.

  "data": {

    "verdict": "AI",**Why?** Even if someone discovers your API endpoint, they cannot use it unless their request comes from your whitelisted IP.

    "aiProbability": 85.5,

    "confidence": "High",#### Step 1: Get Your Server IP

    "totalWords": 150,```bash

    "aiWords": 128,# On your server, run:

    "humanWords": 22,curl ifconfig.me

    "sentences": [...],```

    "highlightedSentences": [...],

    "checkedAt": "2025-10-22T12:00:00.000Z"#### Step 2: Configure Environment

  }```bash

}# In .env.production

```WHITELISTED_IPS=138.197.80.103  # Your server IP

IP_WHITELIST_ENABLED=true        # MUST be true in production

## Testing```



```bash#### Step 3: For Multiple IPs

# Run tests```bash

npm test# Comma-separated list

WHITELISTED_IPS=138.197.80.103,192.168.1.50,10.0.0.1

# With coverage```

npm run test:coverage

```#### Development Mode

```bash

## Troubleshooting# In .env.local (development only!)

IP_WHITELIST_ENABLED=false  # Disables whitelist for local testing

**"Access denied. Your IP is not authorized"**```

- Development: Set `IP_WHITELIST_ENABLED=false` in `.env.local`

- Production: Add your server IP to `WHITELISTED_IPS`---



**"API authentication failed"**## 🚀 Deployment

- Check your `ZEROGPT_API_KEY` is correct

### Option 1: VPS Deployment (Recommended)

**Build fails**

```bash**Supported**: DigitalOcean, AWS EC2, Linode, Vultr

rm -rf node_modules package-lock.json .next

npm install#### Quick Deploy Script

npm run build```bash

```# SSH into your server

ssh root@your-server-ip

## Technology Stack

# Install Node.js 18+

- Next.js 14.2 (App Router)curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

- TypeScript 5.4sudo apt install -y nodejs

- TailwindCSS 3.4

- ZeroGPT Business API# Install PM2

- Jest Testingsudo npm install -g pm2



## License# Clone and setup

cd /var/www

MIT Licensegit clone <your-repo-url> ai-detector

cd ai-detector

## Supportnpm install



- [Next.js Docs](https://nextjs.org/docs)# Create production environment file

- [ZeroGPT API Docs](https://app.theneo.io/olive-works-llc/zerogpt-docs)cp .env.example .env.production

nano .env.production
# Add your API key and server IP

# Build and start
npm run build
pm2 start npm --name "ai-detector" -- start
pm2 save
pm2 startup
```

#### Configure Nginx
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/ai-detector
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        
        # CRITICAL: Pass real client IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/ai-detector /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Install SSL (Free)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Vercel Deployment (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel
```

**Important**: Add all environment variables in Vercel Dashboard → Settings → Environment Variables

---

## 🧪 Testing

### Test IP Whitelist (Manual)
```bash
npm run test:whitelist
```

### Unit Tests (Jest)
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## 📝 API Documentation

### POST /api/detect

**AI Content Detection**

**Request:**
```json
{
  "text": "Your text here..."
}
```

**Response:**
```json
{
  "success": true,
  "source": "provider",
  "data": {
    "verdict": "AI",
    "aiProbability": 85.5,
    "confidence": "High",
    "feedback": "Your text is most likely written by AI...",
    "totalWords": 150,
    "aiWords": 128,
    "humanWords": 22,
    "sentences": [...],
    "checkedAt": "2025-10-20T12:00:00.000Z"
  }
}
```

### POST /api/plagiarism

**Plagiarism Checking**

**Request:**
```json
{
  "text": "Your text here (minimum 300 words)..."
}
```

**Response:**
```json
{
  "success": true,
  "source": "provider",
  "data": {
    "plagiarismScore": 45.5,
    "verdict": "Suspicious",
    "feedback": "Moderate similarity detected...",
    "totalWords": 350,
    "sources": [
      {
        "url": "https://example.com",
        "similarity": 45.5,
        "snippet": "Matched text..."
      }
    ],
    "totalSourcesFound": 3
  }
}
```

### Error Responses

**403 Forbidden** - IP not whitelisted:
```json
{
  "success": false,
  "error": "Access denied. Your IP (x.x.x.x) is not authorized."
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

---

## 🛠 Technology Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React 0.400
- **HTTP Client**: Axios 1.7
- **Testing**: Jest + ts-jest
- **API**: ZeroGPT Business API

---

## 🐛 Troubleshooting

### "API authentication failed"
**Solution**: Check your `ZEROGPT_API_KEY` in `.env.local` or `.env.production`

### "Access denied. Your IP is not authorized"
**Solution**: 
- **Development**: Set `IP_WHITELIST_ENABLED=false` in `.env.local`
- **Production**: Add your server IP to `WHITELISTED_IPS`

### "Rate limit exceeded"
**Solution**: Wait 60 seconds or increase limits in environment variables

### Build fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status
pm2 restart ai-detector
sudo systemctl restart nginx
```

---

## 📊 Performance

### Current Metrics
- **Page Load**: < 1s (first load)
- **API Response**: 1-3s (provider), < 100ms (cached)
- **Memory Usage**: ~150-200MB
- **Cache Hit Rate**: 30-50%

### Optimization Features
- ✅ 24-hour intelligent caching
- ✅ Rate limiting per IP
- ✅ Next.js automatic code splitting
- ✅ Gzip compression
- ✅ Server-side rendering

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Credits

- **Next.js** - React Framework
- **ZeroGPT** - AI Detection API
- **TailwindCSS** - CSS Framework
- **Lucide** - Icon Library

---

## 📞 Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [ZeroGPT API Docs](https://app.theneo.io/olive-works-llc/zerogpt-docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Getting Help
1. Check [Troubleshooting](#-troubleshooting) section
2. Review environment variables
3. Check logs: `pm2 logs ai-detector`
4. Test endpoints with cURL

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Current)
- [x] AI detection
- [x] Plagiarism checking
- [x] IP whitelist security
- [x] Rate limiting
- [x] Caching
- [x] Complete documentation

### 📋 Phase 2: Enhanced Features
- [ ] User authentication
- [ ] Usage dashboard
- [ ] Historical tracking
- [ ] PDF export
- [ ] File upload (.txt, .docx, .pdf)
- [ ] Batch processing

### 🚀 Phase 3: Scalability
- [ ] Redis caching
- [ ] PostgreSQL database
- [ ] User quotas
- [ ] Admin dashboard
- [ ] Advanced analytics

---

**Built with ❤️ using Next.js and TypeScript**
