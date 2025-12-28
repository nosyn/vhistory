import { Hono } from 'hono';
import { applySecurityMiddleware } from './middleware/security';
import wordsRoutes from './routes/words';
import blogRoutes from './routes/blog';
import wordOfTheDayRoutes from './routes/word-of-the-day';

// Create main app with base path
const app = new Hono().basePath('/api');

// Apply security middleware
applySecurityMiddleware(app);

// Mount routes and create route instance for type export
const routes = app
  .route('/', wordsRoutes)
  .route('/blog', blogRoutes)
  .route('/word-of-the-day', wordOfTheDayRoutes)
  .get('/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

// Export the route type for RPC client (not the app type)
export type AppType = typeof routes;

export default app;
