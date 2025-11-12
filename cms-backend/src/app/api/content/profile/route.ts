import { NextRequest } from "next/server";
import { getProfile, updateProfile } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { profileSchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await getProfile();
    return jsonResponse(profile);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    const payload = parseValidation(profileSchema, await request.json());
    const updated = await updateProfile(payload);
    return jsonResponse(updated);
  } catch (error) {
    return handleError(error);
  }
}
