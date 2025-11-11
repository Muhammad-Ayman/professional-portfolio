# Cloudinary Setup - Fixed Version

## The Problem

You were seeing `/uploads/Picture1.png-32298d30.png` which means it was using **local filesystem**, not Cloudinary.

## The Fix

I've updated the code to:
1. ✅ Use unsigned uploads (no API key/secret needed)
2. ✅ Add detailed console logging
3. ✅ Only require 2 environment variables (not 4)

## Setup Steps

### 1. Cloudinary Dashboard

1. Go to https://cloudinary.com/console
2. Click **Settings** (gear icon, top right)
3. Click **Upload** tab (left sidebar)
4. Scroll to **"Upload presets"** section
5. Click **"Add upload preset"**
6. Configure:
   - **Preset name:** `portfolio_uploads`
   - **Signing mode:** Select **"Unsigned"** ⚠️ IMPORTANT!
   - **Folder:** `portfolio` (optional, organizes your images)
7. Click **"Save"**

### 2. Get Your Cloud Name

On the Cloudinary dashboard (https://cloudinary.com/console):
- Look at the top of the page
- You'll see **"Cloud name: dxxxxx"**
- That's your cloud name (e.g., `dexample123`)

### 3. Update Your `.env`

Add ONLY these 2 lines to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=dexample123
CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
```

**Replace `dexample123` with YOUR actual cloud name!**

### 4. Restart Server

```bash
# Stop current server (Ctrl+C if running)
pnpm dev
```

### 5. Check Server Logs

When the server starts, look for:
```
[server] Server running on http://localhost:4000/
[server] CMS_ADMIN_TOKEN is configured ✓
```

When you upload an image, you should see:
```
[Upload] Using Cloudinary...
[Upload] Uploading to Cloudinary (dexample123)...
[Upload] Cloudinary success: https://res.cloudinary.com/dexample123/...
```

## Test Upload

1. Go to `http://localhost:3000/cms`
2. Login
3. Create/Edit a case study
4. Upload an image
5. **Watch the server console** - you should see the Cloudinary logs
6. The success message should say: `Image uploaded successfully (☁️ Cloudinary)`
7. The URL should be: `https://res.cloudinary.com/your_cloud_name/...`

## Troubleshooting

### Issue: Still seeing `/uploads/` (local path)

**Check your `.env` file:**
```bash
# Make sure you have BOTH:
CLOUDINARY_CLOUD_NAME=dexample123
CLOUDINARY_UPLOAD_PRESET=portfolio_uploads

# And remove these if you added them:
# CLOUDINARY_API_KEY=...  ❌ NOT NEEDED
# CLOUDINARY_API_SECRET=... ❌ NOT NEEDED
```

**Then restart:** `pnpm dev`

### Issue: Server says "No cloud provider configured"

Check the server console when you try to upload. You should see:
```
[Upload] Using Cloudinary...
```

If you see:
```
[Upload] No cloud provider configured, using local filesystem
[Upload] To use cloud: Set IMGBB_API_KEY or CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET
```

This means:
- Your `.env` doesn't have the variables
- Or you didn't restart the server after adding them

### Issue: "Cloudinary upload failed"

Check the error in server console. Common issues:
1. **Upload preset not found** → Make sure the preset name matches exactly
2. **Upload preset is signed** → Change to "Unsigned" in Cloudinary dashboard
3. **Invalid cloud name** → Double-check your cloud name from dashboard

### Issue: Network tab shows nothing

This means the upload isn't reaching the server. Check:
1. Is the server running? (`pnpm dev`)
2. Check browser console for errors
3. Make sure you're logged in to CMS

## Verification Checklist

✅ Cloudinary account created
✅ Upload preset created with "Unsigned" mode
✅ `.env` has `CLOUDINARY_CLOUD_NAME`
✅ `.env` has `CLOUDINARY_UPLOAD_PRESET`
✅ Server restarted after editing `.env`
✅ Server console shows "Using Cloudinary..." when uploading
✅ Upload success message shows "☁️ Cloudinary"
✅ Image URL starts with `https://res.cloudinary.com/`
✅ Image appears in Cloudinary media library

## What Changed

The old version required:
- ❌ `CLOUDINARY_API_KEY`
- ❌ `CLOUDINARY_API_SECRET`
- ❌ Complex signature generation
- ❌ Signed uploads

The new version only needs:
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_UPLOAD_PRESET`
- ✅ Simple unsigned uploads
- ✅ No authentication complexity

This is the recommended approach for client-side uploads!


