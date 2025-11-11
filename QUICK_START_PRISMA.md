# Quick Start: Using Your PostgreSQL Database

## 🎉 You're All Set!

Your portfolio now uses PostgreSQL instead of JSON files. Everything works the same way from the frontend perspective, but now with a powerful database backend.

## Start Your App

```bash
pnpm dev
```

That's it! Your app now reads from and writes to PostgreSQL automatically.

## View Your Data

Open Prisma Studio (a web GUI for your database):

```bash
pnpm prisma studio
```

Then visit: `http://localhost:5555`

## Common Tasks

### Create a Backup
```bash
pnpm backup
```
Creates timestamped backup in `backups/` folder

### Re-seed Database
```bash
pnpm seed
```
Imports data from JSON files in `server/data/`

### Test Connection
```bash
pnpm test:db
```
Verifies database is working

### View All Data
```bash
pnpm prisma studio
```
Opens visual database browser

## Database Info

- **Host**: Neon PostgreSQL (cloud)
- **Connection**: Via `DATABASE_URL` in `.env`
- **Models**: Profile, CaseStudy, Insight
- **Records**: 1 Profile, 6 Case Studies, 4 Insights

## File Changes

### Updated Files
- `server/contentStore.ts` - Now uses Prisma
- `package.json` - Added Prisma scripts
- `.gitignore` - Added backups folder

### New Files
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Seed script
- `scripts/backup-db.ts` - Backup utility
- `scripts/test-connection.ts` - Test utility

### Unchanged
- All frontend code (React components)
- All API routes
- All TypeScript types
- Your JSON files (still in `server/data/` as backup)

## What Changed for Developers

### Before (JSON)
```typescript
// Data stored in files
const data = await readFile('server/data/profile.json');
```

### After (Prisma)
```typescript
// Data stored in PostgreSQL
const profile = await prisma.profile.findUnique({ where: { id: 'profile' } });
```

**But your API routes didn't change!** The same functions in `contentStore.ts` now use Prisma internally.

## Production Deployment

When deploying, make sure to:

1. **Set DATABASE_URL** in your hosting environment
2. **Run migrations**:
   ```bash
   pnpm prisma migrate deploy
   ```
3. **Build includes Prisma**:
   ```bash
   pnpm build  # Already includes `prisma generate`
   ```

## Need Help?

- **Full Guide**: See `PRISMA_MIGRATION.md`
- **Summary**: See `MIGRATION_SUMMARY.md`
- **Prisma Docs**: https://www.prisma.io/docs

## Rollback (If Needed)

Your original JSON files are still in `server/data/`. To rollback:
1. Restore old `server/contentStore.ts` from git
2. Uninstall Prisma: `pnpm remove prisma @prisma/client`

But you won't need to - it just works! 🚀

---

**Quick Test**: Run `pnpm test:db` to verify everything is working!

