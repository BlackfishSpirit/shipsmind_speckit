# Shipsmind Homepage Deployment Plan

## Current Server State
- **Server**: Ubuntu 192.168.0.103 (user: mike)
- **Domain**: shipsmind.com (via Cloudflare)
- **nginx**: Running on port 80 with existing shipsmind site
- **Available Port**: 3005 (matching our dev environment)

## Existing Services (DO NOT DISTURB)
- **Port 5000**: Postiz app (Docker container)
- **Port 9000**: Portainer (Docker management)
- **Various localhost ports**: System services, PM2 processes

## Deployment Strategy

### Phase 1: Backup & Preparation
```bash
# Backup existing nginx configuration
ssh mike@192.168.0.103 "sudo cp /etc/nginx/sites-available/shipsmind /etc/nginx/sites-available/shipsmind.backup"

# Create project directory
ssh mike@192.168.0.103 "sudo mkdir -p /var/www/shipsmind-homepage"
```

### Phase 2: Application Deployment
```bash
# Copy project files to server
rsync -avz --exclude node_modules --exclude .next --exclude .git . mike@192.168.0.103:/var/www/shipsmind-homepage/

# Install dependencies and build
ssh mike@192.168.0.103 "cd /var/www/shipsmind-homepage && npm install && npm run build"
```

### Phase 3: Process Management
```bash
# Create PM2 ecosystem file for production
# Start Next.js app on port 3005
ssh mike@192.168.0.103 "cd /var/www/shipsmind-homepage && pm2 start npm --name 'shipsmind-homepage' -- start"
```

### Phase 4: nginx Configuration
```nginx
# Update /etc/nginx/sites-available/shipsmind
server {
    listen 80;
    listen [::]:80;
    server_name shipsmind.com www.shipsmind.com;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Phase 5: Verification
- Test nginx configuration: `nginx -t`
- Reload nginx: `systemctl reload nginx`
- Verify site loads at shipsmind.com
- Check all existing services still running

## Rollback Plan
If anything goes wrong:
```bash
# Restore backup configuration
sudo cp /etc/nginx/sites-available/shipsmind.backup /etc/nginx/sites-available/shipsmind
sudo systemctl reload nginx

# Stop new application
pm2 stop shipsmind-homepage
```

## Post-Deployment
- Monitor logs: `pm2 logs shipsmind-homepage`
- Verify Cloudflare integration
- Test contact form functionality
- Set up automated deployments for future updates