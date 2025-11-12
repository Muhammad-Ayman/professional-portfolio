import { NextRequest } from "next/server";
import { createFAQ, getFAQs } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { faqSchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const faqs = await getFAQs();
    return jsonResponse(faqs);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    const payload = parseValidation(faqSchema, await request.json());
    const created = await createFAQ(payload);
    return jsonResponse(created, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
