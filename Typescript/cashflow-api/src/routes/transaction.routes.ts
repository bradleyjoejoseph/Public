import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTransactionSchema, updateTransactionSchema } from '../models/schemas';

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

// TODO: Wire up the routes:
// GET    /     → getTransactions
// GET    /:id  → getTransaction
// POST   /     → validate(createTransactionSchema) → createTransaction
// PUT    /:id  → validate(updateTransactionSchema) → updateTransaction
// DELETE /:id  → deleteTransaction

export default router;
