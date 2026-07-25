import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

// TODO: Before all tests:
// 1. Set up test database
// 2. Register User A and User B
// 3. Create categories: User A gets 'Salary' (income) and 'Food' (expense)
// 4. Create categories: User B gets their own categories
//
// TODO: After all tests: clean up test database

let userAToken: string;
let userBToken: string;
let incomeCategory: number;  // ID of User A's income category
let expenseCategory: number; // ID of User A's expense category

describe('Transactions — POST /api/transactions', () => {
  it('T1: should create a valid expense transaction and return 201', async () => {
    // POST with { category_id: expenseCategory, amount: 25.50, type: 'expense', date: '2026-07-20' }
    // Assert: status 201, response has transaction with all fields
  });

  it('T2: should create a valid income transaction and return 201', async () => {
    // POST with { category_id: incomeCategory, amount: 3500, type: 'income', date: '2026-07-01' }
    // Assert: status 201
  });

  it('T3: should return 400 when amount is 0 or negative', async () => {
    // POST with amount: 0 and then amount: -10
    // Assert: status 400 for both
  });

  it('T4: should return 400 when type mismatches category type', async () => {
    // POST income transaction under expense category
    // Assert: status 400
  });

  it('T5: should return 404 when category_id does not exist', async () => {
    // POST with category_id: 99999
    // Assert: status 404
  });

  it('T6: should return 404 when using another user\'s category', async () => {
    // POST using User B's category ID with User A's token
    // Assert: status 404
  });
});

describe('Transactions — GET /api/transactions', () => {
  // Before these tests, create 5 transactions with different dates for pagination testing

  it('T7: should list transactions with no filters and return paginated results', async () => {
    // GET /api/transactions
    // Assert: status 200, has transactions array, total, page, totalPages
  });

  it('T8: should filter transactions by type', async () => {
    // GET /api/transactions?type=expense
    // Assert: all returned transactions have type 'expense'
  });

  it('T9: should filter transactions by date range', async () => {
    // GET /api/transactions?from=2026-07-01&to=2026-07-15
    // Assert: all returned transactions are within the date range
  });

  it('T10: should filter transactions by category_id', async () => {
    // GET /api/transactions?category_id=<expenseCategory>
    // Assert: all returned transactions have the matching category_id
  });

  it('T11: should paginate correctly — page 1 limit 2 of 5', async () => {
    // GET /api/transactions?page=1&limit=2
    // Assert: transactions.length === 2, total === 5 (or however many exist), totalPages === ceil(total/2)
  });

  it('T12: should return remaining items on last page', async () => {
    // GET /api/transactions?page=3&limit=2 (when total is 5)
    // Assert: transactions.length === 1
  });

  it('T13: should sort by date ascending when sort=date_asc', async () => {
    // GET /api/transactions?sort=date_asc
    // Assert: first transaction date <= last transaction date
  });

  it('T14: should sort by date descending by default', async () => {
    // GET /api/transactions
    // Assert: first transaction date >= last transaction date
  });
});

describe('Transactions — GET /api/transactions/:id', () => {
  it('T15: should return single transaction with category name', async () => {
    // GET /api/transactions/:id
    // Assert: status 200, response includes categoryName or category_name
  });

  it('T16: should return 404 for another user\'s transaction', async () => {
    // Create a transaction as User B, try to GET it as User A
    // Assert: status 404
  });
});

describe('Transactions — PUT /api/transactions/:id', () => {
  it('T17: should update transaction amount and return 200', async () => {
    // PUT /api/transactions/:id with { amount: 50.00 }
    // Assert: status 200, amount is updated
  });

  it('T18: should return 400 when update creates type mismatch', async () => {
    // PUT /api/transactions/:id changing type to 'income' while category is 'expense'
    // Assert: status 400
  });
});

describe('Transactions — DELETE /api/transactions/:id', () => {
  it('T19: should delete own transaction and return 204', async () => {
    // DELETE /api/transactions/:id
    // Assert: status 204
    // Verify: GET /api/transactions/:id returns 404
  });

  it('T20: should return 404 when deleting another user\'s transaction', async () => {
    // Try to delete User B's transaction with User A's token
    // Assert: status 404
  });
});
