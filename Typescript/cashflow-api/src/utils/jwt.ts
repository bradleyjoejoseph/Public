import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRY = '1h';

/**
 * Generate a signed JWT containing the user's ID.
 * TODO: Use jwt.sign() with { userId } payload, JWT_SECRET, and { expiresIn: JWT_EXPIRY }
 */
export function generateToken(userId: number): string {
  return jwt.sign({userId}, JWT_SECRET, {expiresIn: JWT_EXPIRY})
}

/**
 * Verify and decode a JWT token.
 * TODO: Use jwt.verify() — return { userId } on success, null on failure.
 * Catch any errors (expired, malformed) and return null.
 */
export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}
