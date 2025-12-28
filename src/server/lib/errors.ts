import { z } from 'zod';

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON(): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

/**
 * Transform Zod errors into user-friendly field errors
 */
export function transformZodError(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join('.');
    const message = getZodErrorMessage(err);

    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(message);
  });

  return fieldErrors;
}

/**
 * Get user-friendly message from Zod error
 */
function getZodErrorMessage(error: z.core.$ZodIssue): string {
  switch (error.code) {
    case 'invalid_type':
      return `Expected ${error.expected}, received ${error.input}`;
    case 'invalid_format':
      if ('format' in error) {
        if (error.format === 'email') {
          return 'Invalid email address';
        }
        if (error.format === 'url') {
          return 'Invalid URL';
        }
        if (error.format === 'uuid') {
          return 'Invalid ID format';
        }
      }
      return error.message || 'Invalid format';
    case 'too_small':
      if (typeof error.input === 'string') {
        return error.minimum === 1
          ? 'This field is required'
          : `Must be at least ${error.minimum} characters`;
      }
      return `Must be at least ${error.minimum}`;
    case 'too_big':
      if (typeof error.input === 'string') {
        return `Must be at most ${error.maximum} characters`;
      }
      return `Must be at most ${error.maximum}`;
    default:
      return error.message || 'Invalid value';
  }
}

/**
 * Common API error codes and messages
 */
export const ErrorCodes = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed. Please check your input.',
    status: 400,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    status: 404,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    status: 401,
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action',
    status: 403,
  },
  CONFLICT: {
    code: 'CONFLICT',
    message: 'Resource already exists',
    status: 409,
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
    status: 500,
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'Invalid request',
    status: 400,
  },
} as const;

/**
 * Create an API error from error code preset
 */
export function createError(
  errorCode: keyof typeof ErrorCodes,
  customMessage?: string,
  details?: Record<string, string[]>
): ApiError {
  const preset = ErrorCodes[errorCode];
  return new ApiError(
    preset.code,
    customMessage || preset.message,
    preset.status,
    details
  );
}
