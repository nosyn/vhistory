import { Hono } from 'hono';
import { applySecurityMiddleware } from './middleware/security';
import { errorHandler } from './middleware/error-handler';
import { mountRoutes } from './routes';

// Create main app with base path
const app = new Hono().basePath('/api');

// Apply security middleware
applySecurityMiddleware(app);

// Mount all routes
const routes = mountRoutes(app);

// Global error handler
app.onError(errorHandler);

// Export the route type for RPC client
export type AppType = typeof routes;

export default app;
