import type { ZodSchema } from "zod";
import { ApiError } from "./http";

export function parseValidation<T>(schema: ZodSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const errors = result.error.flatten();
    throw new ApiError(400, "Invalid request payload", errors);
  }

  return result.data;
}
