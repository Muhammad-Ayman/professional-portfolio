import { NextRequest } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { assertAdminRequest } from "@/lib/admin-auth";
import { ApiError, handleError, jsonResponse } from "@/lib/http";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadToCloudinary(base64Image: string, filename: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new ApiError(500, "Cloudinary is not configured");
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "portfolio");
  formData.append("public_id", filename);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const parsed = JSON.parse(errorText);
      throw new ApiError(500, `Cloudinary upload failed: ${parsed.error?.message ?? errorText}`);
    } catch {
      throw new ApiError(500, `Cloudinary upload failed: ${errorText}`);
    }
  }

  const data = await response.json();
  return data.secure_url as string;
}

async function uploadToImgBB(base64Data: string) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "ImgBB is not configured");
  }

  const formData = new URLSearchParams();
  formData.append("key", apiKey);
  formData.append("image", base64Data);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(500, `ImgBB upload failed: ${error.error?.message ?? "Unknown error"}`);
  }

  const data = await response.json();
  return data.data.url as string;
}

async function uploadToLocalFilesystem(buffer: Buffer, filename: string) {
  const ext = filename.split(".").pop();
  const safeName = filename.replace(/[^a-z0-9.-]/gi, "_");
  const uniqueName = `${safeName}-${randomUUID().slice(0, 8)}.${ext}`;

  const uploadDir = path.resolve(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  return `/uploads/${uniqueName}`;
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    const body = await request.json();
    const { image, filename } = body as { image?: string; filename?: string };

    if (!image || typeof image !== "string") {
      throw new ApiError(400, "No image data provided");
    }

    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new ApiError(400, "Invalid image format");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    if (!ALLOWED_TYPES.includes(mimeType)) {
      throw new ApiError(400, `Unsupported image type. Allowed: ${ALLOWED_TYPES.join(", ")}`);
    }

    const buffer = Buffer.from(base64Data, "base64");
    if (buffer.length > MAX_SIZE) {
      throw new ApiError(400, `Image too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB`);
    }

    const preferredName = filename || `upload-${Date.now()}.${mimeType.split("/")[1]}`;
    let publicUrl: string;
    let method = "local";

    try {
      if (process.env.IMGBB_API_KEY) {
        publicUrl = await uploadToImgBB(base64Data);
        method = "imgbb";
      } else if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_UPLOAD_PRESET
      ) {
        publicUrl = await uploadToCloudinary(image, preferredName);
        method = "cloudinary";
      } else {
        publicUrl = await uploadToLocalFilesystem(buffer, preferredName);
      }
    } catch (cloudError) {
      console.error("[Upload] Cloud provider failed, falling back to local storage", cloudError);
      publicUrl = await uploadToLocalFilesystem(buffer, preferredName);
      method = "local";
    }

    return jsonResponse({
      success: true,
      url: publicUrl,
      filename: preferredName,
      method,
    });
  } catch (error) {
    return handleError(error);
  }
}
