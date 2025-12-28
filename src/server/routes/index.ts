import { type Hono } from 'hono';
import wordsRoutes from './words';
import blogRoutes from './blog';
import wordOfTheDayRoutes from './word-of-the-day';

/**
 * Mount all API routes onto the provided Hono app instance
 * This allows for a clean separation of route definitions and server setup
 * @param app - The Hono app instance to mount routes on
 * @returns The app instance with all routes mounted (for chaining)
 */
export function mountRoutes(app: Hono) {
  // Mount all route modules
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

  return routes;
}

// Export individual routes for flexibility
export { wordsRoutes, blogRoutes, wordOfTheDayRoutes };
