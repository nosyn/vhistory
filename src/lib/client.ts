import { hc } from 'hono/client';
import type { AppType } from '@/server';

const baseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const client = hc<AppType>(baseUrl);

export const api = client.api;
