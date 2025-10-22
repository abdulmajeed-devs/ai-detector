# Production Deployment Guide

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] You have a ZeroGPT Business API key
- [ ] You have a VPS or cloud server (DigitalOcean, AWS EC2, Linode, etc.)
- [ ] Your domain DNS is pointed to your server IP
- [ ] Node.js 18+ is installed on the server
- [ ] You have root/sudo access to the server

## Step-by-Step Deployment

### 1. Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (web server)
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Clone Your Application

```bash
# Create app directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository (replace with your repo URL)
sudo git clone https://github.com/yourusername/ai-content-detector.git
cd ai-content-detector

# Install dependencies
npm install
```

### 3. Configure Environment Variables

```bash
# Create production environment file
nano .env.production
```

Add the following (replace with your actual values):

```bash
# ZeroGPT API Configuration
ZEROGPT_API_KEY=your_actual_zerogpt_api_key_here
ZEROGPT_BASE_URL=https://api.zerogpt.com

# Security - MUST BE ENABLED IN PRODUCTION
IP_WHITELIST_ENABLED=true
WHITELISTED_IPS=YOUR_SERVER_IP_HERE

# Application Configuration
MAX_TEXT_CHARS=50000
NEXT_PUBLIC_APP_NAME="AI Content Detector"
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**To get your server IP:**
```bash
curl ifconfig.me
```

### 4. Build the Application

```bash
# Build for production
npm run build

# Test the build locally
npm start
# Visit http://your-server-ip:3000 to test
# Press Ctrl+C to stop
```

### 5. Configure PM2

```bash
# Start application with PM2
pm2 start npm --name "ai-detector" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs

# Check status
pm2 status

# View logs
pm2 logs ai-detector
```

### 6. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ai-detector
```

Add this configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        
        # CRITICAL: These headers pass the real client IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/ai-detector /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx
```

### 7. Install SSL Certificate (Free)

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Post-Deployment

### Verify Deployment

1. Visit `https://yourdomain.com` - should show your app
2. Test AI detection with some text
3. Check PM2 logs for errors: `pm2 logs ai-detector`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Common PM2 Commands

```bash
# View status
pm2 status

# View logs (real-time)
pm2 logs ai-detector

# View error logs only
pm2 logs ai-detector --err

# Restart application
pm2 restart ai-detector

# Stop application
pm2 stop ai-detector

# Delete from PM2
pm2 delete ai-detector

# Monitor resources
pm2 monit
```

### Update Your Application

```bash
# Navigate to app directory
cd /var/www/ai-content-detector

# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart ai-detector

# Check logs
pm2 logs ai-detector --lines 50
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs ai-detector --err

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart ai-detector
```

### Nginx 502 Bad Gateway

```bash
# Check if app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart ai-detector
sudo systemctl restart nginx
```

### "Access denied" Error

This means IP whitelist is blocking requests:

```bash
# Get your server's public IP
curl ifconfig.me

# Update .env.production with this IP
nano .env.production
# Set: WHITELISTED_IPS=your_server_ip

# Rebuild and restart
npm run build
pm2 restart ai-detector
```

### SSL Certificate Issues

```bash
# Renew manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

## Monitoring

### Set Up Log Rotation

PM2 automatically rotates logs, but you can configure it:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Monitor Resources

```bash
# Real-time monitoring
pm2 monit

# System resources
htop

# Disk usage
df -h

# Memory usage
free -h
```

## Backup

### Backup Environment File

```bash
# Create backup directory
mkdir -p ~/backups

# Backup .env.production
cp /var/www/ai-content-detector/.env.production ~/backups/env-$(date +%Y%m%d).production
```

### Database Backup (If Added Later)

```bash
# Example for PostgreSQL (for future)
pg_dump ai_detector > ~/backups/db-$(date +%Y%m%d).sql
```

## Security Best Practices

1. **Never commit `.env.production`** to git
2. **Always use HTTPS** in production (Let's Encrypt is free)
3. **Keep IP whitelist enabled** in production
4. **Regularly update dependencies**: `npm audit fix`
5. **Monitor logs** for suspicious activity
6. **Set up automated backups**
7. **Use strong server passwords**
8. **Enable UFW firewall**

## Performance Optimization

### Enable Gzip Compression

Add to Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### Configure PM2 for Cluster Mode

```bash
# Stop current process
pm2 delete ai-detector

# Start in cluster mode (uses all CPU cores)
pm2 start npm --name "ai-detector" -i max -- start

# Save configuration
pm2 save
```

## Cost Estimates

### VPS Hosting
- **DigitalOcean**: $6-12/month (basic droplet)
- **Linode**: $5-10/month
- **AWS EC2**: $5-15/month (t2.micro/t3.micro)

### Domain & SSL
- **Domain**: $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)

### ZeroGPT API
- Check ZeroGPT pricing based on your usage

## Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs ai-detector`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables in `.env.production`
4. Test API key: Visit ZeroGPT dashboard
5. Check server IP is whitelisted

---

**Congratulations! Your AI Content Detector is now live in production!** 🎉
