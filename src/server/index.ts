import { Hono } from 'hono';
import { applySecurityMiddleware } from './middleware/security';
import wordsRoutes from './routes/words';
import blogRoutes from './routes/blog';
import wordOfTheDayRoutes from './routes/word-of-the-day';

// Create main app with base path
const app = new Hono().basePath('/api');

// Apply security middleware
applySecurityMiddleware(app);

// Mount routes
app.route('/', wordsRoutes);
app.route('/blog', blogRoutes);
app.route('/word-of-the-day', wordOfTheDayRoutes);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Export the app type for RPC client
export type AppType = typeof app;

export default app;
