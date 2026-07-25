import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password using bcrypt.
 * TODO: Implement using bcrypt.hash()
 */
export async function hashPassword(password: string): Promise<string> {
  throw new Error('Not implemented');
}

/**
 * Compare a plain-text password against a bcrypt hash.
 * TODO: Implement using bcrypt.compare()
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  throw new Error('Not implemented');
}
