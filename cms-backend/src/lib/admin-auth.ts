import type { NextRequest } from "next/server";
import { ApiError } from "./http";
import { getAdminToken as fetchAdminToken } from "./content-store";

const TOKEN_CACHE_TTL = 60_000; // 1 minute

let cachedToken: string | null | undefined = undefined;
let cacheTime = 0;

export async function getAdminToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken !== undefined && now - cacheTime < TOKEN_CACHE_TTL) {
    return cachedToken;
  }

  const token = await fetchAdminToken();
  cachedToken = token;
  cacheTime = now;
  return token;
}

export function invalidateAdminTokenCache() {
  cachedToken = undefined;
  cacheTime = 0;
}

export async function assertAdminAuthorization(header: string | null) {
  const adminToken = await getAdminToken();

  if (!adminToken) {
    throw new ApiError(500, "CMS admin token is not configured. Set CMS_ADMIN_TOKEN first.");
  }

  if (!header) {
    throw new ApiError(401, "Missing Authorization header");
  }

  const [scheme, token] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    throw new ApiError(401, "Authorization header must use Bearer token");
  }

  if (token !== adminToken) {
    throw new ApiError(403, "Invalid token");
  }
}

export async function assertAdminRequest(request: NextRequest) {
  const header = request.headers.get("authorization");
  await assertAdminAuthorization(header);
}
