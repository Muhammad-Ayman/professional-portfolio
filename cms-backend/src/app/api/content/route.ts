import { getAllContent } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  try {
    const content = await getAllContent();
    return jsonResponse(content);
  } catch (error) {
    return handleError(error);
  }
}
