# Test Cloudinary Integration

## Setup Complete! ✅

Your CMS is now configured to use Cloudinary automatically. Here's what happens:

### Automatic Detection & Upload Flow

```javascript
// In server/routes/upload.ts (lines 137-147)

if (process.env.IMGBB_API_KEY) {
  // Uses ImgBB if configured
  publicUrl = await uploadToImgBB(base64Data);
  uploadMethod = "imgbb";
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  // Uses Cloudinary if configured ✅ YOU ARE HERE
  publicUrl = await uploadToCloudinary(image, filename);
  uploadMethod = "cloudinary";
} else {
  // Falls back to local filesystem
  publicUrl = await uploadToLocalFilesystem(buffer, filename);
}
```

## How to Test

### 1. Add Cloudinary credentials to `.env`:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
```

### 2. Restart the server:

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 3. Test the upload:

#### Option A: Via CMS UI (Easiest)

1. Go to `http://localhost:3000/cms`
2. Login with your admin token
3. Navigate to **"Case Studies"** tab
4. Click **"New Case Study"**
5. Scroll down to the image section
6. Click the upload area
7. Select an image from your computer
8. Watch it upload! 🚀

**Expected Result:**
- You'll see "Uploading..." message
- Image preview appears
- Toast notification: "Image uploaded successfully"
- The image URL will be: `https://res.cloudinary.com/your_cloud_name/image/upload/...`

#### Option B: Via API (For Testing)

```bash
# First, create a small test image in base64
# Here's a 1x1 red pixel PNG:

curl -X POST http://localhost:4000/api/upload \
  -H "Authorization: Bearer YOUR_CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "filename": "test.png"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/test-abc123.png",
  "filename": "test.png",
  "method": "cloudinary"
}
```

## Verify It's Working

### Check 1: Server Logs
When you upload, check the server console. You should see no errors.

### Check 2: Image URL
After upload, the image URL should start with:
```
https://res.cloudinary.com/your_cloud_name/...
```

### Check 3: Cloudinary Dashboard
1. Go to https://cloudinary.com/console/media_library
2. You should see your uploaded images!

## Priority Order

The upload system checks in this order:

1. **ImgBB** (if `IMGBB_API_KEY` is set)
2. **Cloudinary** (if `CLOUDINARY_CLOUD_NAME` is set) ⬅️ Your setup
3. **Local filesystem** (fallback)

## Troubleshooting

### If upload fails:

1. **Check `.env` file** - Make sure all 4 Cloudinary variables are set
2. **Check upload preset** - Must be "Unsigned" in Cloudinary dashboard
3. **Check API secret** - Make sure you copied the full secret (click "Show" in dashboard)
4. **Restart server** - Changes to `.env` require restart
5. **Check console** - Look for error messages in server output

### Common Issues:

**Issue:** "Cloudinary upload failed"
- **Solution:** Check your API credentials are correct

**Issue:** "Upload preset not found"
- **Solution:** Create an unsigned upload preset in Cloudinary dashboard

**Issue:** Image uploads to local filesystem instead
- **Solution:** Make sure `CLOUDINARY_CLOUD_NAME` is set in `.env` and server is restarted

## Success Indicators ✅

When Cloudinary is working correctly:

1. ✅ Image uploads complete in 2-3 seconds
2. ✅ URL starts with `https://res.cloudinary.com/...`
3. ✅ Image is visible in Cloudinary dashboard
4. ✅ Image is accessible from any computer/location
5. ✅ Server console shows `method: "cloudinary"` in response

## Next Steps

Once Cloudinary is working:

1. Upload images for your case studies
2. Images will be stored in Cloudinary's cloud
3. They'll be accessible via CDN worldwide
4. They'll survive server restarts/deployments
5. You get automatic image optimization

---

**Ready to test?** Just add your Cloudinary credentials to `.env` and restart! 🚀

