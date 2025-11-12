import { NextRequest } from "next/server";
import { createInsight, getInsights } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { insightSchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const insights = await getInsights();
    return jsonResponse(insights);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    const payload = parseValidation(insightSchema, await request.json());
    const created = await createInsight(payload);
    return jsonResponse(created, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
