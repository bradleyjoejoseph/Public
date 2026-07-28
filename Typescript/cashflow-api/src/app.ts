import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from './routes/transaction.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// TODO: Set up middleware and mount routes
//
// 1. app.use(express.json())  — parse JSON request bodies


//
// 2. Mount route groups:
//    app.use('/api/auth', authRoutes)
//    app.use('/api/categories', categoryRoutes)
//    app.use('/api/transactions', transactionRoutes)
//    app.use('/api/analytics', analyticsRoutes)
//
// 3. Mount the global error handler LAST:
//    app.use(errorHandler)

export default app;
