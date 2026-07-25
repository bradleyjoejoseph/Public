import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError } from '../types';

/**
 * GET /api/categories
 *
 * TODO: Query all categories WHERE user_id = req.userId
 * Respond with 200 and { categories: [...] }
 */
export async function getCategories(
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
 * POST /api/categories
 *
 * TODO:
 * 1. Extract name, type, colour from req.body
 * 2. Check for existing category with same name + type for this user
 *    - If exists: throw new AppError(409, 'Category already exists')
 * 3. Insert into database
 * 4. Respond with 201 and { category: {...} }
 */
export async function createCategory(
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
 * PUT /api/categories/:id
 *
 * TODO:
 * 1. Find category by id AND user_id → 404 if not found
 * 2. Merge updates (only update fields that are provided)
 * 3. Check the updated name+type wouldn't duplicate another category → 409
 * 4. Update in database
 * 5. Respond with 200 and { category: {...} }
 */
export async function updateCategory(
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
 * DELETE /api/categories/:id
 *
 * TODO:
 * 1. Find category by id AND user_id → 404 if not found
 * 2. Check if any transactions reference this category
 *    - If yes: throw new AppError(409, 'Cannot delete category with transactions')
 * 3. Delete the category
 * 4. Respond with 204 (no content)
 */
export async function deleteCategory(
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
