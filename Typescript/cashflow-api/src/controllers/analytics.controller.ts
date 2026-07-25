import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError } from '../types';

/**
 * GET /api/analytics/summary
 *
 * TODO:
 * 1. Extract from, to from req.query (already validated by Zod)
 * 2. Query the database for the authenticated user's transactions in the date range
 * 3. Calculate:
 *    - totalIncome: SUM(amount) WHERE type = 'income'
 *    - totalExpenses: SUM(amount) WHERE type = 'expense'
 *    - net: totalIncome - totalExpenses
 *    - transactionCount: COUNT(*)
 * 4. Respond with 200 and { period: { from, to }, totalIncome, totalExpenses, net, transactionCount }
 *
 * Hint: You can do this with a single SQL query using conditional aggregation:
 *   SELECT
 *     COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
 *     COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpenses,
 *     COUNT(*) as transactionCount
 *   FROM transactions
 *   WHERE user_id = ? AND date >= ? AND date <= ?
 */
export async function getSummary(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    throw new Error('Not implemented');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/analytics/by-category
 *
 * TODO:
 * 1. Extract from, to, and optional type from req.query
 * 2. Query transactions grouped by category for the authenticated user
 * 3. JOIN with categories to get category name
 * 4. If type filter is provided, only include that type
 * 5. Respond with 200 and { period, breakdown: [{ categoryId, categoryName, type, total, count }] }
 *
 * Hint: Use GROUP BY with JOIN:
 *   SELECT c.id, c.name, c.type, SUM(t.amount) as total, COUNT(*) as count
 *   FROM transactions t
 *   JOIN categories c ON t.category_id = c.id
 *   WHERE t.user_id = ? AND t.date >= ? AND t.date <= ?
 *   GROUP BY c.id
 */
export async function getByCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    throw new Error('Not implemented');
  } catch (err) {
    next(err);
  }
}
