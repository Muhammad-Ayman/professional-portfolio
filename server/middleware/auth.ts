import { NextFunction, Request, Response } from "express";

const headerName = "authorization";

function getAdminToken(): string | undefined {
  return process.env.CMS_ADMIN_TOKEN ?? process.env.ADMIN_API_KEY ?? process.env.API_TOKEN;
}

export function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const adminToken = getAdminToken();

  if (!adminToken) {
    res.status(500).json({
      error: "CMS_ADMIN_TOKEN is not configured on the server.",
    });
    return;
  }

  const authorization = req.header(headerName);
  if (!authorization) {
    res.status(401).json({
      error: "Missing Authorization header",
    });
    return;
  }

  const [scheme, token] = authorization.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    res.status(401).json({
      error: "Authorization header must use Bearer token",
    });
    return;
  }

  if (token !== adminToken) {
    res.status(403).json({
      error: "Invalid token",
    });
    return;
  }

  next();
}

