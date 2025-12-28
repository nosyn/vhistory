import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { HTTPException } from 'hono/http-exception';
import { rateLimiter } from 'hono-rate-limiter';

/**
 * CORS middleware configuration
 * Allows requests from the same origin and specified domains
 */
export const corsMiddleware = cors({
  origin: (origin) => {
    // Allow same-origin requests (when origin is undefined)
    if (!origin) return '*';

    // In production, restrict to specific domains
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ];

    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
});

/**
 * Rate limiter middleware
 * Prevents abuse by limiting the number of requests per window
 */
export const rateLimiterMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  keyGenerator: (c) => {
    // Use IP address as key
    return (
      c.req.header('x-forwarded-for') ||
      c.req.header('x-real-ip') ||
      'anonymous'
    );
  },
});

/**
 * JSON body size limit middleware
 * Prevents large payloads from overwhelming the server
 */
export const bodySizeLimit = (maxSize: number = 1024 * 1024) => {
  // 1MB default
  return async (c: any, next: any) => {
    const contentLength = c.req.header('content-length');
    if (contentLength && parseInt(contentLength) > maxSize) {
      throw new HTTPException(413, {
        message: 'Payload too large',
      });
    }
    await next();
  };
};

/**
 * Error handler middleware
 * Provides consistent error responses
 */
export const errorHandler = (err: Error, c: any) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status
    );
  }

  console.error('Unhandled error:', err);
  return c.json(
    {
      success: false,
      message: 'Internal server error',
    },
    500
  );
};

/**
 * Apply all security middleware to an app
 */
export const applySecurityMiddleware = (app: Hono) => {
  // Logger for development
  app.use('*', logger());

  // Security headers
  app.use('*', secureHeaders());

  // CORS
  app.use('*', corsMiddleware);

  // Rate limiting
  app.use('*', rateLimiterMiddleware);

  // Body size limit
  app.use('*', bodySizeLimit(2 * 1024 * 1024)); // 2MB limit

  // Trim trailing slashes
  app.use('*', trimTrailingSlash());

  // Error handling
  app.onError(errorHandler);

  return app;
};
