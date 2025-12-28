import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

/**
 * Custom validator that throws ZodError instead of returning response
 * This allows our error handler middleware to catch and format the error
 */
export function validator<
  T extends z.ZodType,
  Target extends 'json' | 'query' | 'param' | 'header' | 'form'
>(target: Target, schema: T) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      // Throw the error so our error handler middleware can catch it
      throw result.error;
    }
  });
}
