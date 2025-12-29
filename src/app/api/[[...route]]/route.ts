import { handle } from 'hono/vercel';
import app from '@/server';

// TODO: Enable edge runtime when all dependencies are compatible
// export const runtime = 'edge';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
