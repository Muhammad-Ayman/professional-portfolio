# Migration Guide: From Monorepo to Split Architecture

If you were using the previous monorepo structure and want to migrate to the new split architecture, follow this guide.

## What Changed?

### Before (Monorepo)
```
professional-portfolio/
├── client/          # React app
├── server/          # Express API
├── shared/          # Shared types
└── package.json     # Single package file
```

### After (Split)
```
professional-portfolio/
├── frontend/        # Standalone React app
├── cms-backend/     # Next.js CMS + Express API
└── [old files]      # Can be deleted after migration
```

## Migration Steps

### Step 1: Backup Your Data

```bash
# Backup your database
cd <old-project-root>
npm run backup

# Or manually copy the database file
cp dev.db dev.db.backup
```

### Step 2: Copy Database to New Structure

```bash
# Copy database to cms-backend
cp dev.db cms-backend/dev.db

# Or copy the backup
cp dev.db.backup cms-backend/dev.db
```

### Step 3: Copy Environment Variables

**Old `.env` → Frontend `.env`:**
```bash
# In frontend/.env
VITE_API_BASE_URL=http://localhost:4000/api
```

**Old `.env` → Backend `.env.local`:**
```bash
# In cms-backend/.env.local
DATABASE_URL="file:./dev.db"
CMS_ADMIN_TOKEN=<your-existing-token>
NEXT_PUBLIC_API_URL=http://localhost:4000/api
RESEND_API_KEY=<your-existing-key>
```

### Step 4: Verify Data Migration

```bash
cd cms-backend

# Check database
pnpm prisma studio

# Verify all data is present:
# - Profile
# - Case Studies
# - Insights
# - FAQs
```

### Step 5: Test Locally

```bash
# Terminal 1: Start API
cd cms-backend
node server.js

# Terminal 2: Start CMS
cd cms-backend
pnpm dev

# Terminal 3: Start Frontend
cd frontend
pnpm dev
```

Visit:
- Frontend: http://localhost:3000
- CMS: http://localhost:3000 (or next available port)
- API: http://localhost:4000

### Step 6: Verify Everything Works

- [ ] Frontend displays all content
- [ ] CMS login works
- [ ] Can edit content in CMS
- [ ] Changes appear on frontend
- [ ] Images load correctly
- [ ] Contact form works

### Step 7: Deploy New Structure

Follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Step 8: Clean Up Old Files (Optional)

Once everything works in production:

```bash
# Remove old monorepo files
rm -rf client/
rm -rf server/
rm -rf dist/
rm -rf node_modules/
rm package.json
rm tsconfig.json
rm vite.config.ts
# etc.

# Keep only:
# - frontend/
# - cms-backend/
# - *.md files
# - .git/
```

## Common Migration Issues

### Issue: Database not found
**Solution:** Copy database file to `cms-backend/dev.db`

### Issue: CMS login fails
**Solution:** Verify `CMS_ADMIN_TOKEN` matches in both `.env.local` and your memory/password manager

### Issue: Frontend can't fetch data
**Solution:** 
1. Check `VITE_API_BASE_URL` in `frontend/.env`
2. Ensure API server is running
3. Check browser console for CORS errors

### Issue: Images missing
**Solution:** Images should be in database as URLs. If stored locally, copy to appropriate public folder or re-upload via CMS

### Issue: Prisma errors
**Solution:**
```bash
cd cms-backend
pnpm prisma generate
pnpm prisma migrate deploy
```

## Rollback Plan

If something goes wrong:

1. **Keep old structure intact** - Don't delete old files until new structure is verified
2. **Have database backup** - Can restore if needed
3. **Note environment variables** - Document all settings
4. **Test in dev first** - Don't migrate production until dev works

## Benefits of New Structure

✅ **Separate deployments** - Update frontend without touching backend  
✅ **Better hosting options** - Use CDN for frontend, server for backend  
✅ **Improved security** - CMS isolated from public site  
✅ **Cost optimization** - Choose best/cheapest hosting for each  
✅ **Independent scaling** - Scale components separately  
✅ **Clearer architecture** - Easier to understand and maintain  

## Side-by-Side Comparison

| Aspect | Old (Monorepo) | New (Split) |
|--------|---------------|-------------|
| **Structure** | Single project | Two projects |
| **Deployment** | Single deploy | Independent deploys |
| **Hosting** | One server | Different platforms possible |
| **Scaling** | Scale everything | Scale independently |
| **Development** | One dev server | Multiple servers |
| **Build** | Single build | Separate builds |
| **Updates** | Deploy everything | Deploy what changed |

## Need Help?

1. Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Review individual README files:
   - [frontend/README.md](./frontend/README.md)
   - [cms-backend/README.md](./cms-backend/README.md)

## Questions?

### Q: Do I have to migrate?
A: No, the old structure still works. But the new structure offers better deployment flexibility.

### Q: Will my data be lost?
A: No, just copy the database file. Make backups first!

### Q: Can I keep using the old structure?
A: Yes, but you won't get the benefits of separate deployments.

### Q: Is the new structure more expensive?
A: Often cheaper! Frontend can use free static hosting, backend only pays for what it needs.

### Q: What if I'm already deployed?
A: Keep old deployment running, set up new structure in parallel, test thoroughly, then switch DNS/URLs.

---

**Happy migrating! 🚀**

