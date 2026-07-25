import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Category Schemas ────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Type must be "income" or "expense"' }),
  }),
  colour: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Colour must be a valid hex code (e.g. #FF5733)')
    .optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['income', 'expense']).optional(),
  colour: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

// ─── Transaction Schemas ─────────────────────────────────────────

export const createTransactionSchema = z.object({
  category_id: z.number().int().positive('Category ID must be a positive integer'),
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Type must be "income" or "expense"' }),
  }),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const updateTransactionSchema = z.object({
  category_id: z.number().int().positive().optional(),
  amount: z.number().positive('Amount must be greater than 0').optional(),
  type: z.enum(['income', 'expense']).optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// ─── Analytics Schemas ───────────────────────────────────────────

export const analyticsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'From date must be in YYYY-MM-DD format'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'To date must be in YYYY-MM-DD format'),
  type: z.enum(['income', 'expense']).optional(),
});

// ─── Inferred Types ──────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
