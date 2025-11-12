import { NextRequest } from "next/server";
import { deleteInsight, updateInsight } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { insightSchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await assertAdminRequest(request);
    const payload = parseValidation(insightSchema.partial(), await request.json());
    const updated = await updateInsight(params.id, payload);
    return jsonResponse(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await assertAdminRequest(request);
    await deleteInsight(params.id);
    return jsonResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
