import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

/**
 * Global error handling middleware.
 *
 * TODO:
 * 1. Check if err is an instance of AppError
 *    - If yes: respond with err.statusCode and { error: err.message }
 * 2. For all other errors:
 *    - Log the error to console (console.error)
 *    - Respond with 500 and { error: 'Internal server error' }
 *
 * Remember: Express error middleware MUST have 4 parameters (err, req, res, next)
 */
export function errorHandler(
  if (err instanceof(AppError))
    
}
