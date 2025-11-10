import { ZodSchema } from "zod";

export function parseValidation<T>(schema: ZodSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const errors = result.error.flatten();
    const error = new Error("Invalid request payload");
    (error as Error & { status?: number; details?: typeof errors }).status = 400;
    (error as Error & { status?: number; details?: typeof errors }).details = errors;
    throw error;
  }

  return result.data;
}

