import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { user } from '@/lib/db/auth-schema';

// Generate base schema from Drizzle and refine it
const insertUserSchema = createInsertSchema(user).extend({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Login schema
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Register schema extending the insert schema
export const registerSchema = insertUserSchema
  .pick({ name: true, email: true })
  .extend({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
