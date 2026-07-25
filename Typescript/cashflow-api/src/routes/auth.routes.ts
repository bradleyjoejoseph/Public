import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../models/schemas';

const router = Router();

// TODO: Wire up the routes:
// POST /register → validate(registerSchema) → register controller
// POST /login    → validate(loginSchema) → login controller

export default router;
