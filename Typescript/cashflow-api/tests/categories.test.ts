import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

// TODO: Before all tests:
// 1. Set up test database
// 2. Register User A and User B, store their tokens
//
// TODO: After all tests: clean up test database

let userAToken: string;
let userBToken: string;

describe('Categories — POST /api/categories', () => {
  it('C1: should create a valid expense category and return 201', async () => {
    // POST /api/categories with { name: 'Food', type: 'expense' }
    // Use userAToken in Authorization header
    // Assert: status 201, response has category with id, name, type, user_id
  });

  it('C2: should create a valid income category and return 201', async () => {
    // POST with { name: 'Salary', type: 'income' }
    // Assert: status 201
  });

  it('C3: should return 400 when type is invalid', async () => {
    // POST with { name: 'Test', type: 'savings' }
    // Assert: status 400
  });

  it('C4: should return 409 for duplicate category (same name + type)', async () => {
    // POST with { name: 'Food', type: 'expense' } again
    // Assert: status 409
  });

  it('C5: should allow same name with different type', async () => {
    // POST with { name: 'Food', type: 'income' }
    // Assert: status 201 — different type means it's not a duplicate
  });
});

describe('Categories — GET /api/categories', () => {
  it('C6: should return only the authenticated user\'s categories', async () => {
    // GET /api/categories as User A
    // Assert: status 200, all returned categories belong to User A
  });

  it('C7: User A should not see User B\'s categories', async () => {
    // Create a category as User B
    // GET /api/categories as User A
    // Assert: User B's category is NOT in the response
  });
});

describe('Categories — PUT /api/categories/:id', () => {
  it('C8: should update category name and return 200', async () => {
    // PUT /api/categories/:id with { name: 'Groceries' }
    // Assert: status 200, category name is updated
  });

  it('C9: should return 409 when update would create a duplicate', async () => {
    // Try to rename a category to match an existing one with same type
    // Assert: status 409
  });
});

describe('Categories — DELETE /api/categories/:id', () => {
  it('C10: should delete category with no transactions and return 204', async () => {
    // Create a fresh category, then delete it
    // Assert: status 204
  });

  it('C11: should return 409 when category has transactions', async () => {
    // Create a transaction under a category, then try to delete the category
    // Assert: status 409
  });

  it('C12: should return 404 when deleting another user\'s category', async () => {
    // Try to delete User B's category using User A's token
    // Assert: status 404
  });
});
