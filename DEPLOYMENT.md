# Deployment Guide

## Pre-Deployment Checklist

- [ ] Test locally: `npm run dev`
- [ ] Run linter: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Review environment variables (if any)
- [ ] Update branding in `components/layout/header.tsx`
- [ ] Customize theme in `app/globals.css` (optional)

## Deployment Options

### Option 1: Vercel (Easiest)

**Perfect for**: Quick deployment, zero configuration

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

**Pros**:
- Zero configuration
- Automatic HTTPS
- Edge network CDN
- Preview deployments

**Cons**:
- Requires Vercel account

### Option 2: Docker (Recommended for Self-Hosting)

**Perfect for**: Full control, self-hosting, VPS deployment

```bash
# Build image
docker build -t it-multitool .

# Run container
docker run -d \
  --name it-multitool \
  -p 3000:3000 \
  --restart unless-stopped \
  it-multitool
```

Or with Docker Compose:

```bash
docker-compose up -d
```

**Pros**:
- Consistent environment
- Easy to deploy anywhere
- Isolated from host system

**Cons**:
- Requires Docker knowledge

### Option 3: Traditional VPS (Node.js)

**Perfect for**: VPS, dedicated server, Fedora server

```bash
# On your server
git clone <your-repo>
cd tools-hofflabs
npm install
npm run build

# Using PM2 for process management
npm install -g pm2
pm2 start npm --name "it-multitool" -- start
pm2 save
pm2 startup  # Follow instructions
```

**Pros**:
- Direct control
- No Docker required
- Can use system package manager

**Cons**:
- More manual setup
- Need to manage Node.js version

### Option 4: Static Export

**Perfect for**: CDN deployment, static hosting (Netlify, Cloudflare Pages)

```bash
# 1. Update next.config.ts
# Change: output: "standalone"
# To: output: "export"

# 2. Build
npm run build

# 3. Deploy the 'out' directory
```

**Note**: Some features requiring server-side rendering won't work with static export.

## Specific Platform Guides

### Deploying to Fedora Server

1. **Install Dependencies**
```bash
# Install Node.js
sudo dnf install nodejs npm

# Install Git
sudo dnf install git
```

2. **Clone and Setup**
```bash
git clone <your-repo>
cd tools-hofflabs
./setup-fedora.sh
```

3. **Configure Firewall**
```bash
# Allow port 3000
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

4. **Setup Systemd Service** (Optional)
```bash
sudo nano /etc/systemd/system/it-multitool.service
```

Add:
```ini
[Unit]
Description=IT Multitool
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/path/to/tools-hofflabs
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable it-multitool
sudo systemctl start it-multitool
```

### Deploying with Nginx Reverse Proxy

1. **Install Nginx**
```bash
sudo dnf install nginx
```

2. **Configure Site**
```bash
sudo nano /etc/nginx/conf.d/it-multitool.conf
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable and Start**
```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Deploying to DigitalOcean/Linode/Vultr

1. **Create a Droplet/Instance**
   - Choose Fedora or Ubuntu
   - Minimum: 1GB RAM, 1 CPU

2. **SSH to Server**
```bash
ssh root@your-server-ip
```

3. **Install Dependencies**
```bash
# For Fedora
sudo dnf install nodejs npm git

# For Ubuntu
sudo apt update
sudo apt install nodejs npm git
```

4. **Clone and Deploy**
```bash
git clone <your-repo>
cd tools-hofflabs
npm install
npm run build
npm start
```

5. **Use PM2 or systemd** (see above)

## Environment Variables

This application doesn't require any environment variables by default. However, if you add tools that need configuration:

```bash
# Create .env.local
PORT=3000
NODE_ENV=production
```

## SSL/HTTPS Setup

### With Nginx + Certbot (Free)

```bash
# Install Certbot
sudo dnf install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot-renew.timer
```

### With Cloudflare (Free)

1. Add your domain to Cloudflare
2. Point DNS to your server IP
3. Enable "Flexible SSL" in Cloudflare dashboard

## Monitoring and Maintenance

### Using PM2

```bash
# View logs
pm2 logs it-multitool

# Monitor
pm2 monit

# Restart
pm2 restart it-multitool

# View status
pm2 status
```

### Using systemd

```bash
# View logs
sudo journalctl -u it-multitool -f

# Restart
sudo systemctl restart it-multitool

# Status
sudo systemctl status it-multitool
```

### Docker

```bash
# View logs
docker logs -f it-multitool

# Restart
docker restart it-multitool

# Status
docker ps
```

## Updating the Application

### With Git

```bash
cd tools-hofflabs
git pull
npm install
npm run build

# Restart service
pm2 restart it-multitool
# OR
sudo systemctl restart it-multitool
# OR
docker-compose restart
```

## Backup

Only configuration files need backup (no database):

```bash
# Backup these if you've customized them:
- .env.local (if you created it)
- Custom tool files in tools/
- Modified components
```

## Troubleshooting

### Port 3000 already in use

```bash
# Find process
sudo lsof -ti:3000

# Kill process
sudo kill -9 $(sudo lsof -ti:3000)

# Or use different port
PORT=3001 npm start
```

### Build fails

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Docker build fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker build --no-cache -t it-multitool .
```

## Performance Optimization

### Production Build
Already configured with:
- Standalone output
- Minification
- Tree shaking
- Image optimization

### CDN (Optional)
Add Cloudflare in front of your deployment for:
- DDoS protection
- Edge caching
- Faster global delivery

### Monitoring (Optional)
Consider adding:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Plausible, Umami - privacy-focused)

## Security Checklist

- [ ] Keep Node.js updated
- [ ] Use HTTPS (via Nginx/Cloudflare)
- [ ] Enable firewall
- [ ] Regular system updates (`sudo dnf update`)
- [ ] Use non-root user for Node.js process
- [ ] Consider fail2ban for SSH protection
- [ ] Regular backups of custom tools

## Support

For deployment issues:
- Check logs first
- Review this guide
- Check Next.js deployment docs
- Open an issue on GitHub

---

**Recommended Setup**: Docker + Nginx + Certbot on Fedora VPS
**Quickest Setup**: Vercel deployment (1 command)
**Most Control**: PM2 + systemd on your own server
