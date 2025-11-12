# Quick Start Guide - 5 Minutes to Running

Get your split portfolio running locally in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Install pnpm if not installed
npm install -g pnpm
```

## Step 1: Clone & Navigate (30 seconds)

```bash
git clone <your-repo-url>
cd professional-portfolio
```

## Step 2: Setup Frontend (1 minute)

```bash
cd frontend
pnpm install
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
cd ..
```

## Step 3: Setup Backend (2 minutes)

```bash
cd cms-backend
pnpm install

# Create environment file
cat > .env.local << 'EOF'
DATABASE_URL="file:./dev.db"
CMS_ADMIN_TOKEN=dev_token_12345
NEXT_PUBLIC_API_URL=http://localhost:4000/api
EOF

# Setup database
pnpm prisma generate
pnpm prisma migrate deploy
pnpm seed

cd ..
```

## Step 4: Run Everything (1 minute)

Open **3 terminals**:

### Terminal 1 - API Server
```bash
cd cms-backend
node server.js
```
✅ API running on http://localhost:4000

### Terminal 2 - CMS Frontend
```bash
cd cms-backend
pnpm dev
```
✅ CMS running on http://localhost:3000

### Terminal 3 - Public Website
```bash
cd frontend
pnpm dev
```
✅ Website running on http://localhost:5173 (or another port)

## Step 5: Test Everything (30 seconds)

1. **Open Frontend:** http://localhost:5173
   - Should see portfolio website
   - Check that content loads

2. **Open CMS:** http://localhost:3000
   - Login with token: `dev_token_12345`
   - Try editing profile or adding content

3. **Check API:** http://localhost:4000/api/content/profile
   - Should return JSON data

## 🎉 Success!

You now have:
- ✅ Frontend running and displaying content
- ✅ CMS running and authenticated
- ✅ API serving data
- ✅ Database with seed data

## Next Steps

### For Development
1. Edit content in CMS → See changes on frontend
2. Modify frontend code → Hot reload
3. Update API → Restart server

### For Production
Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Common Issues

### Port Already in Use
```bash
# Change port in cms-backend/server/index.ts
# Or kill the process using the port
lsof -ti:4000 | xargs kill -9  # Mac/Linux
```

### Command Not Found
```bash
# Install pnpm globally
npm install -g pnpm
```

### Database Errors
```bash
cd cms-backend
rm dev.db  # Delete database
pnpm prisma migrate deploy  # Recreate
pnpm seed  # Reseed
```

### CMS Login Fails
Token: `dev_token_12345`
(This is the default token in .env.local)

## Scripts Cheat Sheet

### Frontend
```bash
cd frontend
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

### Backend
```bash
cd cms-backend
node server.js       # Start API server
pnpm dev            # Start CMS dev server
pnpm build          # Build CMS for production
pnpm start          # Start CMS production server
pnpm prisma studio  # Open database GUI
pnpm seed           # Seed database
pnpm backup         # Backup database
```

## Development Tips

### 1. Keep all 3 terminals open
One for API, one for CMS, one for frontend

### 2. Use VS Code?
Open two VS Code windows:
- Window 1: `code frontend`
- Window 2: `code cms-backend`

### 3. Auto-restart API on changes
```bash
# Install tsx globally
npm install -g tsx

# Run with auto-restart
cd cms-backend
tsx watch server/index.ts
```

### 4. View database easily
```bash
cd cms-backend
pnpm prisma studio
# Opens GUI at http://localhost:5555
```

## Environment Variables Quick Reference

### Frontend `.env`
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

### Backend `.env.local`
```bash
DATABASE_URL="file:./dev.db"
CMS_ADMIN_TOKEN=dev_token_12345
NEXT_PUBLIC_API_URL=http://localhost:4000/api
RESEND_API_KEY=re_xxxxx  # Optional, for email
```

## What's Running Where?

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Public portfolio website |
| CMS | http://localhost:3000 | Admin content management |
| API | http://localhost:4000 | REST API endpoints |
| Prisma Studio | http://localhost:5555 | Database viewer (when running) |

## Ready to Deploy?

Once everything works locally, see:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Comprehensive deployment guide
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture details
- Individual README files in `frontend/` and `cms-backend/`

---

**Questions?** Check the detailed README files or open an issue!

**Happy coding! 🚀**

