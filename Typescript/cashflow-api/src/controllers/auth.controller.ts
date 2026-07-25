import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

/**
 * POST /api/auth/register
 *
 * TODO:
 * 1. Extract email, password, name from req.body (already validated by Zod)
 * 2. Check if a user with this email already exists in the database
 *    - If yes: throw new AppError(409, 'Email already registered')
 * 3. Hash the password using hashPassword()
 * 4. Insert the new user into the database
 * 5. Generate a JWT token using generateToken(user.id)
 * 6. Respond with 201 and { id, email, name, token }
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    throw new Error('Not implemented');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 *
 * TODO:
 * 1. Extract email, password from req.body
 * 2. Find user by email in the database
 *    - If not found: throw new AppError(401, 'Invalid credentials')
 * 3. Compare password with stored hash using comparePassword()
 *    - If mismatch: throw new AppError(401, 'Invalid credentials')
 * 4. Generate a JWT token
 * 5. Respond with 200 and { id, email, name, token }
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    throw new Error('Not implemented');
  } catch (err) {
    next(err);
  }
}
