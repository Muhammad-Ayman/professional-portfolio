import { Router } from "express";
import { writeFile, mkdir } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "node:crypto";
import { requireAdminToken } from "../middleware/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRouter = Router();

// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Upload to Cloudinary (if configured)
async function uploadToCloudinary(base64Image: string, filename: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error("Cloudinary not configured - missing CLOUDINARY_CLOUD_NAME");
  }

  if (!uploadPreset) {
    throw new Error("Cloudinary not configured - missing CLOUDINARY_UPLOAD_PRESET");
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  // For unsigned uploads, we only need the file and upload_preset
  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "portfolio"); // Optional: organize in folder

  console.log(`[Upload] Uploading to Cloudinary (${cloudName})...`);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Upload] Cloudinary error:", errorText);
    let errorMessage = "Unknown error";
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.error?.message || errorText;
    } catch {
      errorMessage = errorText;
    }
    throw new Error(`Cloudinary upload failed: ${errorMessage}`);
  }

  const data = await response.json();
  console.log(`[Upload] Cloudinary success: ${data.secure_url}`);
  return data.secure_url;
}

// Upload to ImgBB (free alternative, no auth needed)
async function uploadToImgBB(base64Data: string) {
  const apiKey = process.env.IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error("ImgBB not configured");
  }

  const formData = new URLSearchParams();
  formData.append("key", apiKey);
  formData.append("image", base64Data); // Just the base64 data, not the data:image prefix

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`ImgBB upload failed: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();
  return data.data.url;
}

// Upload to local filesystem (fallback)
async function uploadToLocalFilesystem(buffer: Buffer, filename: string) {
  const ext = filename.split(".").pop();
  const safeName = filename.replace(/[^a-z0-9.-]/gi, "_");
  const uniqueName = `${safeName}-${randomUUID().slice(0, 8)}.${ext}`;

  const uploadDir =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "..", "public", "uploads")
      : path.resolve(__dirname, "..", "..", "dist", "public", "uploads");

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  return `/uploads/${uniqueName}`;
}

uploadRouter.post("/", requireAdminToken, async (req, res, next) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      res.status(400).json({ error: "No image data provided" });
      return;
    }

    // Parse base64 image
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: "Invalid image format" });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    if (!ALLOWED_TYPES.includes(mimeType)) {
      res.status(400).json({ error: `Unsupported image type. Allowed: ${ALLOWED_TYPES.join(", ")}` });
      return;
    }

    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length > MAX_SIZE) {
      res.status(400).json({ error: `Image too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB` });
      return;
    }

    let publicUrl: string;
    let uploadMethod = "local";

    // Try cloud providers first
    try {
      if (process.env.IMGBB_API_KEY) {
        console.log("[Upload] Using ImgBB...");
        publicUrl = await uploadToImgBB(base64Data);
        uploadMethod = "imgbb";
      } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
        console.log("[Upload] Using Cloudinary...");
        publicUrl = await uploadToCloudinary(image, filename || "upload");
        uploadMethod = "cloudinary";
      } else {
        console.log("[Upload] No cloud provider configured, using local filesystem");
        console.log("[Upload] To use cloud: Set IMGBB_API_KEY or CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET");
        // Fallback to local filesystem
        publicUrl = await uploadToLocalFilesystem(buffer, filename || `upload-${Date.now()}.${mimeType.split("/")[1]}`);
      }
    } catch (cloudError) {
      console.error("[Upload] Cloud upload failed:", cloudError);
      console.log("[Upload] Falling back to local filesystem");
      publicUrl = await uploadToLocalFilesystem(buffer, filename || `upload-${Date.now()}.${mimeType.split("/")[1]}`);
    }

    res.json({
      success: true,
      url: publicUrl,
      filename: filename || "uploaded-image",
      method: uploadMethod,
    });
  } catch (error) {
    next(error);
  }
});

export default uploadRouter;

