import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';

/**
 * Authentication middleware.
 *
 * TODO:
 * 1. Get the Authorization header from the request
 * 2. Check it exists and starts with 'Bearer '
 * 3. Extract the token (everything after 'Bearer ')
 * 4. Call verifyToken() to decode it
 * 5. If valid: set req.userId = decoded.userId, call next()
 * 6. If invalid/missing: respond with 401 { error: 'Unauthorized' }
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  throw new Error('Not implemented');
}
