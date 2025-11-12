import { NextRequest } from "next/server";
import { assertAdminRequest } from "@/lib/admin-auth";
import { handleError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    return jsonResponse({ valid: true });
  } catch (error) {
    return handleError(error);
  }
}
