import { NextRequest } from "next/server";
import { updateAdminToken } from "@/lib/content-store";
import {
  assertAdminRequest,
  getAdminToken,
  invalidateAdminTokenCache,
} from "@/lib/admin-auth";
import { ApiError, handleError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  try {
    const existingToken = await getAdminToken();
    const { token } = await request.json();

    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new ApiError(400, "Token is required and must be a non-empty string");
    }

    // If a token already exists, require authentication to change it
    if (existingToken) {
      await assertAdminRequest(request);
    }

    await updateAdminToken(token.trim());
    invalidateAdminTokenCache();

    return jsonResponse({ success: true, message: "Admin token updated successfully" });
  } catch (error) {
    return handleError(error);
  }
}
