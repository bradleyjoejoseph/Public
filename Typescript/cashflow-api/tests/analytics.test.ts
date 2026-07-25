import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

// TODO: Before all tests, set up comprehensive test data:
// 1. Set up test database
// 2. Register User A and User B
// 3. Create categories for User A:
//    - income: 'Salary', 'Freelance'
//    - expense: 'Food', 'Transport'
// 4. Create transactions for User A:
//    - Salary:    £3500 on 2026-07-01
//    - Freelance: £500  on 2026-07-15
//    - Food:      £200  on 2026-07-05
//    - Food:      £150  on 2026-07-12
//    - Food:      £100  on 2026-07-20
//    - Transport: £50   on 2026-07-03
//    - Transport: £70   on 2026-07-18
// 5. Create some transactions for User B (to test isolation)
//
// TODO: After all tests: clean up test database

let userAToken: string;
let userBToken: string;

describe('Analytics — GET /api/analytics/summary', () => {
  it('AN1: should return correct totals for date range', async () => {
    // GET /api/analytics/summary?from=2026-07-01&to=2026-07-31
    // Assert: totalIncome === 4000 (3500 + 500)
    // Assert: totalExpenses === 570 (200 + 150 + 100 + 50 + 70)
    // Assert: net === 3430
    // Assert: transactionCount === 7
  });

  it('AN2: should return zeros when no transactions in range', async () => {
    // GET /api/analytics/summary?from=2025-01-01&to=2025-01-31
    // Assert: totalIncome === 0, totalExpenses === 0, net === 0, transactionCount === 0
  });

  it('AN3: should only include authenticated user\'s data', async () => {
    // GET /api/analytics/summary as User A
    // Assert: User B's transactions are NOT included in the totals
  });

  it('AN4: should return 400 when from or to is missing', async () => {
    // GET /api/analytics/summary?from=2026-07-01 (no to)
    // Assert: status 400
    // GET /api/analytics/summary?to=2026-07-31 (no from)
    // Assert: status 400
  });
});

describe('Analytics — GET /api/analytics/by-category', () => {
  it('AN5: should return breakdown with all categories', async () => {
    // GET /api/analytics/by-category?from=2026-07-01&to=2026-07-31
    // Assert: breakdown includes Salary, Freelance, Food, Transport
    // Assert: each entry has categoryId, categoryName, type, total, count
  });

  it('AN6: should filter by type=expense', async () => {
    // GET /api/analytics/by-category?from=2026-07-01&to=2026-07-31&type=expense
    // Assert: only Food and Transport in breakdown
    // Assert: no income categories present
  });

  it('AN7: should return empty breakdown when no data in range', async () => {
    // GET /api/analytics/by-category?from=2025-01-01&to=2025-01-31
    // Assert: breakdown is empty array
  });

  it('AN8: should only include authenticated user\'s data', async () => {
    // GET /api/analytics/by-category as User A
    // Assert: User B's categories/transactions are NOT in the breakdown
  });
});
