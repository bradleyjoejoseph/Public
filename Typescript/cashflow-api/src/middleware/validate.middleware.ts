import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory.
 *
 * TODO:
 * 1. Parse req[source] (either req.body or req.query) against the Zod schema
 * 2. On success: replace req[source] with the parsed data, call next()
 * 3. On ZodError: respond with 400 { error: first issue's message }
 *
 * @param schema - The Zod schema to validate against
 * @param source - Where to read data from ('body' or 'query')
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    throw new Error('Not implemented');
  };
}
