# Production Deployment Guide
## ShipsMind AI Consulting Website

This document contains the final working configuration for deploying the shipsmind_speckit application to production.

## Deployment Overview

**Production URL**: https://shipsmind.com
**Server**: Ubuntu 24.04.3 LTS (192.168.0.103)
**Application**: Next.js 14 with TypeScript
**Database**: PostgreSQL 15 (Docker container)
**Reverse Proxy**: nginx 1.24.0
**CDN**: Cloudflare with tunnel

## Final Working Architecture

```
Internet → Cloudflare CDN → Cloudflare Tunnel → nginx (port 80) → Next.js (port 3005) → PostgreSQL (port 5432)
```

## Server Specifications

- **OS**: Ubuntu 24.04.3 LTS
- **CPU**: 4 cores
- **RAM**: 15GB (11GB available)
- **Storage**: 98GB (65GB free)
- **Load**: Very low (0.3-0.5)

## Environment Configuration

### Environment Variables (.env)
```bash
# Database
DATABASE_URL="postgresql://speckit_user:speckit_password@localhost:5432/shipsmind_speckit_production"

# App Configuration
NEXT_PUBLIC_APP_URL=https://shipsmind.com
NEXTAUTH_URL=https://shipsmind.com
NEXTAUTH_SECRET=production_secret_key_change_this

# Development
NODE_ENV=production
```

### Key Notes:
- Use `.env` file (not `.env.local`) for Prisma compatibility
- Database runs on port 5432 (not 5433 as in development)
- Production secrets should be updated from defaults

## Database Setup

### PostgreSQL Container
```bash
# Start PostgreSQL container
docker run -d --name shipsmind-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=shipsmind_speckit_production \
  -e POSTGRES_USER=speckit_user \
  -e POSTGRES_PASSWORD=speckit_password \
  -p 5432:5432 postgres:15

# Deploy schema
pnpm db:push
```

### Container Status
```bash
# Check if container is running
docker ps | grep shipsmind-postgres

# View logs if needed
docker logs shipsmind-postgres
```

## nginx Configuration

### Working Configuration (/etc/nginx/sites-available/shipsmind)
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name shipsmind.com www.shipsmind.com;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy origin-when-cross-origin;

    # Proxy to Next.js application
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:3005/health;
        access_log off;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://127.0.0.1:3005;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml+rss;
}
```

### nginx Setup Commands
```bash
# Enable site (symlink already exists)
ls -la /etc/nginx/sites-enabled/shipsmind

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Cloudflare Configuration

### Tunnel Configuration (/etc/cloudflared/config.yml)
```yaml
tunnel: d7f4eea5-9b23-4563-b41b-0af955e3f117
token: [REDACTED]
origincert: /home/mike/.cloudflared/cert.pem

ingress:
  - hostname: postiz.shipsmind.com
    service: http://127.0.0.1:80
  - hostname: shipsmind.com
    service: http://127.0.0.1:80
  - hostname: www.shipsmind.com
    service: http://127.0.0.1:80
  - service: http_status:404
```

### Tunnel Service Status
```bash
# Check tunnel status
ps aux | grep cloudflared

# Expected output:
# root [PID] /usr/bin/cloudflared --no-autoupdate tunnel --config /etc/cloudflared/config.yml run
```

## Application Setup

### Dependencies Installation
```bash
# Install pnpm (if needed)
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc

# Install dependencies
pnpm install --production=false

# Generate Prisma client
pnpm db:generate

# Build application
pnpm build
```

### Application Startup
```bash
# Start in production mode
PORT=3005 NODE_ENV=production pnpm start

# Run in background
PORT=3005 NODE_ENV=production pnpm start > app.log 2>&1 &
```

### Application Status
```bash
# Check if app is running
ps aux | grep next

# Test local connection
curl -I http://localhost:3005

# Expected response: HTTP/1.1 200 OK with Next.js headers
```

## Deployment Process

### Complete Deployment Steps
1. **Prepare application**:
   ```bash
   # On development machine
   tar --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='shipsmindweb' -czf deployment.tar.gz .
   scp deployment.tar.gz mike@192.168.0.103:~/
   ```

2. **Deploy on server**:
   ```bash
   # Extract and install
   cd ~/shipsmind-speckit
   tar -xzf ~/deployment.tar.gz
   /home/mike/.local/share/pnpm/pnpm install --production=false

   # Build and start
   /home/mike/.local/share/pnpm/pnpm build
   PORT=3005 NODE_ENV=production /home/mike/.local/share/pnpm/pnpm start > app.log 2>&1 &
   ```

3. **Verify deployment**:
   ```bash
   # Test local app
   curl -I http://localhost:3005

   # Test through nginx
   curl -H "Host: shipsmind.com" http://127.0.0.1:80

   # Test live site
   curl -I https://shipsmind.com
   ```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. TypeScript Build Errors
**Problem**: Unused imports causing build failures
```bash
# Error: 'Clock' is declared but its value is never read
```

**Solution**: Remove unused imports
```bash
# Fix in components (example)
sed -i 's/ArrowRight, CheckCircle, Clock, TrendingUp/ArrowRight, CheckCircle/g' components/homepage/SolutionsOverview.tsx
```

#### 2. 502 Bad Gateway Errors
**Problem**: nginx can't connect to Next.js app

**Diagnosis**:
```bash
# Check if app is running
ps aux | grep next
curl -I http://localhost:3005

# Check nginx config
sudo nginx -t
```

**Solutions**:
- Use `127.0.0.1:3005` instead of `localhost:3005` in nginx config
- Restart Next.js app if not responding
- Check for port conflicts

#### 3. Conflicting nginx Configurations
**Problem**: Multiple nginx configs serving different content

**Diagnosis**:
```bash
# Find conflicting configs
sudo find /etc/nginx -name "*.conf" -exec grep -l "shipsmind.com" {} \;

# Check for conflicts
sudo nginx -t
# Look for warnings about "conflicting server name"
```

**Solution**: Remove conflicting configs
```bash
# Remove old configs in conf.d
sudo rm /etc/nginx/conf.d/shipsmind.conf
sudo rm /etc/nginx/conf.d/postiz.conf
sudo systemctl restart nginx
```

#### 4. Database Connection Issues
**Problem**: `Can't reach database server at localhost:5433`

**Solutions**:
- Ensure DATABASE_URL uses correct port (5432 for production)
- Use `.env` file instead of `.env.local` for Prisma
- Verify Docker container is running:
  ```bash
  docker ps | grep postgres
  ```

#### 5. Cloudflare Caching Issues
**Problem**: Old content still served despite updates

**Solutions**:
- Purge Cloudflare cache in dashboard
- Wait 5-10 minutes for global propagation
- Test with cache bypass headers:
  ```bash
  curl -H "Cache-Control: no-cache" https://shipsmind.com
  ```

### Health Check Commands

```bash
# Full system check
echo "=== Application Status ==="
ps aux | grep next
curl -I http://localhost:3005

echo "=== Database Status ==="
docker ps | grep postgres

echo "=== nginx Status ==="
sudo nginx -t
systemctl status nginx

echo "=== Cloudflare Tunnel ==="
ps aux | grep cloudflared

echo "=== Live Site Test ==="
curl -I https://shipsmind.com
```

## Monitoring and Maintenance

### Log Locations
- **Application**: `~/shipsmind-speckit/app.log`
- **nginx**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **Docker**: `docker logs shipsmind-postgres`

### Regular Maintenance
- **Weekly**: Check application logs for errors
- **Monthly**: Update dependencies if needed
- **Quarterly**: Review and rotate secrets
- **Backup**: Database and configuration files

### Performance Monitoring
```bash
# Server resources
htop
df -h
free -h

# Application performance
curl -w "@-" -o /dev/null -s https://shipsmind.com << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

## Security Notes

- All sensitive tokens/passwords should be rotated from defaults
- nginx security headers are properly configured
- Cloudflare provides DDoS protection and SSL termination
- Database is only accessible locally (not exposed to internet)
- Application runs on non-privileged port (3005)

## Success Metrics

✅ **Application**: Running on port 3005
✅ **Database**: PostgreSQL container healthy
✅ **nginx**: Proxying correctly to app
✅ **Cloudflare**: CDN and tunnel active
✅ **Domain**: https://shipsmind.com serving production site
✅ **Performance**: Sub-second response times
✅ **SEO**: Proper meta tags and titles

---

**Last Updated**: September 15, 2025
**Deployment Status**: ✅ LIVE IN PRODUCTION
**Next Review**: December 15, 2025