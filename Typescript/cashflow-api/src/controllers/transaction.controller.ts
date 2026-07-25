import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError } from '../types';

/**
 * GET /api/transactions
 *
 * TODO:
 * 1. Parse query params: type, category_id, from, to, sort, page, limit
 * 2. Set defaults: sort='date_desc', page=1, limit=20 (max 100)
 * 3. Build a dynamic SQL query with WHERE clauses based on provided filters
 *    - Always filter by user_id = req.userId
 *    - Add type filter if provided
 *    - Add category_id filter if provided
 *    - Add date >= from if provided
 *    - Add date <= to if provided
 * 4. Get total count (for pagination metadata)
 * 5. Apply ORDER BY (date ASC or DESC) and LIMIT/OFFSET
 * 6. Respond with 200 and { transactions, total, page, totalPages }
 */
export async function getTransactions(
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
 * GET /api/transactions/:id
 *
 * TODO:
 * 1. Find transaction by id AND user_id → 404 if not found
 * 2. JOIN with categories to include the category name in the response
 * 3. Respond with 200 and { transaction: {..., categoryName: '...'} }
 */
export async function getTransaction(
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
 * POST /api/transactions
 *
 * TODO:
 * 1. Extract category_id, amount, type, description, date from req.body
 * 2. Find the category by category_id AND user_id
 *    - If not found: throw new AppError(404, 'Category not found')
 * 3. Check that transaction type matches category type
 *    - If mismatch: throw new AppError(400, 'Transaction type must match category type')
 * 4. Insert into database
 * 5. Respond with 201 and { transaction: {...} }
 */
export async function createTransaction(
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
 * PUT /api/transactions/:id
 *
 * TODO:
 * 1. Find transaction by id AND user_id → 404 if not found
 * 2. If category_id is being changed, verify new category exists and belongs to user
 * 3. Determine the effective type and category after updates
 * 4. Verify type still matches category type → 400 if mismatch
 * 5. Update in database
 * 6. Respond with 200 and { transaction: {...} }
 */
export async function updateTransaction(
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
 * DELETE /api/transactions/:id
 *
 * TODO:
 * 1. Find transaction by id AND user_id → 404 if not found
 * 2. Delete from database
 * 3. Respond with 204 (no content)
 */
export async function deleteTransaction(
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
