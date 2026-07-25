import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../models/schemas';

const router = Router();

// All category routes require authentication
router.use(authenticate);

// TODO: Wire up the routes:
// GET    /     → getCategories
// POST   /     → validate(createCategorySchema) → createCategory
// PUT    /:id  → validate(updateCategorySchema) → updateCategory
// DELETE /:id  → deleteCategory

export default router;
