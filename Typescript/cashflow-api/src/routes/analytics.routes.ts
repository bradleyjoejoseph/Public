import { Router } from 'express';
import { getSummary, getByCategory } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { analyticsQuerySchema } from '../models/schemas';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// TODO: Wire up the routes:
// GET /summary     → validate(analyticsQuerySchema, 'query') → getSummary
// GET /by-category → validate(analyticsQuerySchema, 'query') → getByCategory

export default router;
