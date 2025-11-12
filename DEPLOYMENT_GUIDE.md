# Deployment Guide - Professional Portfolio

Complete guide for deploying your split portfolio application.

## Overview

Your application is now split into two independent projects:

1. **Frontend** (`./frontend`) - React portfolio website
2. **CMS Backend** (`./cms-backend`) - Next.js CMS + Express API

Both can be deployed independently to different platforms.

---

## Option 1: Quick Deploy (Recommended for Beginners)

### Frontend → Netlify
### Backend → Railway

This combination is free to start and easy to set up.

### Step 1: Deploy Frontend to Netlify

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [Netlify](https://netlify.com)** and sign up

3. **Click "Add new site" → "Import an existing project"**

4. **Connect your repository**

5. **Configure build settings:**
   ```
   Base directory: frontend
   Build command: pnpm build
   Publish directory: frontend/dist
   ```

6. **Add environment variable:**
   ```
   VITE_API_BASE_URL = https://your-backend.up.railway.app/api
   ```
   (You'll get this URL after deploying the backend)

7. **Deploy!**

8. **Get your frontend URL:** `https://your-site.netlify.app`

### Step 2: Deploy Backend to Railway

1. **Go to [Railway](https://railway.app)** and sign up

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Configure the service:**
   - **Root Directory:** `cms-backend`
   - **Start Command:** `node server.js & pnpm start`
   
5. **Add environment variables:**
   ```
   DATABASE_URL=file:./prod.db
   CMS_ADMIN_TOKEN=<generate-a-secure-token>
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
   RESEND_API_KEY=<your-resend-key> (optional)
   PORT=4000
   ```

   Generate secure token:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Add a start script to `cms-backend/package.json`:**
   ```json
   "scripts": {
     "start:all": "node server.js & pnpm start"
   }
   ```
   And set Railway start command to: `pnpm start:all`

7. **Run database setup** (via Railway CLI or after first deploy):
   ```bash
   pnpm prisma generate
   pnpm prisma migrate deploy
   pnpm seed
   ```

8. **Deploy!**

9. **Update frontend environment variable** with your Railway backend URL

---

## Option 2: Both on Vercel

Deploy both frontend and backend to Vercel (requires separate projects).

### Frontend on Vercel

1. Import the repository
2. Set root directory: `frontend`
3. Framework preset: Other
4. Build command: `pnpm build`
5. Output directory: `dist`
6. Environment variable: `VITE_API_BASE_URL`

### Backend on Vercel

1. Import the repository (separate project)
2. Set root directory: `cms-backend`
3. Framework preset: Next.js
4. Environment variables:
   - `DATABASE_URL` (use Vercel Postgres or external DB)
   - `CMS_ADMIN_TOKEN`
   - `NEXT_PUBLIC_API_URL`
5. Note: Express API needs to be converted to Vercel serverless functions OR deployed separately

---

## Option 3: Both on Single VPS

Deploy everything to a single server (DigitalOcean, Linode, etc.).

### Server Setup (Ubuntu Example)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone your repository
git clone <your-repo>
cd professional-portfolio

# Setup Frontend
cd frontend
pnpm install
# Create .env with production API URL
pnpm build
# Serve dist folder with nginx

# Setup Backend
cd ../cms-backend
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm seed

# Run with PM2
npm install -g pm2
pm2 start server.js --name api
pm2 start "pnpm start" --name cms
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# CMS
server {
    listen 80;
    server_name cms.yourdomain.com;
    
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

---

## Option 4: Separate Specialized Hosting

### Frontend
- **Netlify** (Recommended)
- **Vercel**
- **Cloudflare Pages**
- **AWS S3 + CloudFront**
- **GitHub Pages** (with custom build action)

### Backend API (Express)
- **Railway** (Recommended)
- **Render**
- **Heroku**
- **Fly.io**
- **DigitalOcean App Platform**

### CMS (Next.js)
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **Render**

### Database
- **SQLite** (on same server as API)
- **Vercel Postgres**
- **Supabase** (PostgreSQL)
- **Railway PostgreSQL**
- **PlanetScale** (MySQL)

---

## Environment Variables Reference

### Frontend (`./frontend`)
```bash
# Required
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Backend (`./cms-backend`)
```bash
# Required
DATABASE_URL=file:./prod.db  # or PostgreSQL URL
CMS_ADMIN_TOKEN=your_secure_32_character_token
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# Optional
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
PORT=4000
NODE_ENV=production
```

---

## Database Migration Strategy

### For SQLite (File-based)
```bash
# On deployment
pnpm prisma generate
pnpm prisma migrate deploy
pnpm seed  # First time only
```

### For PostgreSQL/MySQL
1. Set `DATABASE_URL` to your cloud database
2. Run migrations:
   ```bash
   pnpm prisma migrate deploy
   ```
3. Seed if needed:
   ```bash
   pnpm seed
   ```

---

## Post-Deployment Checklist

### Frontend
- [ ] Site loads correctly
- [ ] All pages render (Home, About, Portfolio, Insights, Contact)
- [ ] API requests work (check browser console)
- [ ] Images load
- [ ] Forms work
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] SEO meta tags present

### Backend
- [ ] API endpoints respond correctly
- [ ] CMS login works
- [ ] Can create/edit/delete content
- [ ] Changes reflect on frontend
- [ ] Image upload works
- [ ] Email sending works (if configured)
- [ ] Database persists data
- [ ] Auth token validation works

### Security
- [ ] CMS uses HTTPS
- [ ] Strong admin token set
- [ ] CMS URL not public
- [ ] CORS configured correctly
- [ ] Environment variables secure
- [ ] `.env` files not in git

---

## Continuous Deployment

### With GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && pnpm install && pnpm build
      # Deploy to your hosting provider

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd cms-backend && pnpm install && pnpm prisma generate
      # Deploy to your hosting provider
```

---

## Monitoring & Maintenance

### Recommended Tools
- **Uptime monitoring:** UptimeRobot, Pingdom
- **Error tracking:** Sentry
- **Analytics:** Google Analytics, Plausible
- **Logs:** Railway logs, Vercel logs, or CloudWatch

### Backup Strategy
```bash
# Backup database regularly
cd cms-backend
pnpm backup

# Commit to git or upload to cloud storage
```

---

## Troubleshooting

### "Cannot connect to API"
- Check `VITE_API_BASE_URL` is correct
- Ensure API server is running
- Check CORS settings
- Verify network/firewall rules

### "Database error"
- Check `DATABASE_URL` is valid
- Run migrations: `pnpm prisma migrate deploy`
- Check file permissions (for SQLite)

### "Build failed"
- Check Node.js version (need 18+)
- Clear cache and reinstall: `rm -rf node_modules .next && pnpm install`
- Check TypeScript errors: `pnpm check`

### "CMS login fails"
- Verify `CMS_ADMIN_TOKEN` matches on both ends
- Check browser console for errors
- Try clearing localStorage

---

## Cost Estimation

### Free Tier (Great for starting)
- **Netlify:** Free for frontend (100GB bandwidth)
- **Railway:** $5/month credit (enough for small API)
- **Total:** ~$5/month or free initially

### Small Scale
- **Frontend:** Netlify/Vercel (Free - $20/mo)
- **Backend:** Railway ($10-20/mo)
- **Database:** Included or $5-10/mo
- **Total:** $10-50/month

### Medium Scale
- **Frontend:** CloudFlare Pages/Netlify ($20/mo)
- **Backend:** Render/Railway ($20-50/mo)
- **Database:** Managed PostgreSQL ($10-25/mo)
- **Total:** $50-100/month

---

## Need Help?

1. Check project READMEs: `frontend/README.md` and `cms-backend/README.md`
2. Check `PROJECT_STRUCTURE.md` for architecture overview
3. Review environment variables carefully
4. Test locally before deploying
5. Check hosting provider documentation

---

**Happy deploying! 🚀**

