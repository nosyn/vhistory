import { Context } from 'hono';
import { ZodError } from 'zod';
import { ApiError, transformZodError, ErrorCodes } from '../lib/errors';
import { StatusCode } from 'hono/utils/http-status';
import { stat } from 'fs';

/**
 * Global error handler for Hono's onError hook
 */
export function errorHandler(err: Error, c: Context) {
  console.error('API Error caught:', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = transformZodError(err);

    c.status(ErrorCodes.VALIDATION_ERROR.status as StatusCode);
    return c.json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR.code,
        message: ErrorCodes.VALIDATION_ERROR.message,
        details: fieldErrors,
      },
    });
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    c.status(err.statusCode as StatusCode);
    return c.json(err.toJSON());
  }

  // Handle unknown errors
  console.error('Unknown error:', err);

  c.status(ErrorCodes.INTERNAL_ERROR.status as StatusCode);
  return c.json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR.code,
      message: ErrorCodes.INTERNAL_ERROR.message,
    },
  });
}
