import { Request } from 'express';

// ─── Enums / Union Types ─────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

// ─── Database Row Types ──────────────────────────────────────────

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export interface CategoryRow {
  id: number;
  user_id: number;
  name: string;
  type: TransactionType;
  colour: string | null;
}

export interface TransactionRow {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  created_at: string;
}

// ─── API Request Types ───────────────────────────────────────────

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateCategoryBody {
  name: string;
  type: TransactionType;
  colour?: string;
}

export interface UpdateCategoryBody {
  name?: string;
  type?: TransactionType;
  colour?: string;
}

export interface CreateTransactionBody {
  category_id: number;
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
}

export interface UpdateTransactionBody {
  category_id?: number;
  amount?: number;
  type?: TransactionType;
  description?: string;
  date?: string;
}

export interface TransactionQuery {
  type?: TransactionType;
  category_id?: string;
  from?: string;
  to?: string;
  sort?: 'date_asc' | 'date_desc';
  page?: string;
  limit?: string;
}

export interface AnalyticsQuery {
  from: string;
  to: string;
  type?: TransactionType;
}

// ─── API Response Types ──────────────────────────────────────────

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface SummaryResponse {
  period: { from: string; to: string };
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: number;
}

export interface CategoryBreakdownItem {
  categoryId: number;
  categoryName: string;
  type: TransactionType;
  total: number;
  count: number;
}

export interface PaginatedResponse<T> {
  transactions: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Extended Request ────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

// ─── Error Types ─────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
