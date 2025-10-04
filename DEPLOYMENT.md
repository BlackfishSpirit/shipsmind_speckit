# Coolify Deployment Guide for ShipsMind

This guide explains how to deploy the ShipsMind landing page to Coolify.

## Prerequisites

- Coolify instance set up and accessible
- Git repository pushed to GitHub/GitLab/Bitbucket
- Domain name (shipsmind.com) configured

## Environment Variables

Configure these environment variables in Coolify:

### Required for Production

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key
CLERK_SECRET_KEY=sk_live_your_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://shipsmind.com
NEXTAUTH_URL=https://shipsmind.com
NEXTAUTH_SECRET=your_production_nextauth_secret

# Production Settings
NODE_ENV=production
```

### Optional

```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn

# Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@shipsmind.com
```

## Coolify Setup Steps

1. **Create New Resource**
   - Go to your Coolify dashboard
   - Click "New Resource"
   - Select "Application"

2. **Connect Repository**
   - Choose your Git provider
   - Select the shipsmind_speckit repository
   - Select the `main` branch

3. **Build Configuration**
   - Build Pack: Docker (will auto-detect Dockerfile)
   - Port: 3000
   - Health Check Path: `/` (optional)

4. **Environment Variables**
   - Add all required environment variables from the list above
   - Use production keys (pk_live_, sk_live_) instead of test keys

5. **Domain Configuration**
   - Add your domain: shipsmind.com
   - Enable SSL/HTTPS (Coolify can auto-provision Let's Encrypt)
   - Optionally add www.shipsmind.com as an alias

6. **Database Setup** (if not using external DB)
   - Create a PostgreSQL database in Coolify
   - Copy the DATABASE_URL to your environment variables
   - Run database migrations after first deployment

7. **Deploy**
   - Click "Deploy"
   - Monitor build logs for any issues

## Post-Deployment

### Run Database Migrations

If this is the first deployment:

1. Access the container shell in Coolify
2. Run: `npx prisma migrate deploy`

Or set up automatic migrations in your build:
- Add to Dockerfile before `CMD`: `RUN npx prisma migrate deploy`

### Verify Deployment

- [ ] Website loads at https://shipsmind.com
- [ ] Clerk authentication works
- [ ] Database connections work
- [ ] API routes respond correctly
- [ ] Images load properly
- [ ] SSL certificate is active

### Clerk Production Settings

Update Clerk dashboard:
- Add production domain: `https://shipsmind.com`
- Update redirect URLs
- Update webhook endpoint if using webhooks

### Stripe Production Settings (if applicable)

- Switch to live API keys
- Update webhook endpoint: `https://shipsmind.com/api/webhooks/stripe`
- Test payment flow in production

## Automatic Deployments

Coolify can auto-deploy on git push:
1. Go to your application settings
2. Enable "Automatic Deployment"
3. Select trigger: "On Push to Branch: main"

## Troubleshooting

### Build Fails
- Check build logs in Coolify
- Verify all environment variables are set
- Ensure DATABASE_URL is accessible from Coolify

### Database Connection Issues
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database accepts connections from Coolify's IP

### Clerk Authentication Not Working
- Verify production keys are set
- Check domain is added to Clerk dashboard
- Ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY starts with `pk_live_`

### Images Not Loading
- Check if domains are added to next.config.js remotePatterns
- Verify public folder is included in build

## Monitoring

Consider setting up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Log aggregation (Coolify built-in logs)

## Rollback

If deployment fails:
1. Go to deployments history in Coolify
2. Click on previous successful deployment
3. Click "Redeploy"
