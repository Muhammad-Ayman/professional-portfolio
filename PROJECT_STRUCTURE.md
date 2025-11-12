# Project Structure - Split Deployment Guide

This professional portfolio application has been split into two separate, independently deployable projects:

## 📁 Project Overview

```
professional-portfolio/
├── frontend/          # React portfolio website (PUBLIC)
│   └── README.md     # Frontend-specific documentation
│
├── cms-backend/       # Next.js CMS + Express API (PRIVATE)
│   └── README.md     # Backend-specific documentation
│
└── PROJECT_STRUCTURE.md  # This file
```

## 🎯 Frontend (Public Portfolio)

**Location:** `./frontend`

**Description:** The public-facing portfolio website built with React and Vite. This displays your profile, case studies, insights, and contact form.

**Technology:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Wouter (routing)
- React Query (data fetching)

**Deployment Options:**
- ✅ **Netlify** (Recommended)
- ✅ **Vercel**
- ✅ **Cloudflare Pages**
- ✅ **AWS S3 + CloudFront**
- ✅ Any static hosting service

**Environment Variables:**
- `VITE_API_BASE_URL` - URL to your deployed backend API

**Build Command:** `pnpm build`
**Output Directory:** `dist`

[→ See frontend/README.md for detailed instructions](./frontend/README.md)

---

## 🔒 CMS Backend (Private Admin + API)

**Location:** `./cms-backend`

**Description:** The admin CMS interface (Next.js) and REST API (Express) for managing content. Requires authentication.

**Technology:**
- Next.js 15 (App Router)
- Express.js (API server)
- Prisma + SQLite (database)
- React 19 (CMS UI)
- Tailwind CSS

**Deployment Options:**

### Option A: Together (Recommended for beginners)
Deploy both CMS and API on the same platform:
- ✅ **Railway**
- ✅ **Render**
- ✅ **Fly.io**
- ✅ **VPS (DigitalOcean, Linode, etc.)**

### Option B: Separately
- CMS Frontend → **Vercel** or **Netlify**
- API Server → **Railway**, **Render**, or **Heroku**

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - URL to the Express API
- `DATABASE_URL` - Database connection string
- `CMS_ADMIN_TOKEN` - Admin authentication token
- `RESEND_API_KEY` - Email service key (optional)

**Development:**
Requires running TWO servers:
1. `node server.js` (Express API on port 4000)
2. `pnpm dev` (Next.js CMS on port 3000)

[→ See cms-backend/README.md for detailed instructions](./cms-backend/README.md)

---

## 🚀 Quick Start

### 1. Frontend (Portfolio Website)

```bash
cd frontend
pnpm install
cp .env .env.local
# Edit .env.local to set VITE_API_BASE_URL
pnpm dev
```

Open http://localhost:3000

### 2. CMS Backend

```bash
cd cms-backend
pnpm install
cp .env.local .env.local.dev
# Edit .env.local.dev to configure database and tokens

# Setup database
pnpm prisma generate
pnpm prisma migrate deploy
pnpm seed

# Terminal 1: Start Express API
node server.js

# Terminal 2: Start Next.js CMS
pnpm dev
```

Open http://localhost:3000 (CMS)
API runs on http://localhost:4000

---

## 🔄 Deployment Flow

### Frontend Deployment (Netlify Example)

1. Create new site on Netlify
2. Connect to your Git repository
3. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `pnpm build`
   - **Publish directory:** `frontend/dist`
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://your-api.com/api`
5. Deploy!

### Backend Deployment (Railway Example)

1. Create new project on Railway
2. Connect to your Git repository
3. Configure settings:
   - **Root directory:** `cms-backend`
   - **Start command:** `node server.js & pnpm start`
   - Or separate services for API and CMS
4. Add environment variables:
   - `DATABASE_URL`
   - `CMS_ADMIN_TOKEN`
   - `NEXT_PUBLIC_API_URL`
   - `RESEND_API_KEY` (optional)
5. Run migrations from Railway CLI or dashboard
6. Deploy!

---

## 🔐 Security Notes

1. **Never commit `.env` files** to Git
2. Generate a strong `CMS_ADMIN_TOKEN`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Keep your CMS URL private (don't link to it from the public site)
4. Use HTTPS in production
5. Regularly update dependencies

---

## 📊 Database

The backend uses SQLite (via Prisma) by default. For production, you can:
- Keep using SQLite (works well for small to medium sites)
- Switch to PostgreSQL (Railway, Supabase, Neon, etc.)
- Switch to MySQL/MariaDB

Update `DATABASE_URL` in `.env` to change database.

---

## 🆘 Troubleshooting

### Frontend can't reach API
- Check `VITE_API_BASE_URL` is set correctly
- Ensure API server is running and accessible
- Check CORS settings in Express server

### CMS Login Issues
- Verify `CMS_ADMIN_TOKEN` matches between frontend and backend
- Check browser console for errors
- Clear localStorage and try again

### Database Errors
- Run `pnpm prisma generate` after schema changes
- Run `pnpm prisma migrate deploy` to apply migrations
- Check `DATABASE_URL` is valid

### Build Failures
- Ensure Node.js version is 18 or higher
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `pnpm check`

---

## 📝 Development Workflow

1. **Make changes to frontend** → Test locally → Deploy frontend
2. **Make changes to backend API** → Test locally → Deploy backend
3. **Make changes to CMS** → Test locally → Deploy backend
4. **Update content** → Use CMS at your deployed URL

---

## 🔗 Architecture Diagram

```
                    ┌─────────────────────┐
                    │   Frontend (React)  │
                    │   Netlify/Vercel    │
                    │   your-site.com     │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               │ (API calls)
                               │
                    ┌──────────▼──────────┐
                    │   Backend API       │
                    │   (Express.js)      │
                    │   Railway/Render    │
                    │   api.your-site.com │
                    └──────────┬──────────┘
                               │
                               │ Prisma ORM
                               │
                    ┌──────────▼──────────┐
                    │   Database          │
                    │   (SQLite/Postgres) │
                    └─────────────────────┘

    Admin CMS (Next.js) → Same URL as API or separate
```

---

## 📚 Additional Resources

- [Frontend README](./frontend/README.md)
- [Backend README](./cms-backend/README.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vite Documentation](https://vitejs.dev/)

---

## 💡 Why Split the Project?

1. **Independent Scaling:** Scale frontend and backend separately
2. **Different Deployment Targets:** Static hosting for frontend, server for backend
3. **Security:** Keep admin CMS separate from public site
4. **Performance:** Serve static frontend from CDN
5. **Flexibility:** Use different hosting providers optimized for each part

---

## ✅ Checklist for First Deployment

### Frontend
- [ ] Install dependencies
- [ ] Set `VITE_API_BASE_URL` environment variable
- [ ] Build successfully locally
- [ ] Deploy to hosting platform
- [ ] Test that site loads and fetches data

### Backend
- [ ] Install dependencies
- [ ] Set all environment variables
- [ ] Generate Prisma client
- [ ] Run database migrations
- [ ] Seed database with initial data
- [ ] Test Express API endpoints
- [ ] Deploy to hosting platform
- [ ] Test CMS login and CRUD operations

---

**Need help?** Check the individual README files in each project directory for detailed instructions.

