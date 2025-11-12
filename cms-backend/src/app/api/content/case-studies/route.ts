import { NextRequest } from "next/server";
import { createCaseStudy, getCaseStudies } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { caseStudySchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const studies = await getCaseStudies();
    return jsonResponse(studies);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    const payload = parseValidation(caseStudySchema, await request.json());
    const created = await createCaseStudy(payload);
    return jsonResponse(created, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
