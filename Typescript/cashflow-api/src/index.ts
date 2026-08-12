import { error } from 'console';
import { Request } from 'express';
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CashFlow API running on http://localhost:${PORT}`);
});

export type TransactionType = "income" | "expense";

export class AppError extends Error {
  public statuscode: number;

  constructor(statuscode: number, message: string) {
    super(message);
    this.statuscode = statuscode;

  }
}

