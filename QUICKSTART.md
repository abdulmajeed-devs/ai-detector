# Quick Start Guide

## For Development (Local Testing)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Edit .env.local and add your ZeroGPT API key
# The file already exists - just open it and update:
nano .env.local

# Or use any text editor
code .env.local
```

Add your API key:
```bash
ZEROGPT_API_KEY=your_actual_api_key_here
ZEROGPT_BASE_URL=https://api.zerogpt.com
IP_WHITELIST_ENABLED=false  # Keep false for development
MAX_TEXT_CHARS=50000
```

### Step 3: Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### Step 4: Test the Application
1. Open http://localhost:3000
2. Paste some text into the input field
3. Click "Detect AI Content"
4. Results should appear below

---

## For Production (Server Deployment)

### Prerequisites
- A VPS server (DigitalOcean, AWS EC2, Linode, etc.)
- Domain name pointed to your server
- Node.js 18+ installed
- PM2 installed: `sudo npm install -g pm2`

### Quick Deploy
```bash
# On your server
cd /var/www
git clone <your-repo-url> ai-detector
cd ai-detector
npm install

# Create production environment
nano .env.production
# Add:
# ZEROGPT_API_KEY=your_key
# IP_WHITELIST_ENABLED=true
# WHITELISTED_IPS=your_server_ip

# Build and start
npm run build
pm2 start npm --name "ai-detector" -- start
pm2 save
pm2 startup
```

**For complete deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**

---

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Check code quality
```

### Production (with PM2)
```bash
pm2 status           # Check application status
pm2 logs ai-detector # View logs
pm2 restart ai-detector  # Restart application
pm2 stop ai-detector     # Stop application
```

---

## Troubleshooting

### "Cannot find module" Error
```bash
rm -rf node_modules package-lock.json
npm install
```

### "API authentication failed"
- Check your API key in `.env.local` or `.env.production`
- Ensure there are no extra spaces or quotes

### "Access denied. Your IP is not authorized"
- **Development**: Set `IP_WHITELIST_ENABLED=false` in `.env.local`
- **Production**: Add your server IP to `WHITELISTED_IPS`

### Build Fails
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

---

## File Structure

```
ai-content-detector/
├── src/app/           # Pages and API routes
├── src/components/    # React components
├── src/lib/           # Utilities and services
├── src/types/         # TypeScript types
├── .env.local         # Development environment ← ADD YOUR KEY HERE
├── package.json       # Dependencies
└── README.md          # Full documentation
```

---

## Important Files

- **`.env.local`** - Your development environment (add API key here)
- **`README.md`** - Complete documentation
- **`DEPLOYMENT.md`** - Production deployment guide
- **`FIXES-SUMMARY.md`** - Code review fixes summary

---

## Getting Your ZeroGPT API Key

1. Visit [ZeroGPT Business](https://www.zerogpt.com)
2. Sign up for a business account
3. Go to API section in dashboard
4. Copy your API key
5. Paste it into `.env.local`

---

## Support

- **Documentation**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Check logs with `pm2 logs ai-detector` (production) or browser console (development)

---

**Ready to start? Run `npm run dev` and visit http://localhost:3000** 🚀
