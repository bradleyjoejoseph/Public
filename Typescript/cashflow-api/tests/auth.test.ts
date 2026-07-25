import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

// TODO: Before all tests:
// 1. Set DB_PATH to a test-specific database (e.g. './test-cashflow.db')
// 2. Ensure the test database is initialised with tables
//
// TODO: After all tests:
// 1. Close the database connection
// 2. Delete the test database file

describe('Auth — POST /api/auth/register', () => {
  it('A1: should register with valid data and return 201', async () => {
    // Send POST /api/auth/register with { email, password, name }
    // Assert: status 201
    // Assert: response body has id (number), email, name, token (string)
  });

  it('A2: should return 409 when registering with duplicate email', async () => {
    // Register the same email again
    // Assert: status 409
    // Assert: response body has error property
  });

  it('A3: should return 400 when password is less than 8 characters', async () => {
    // Send with password: '1234567' (7 chars)
    // Assert: status 400
  });

  it('A4: should return 400 when email format is invalid', async () => {
    // Send with email: 'not-an-email'
    // Assert: status 400
  });

  it('A5: should return 400 when name field is missing', async () => {
    // Send without name field
    // Assert: status 400
  });
});

describe('Auth — POST /api/auth/login', () => {
  it('A6: should login with correct credentials and return 200 with token', async () => {
    // Use the email/password from A1
    // Assert: status 200
    // Assert: response body has id, email, name, token
  });

  it('A7: should return 401 when password is wrong', async () => {
    // Use correct email but wrong password
    // Assert: status 401
  });

  it('A8: should return 401 when email does not exist', async () => {
    // Use an email that was never registered
    // Assert: status 401
  });
});

describe('Auth — Protected Route Access', () => {
  it('A9: should return 401 when accessing protected route without token', async () => {
    // Send GET /api/categories with no Authorization header
    // Assert: status 401
  });

  it('A10: should return 401 with expired or malformed token', async () => {
    // Send GET /api/categories with Authorization: 'Bearer invalid-token-here'
    // Assert: status 401
  });
});
