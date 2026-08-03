import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || './cashflow.db';

const db: InstanceType<typeof Database> = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
// Enable foreign key enforcement
db.pragma('foreign_keys = ON');

function initialise(): void {
  // TODO: Write CREATE TABLE IF NOT EXISTS statements for:
  //
  // 1. users
  //    - id:            INTEGER PRIMARY KEY AUTOINCREMENT
  //    - email:         TEXT UNIQUE NOT NULL
  //    - password_hash: TEXT NOT NULL
  //    - name:          TEXT NOT NULL
  //    - created_at:    TEXT NOT NULL DEFAULT (datetime('now'))
db.exec(`CREATE TABLE users (
    id INT PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    passowrd_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAILT (datetime('now'))
)`)


  // 2. categories
  //    - id:      INTEGER PRIMARY KEY AUTOINCREMENT
  //    - user_id: INTEGER NOT NULL REFERENCES users(id)
  //    - name:    TEXT NOT NULL
  //    - type:    TEXT NOT NULL CHECK(type IN ('income', 'expense'))
  //    - colour:  TEXT
  //    - UNIQUE(user_id, name, type)

db.exec(`CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT
    user_id INTEGER NOT NULL REFERENCES user(id)
  )`)
  // 3. transactions
  //    - id:          INTEGER PRIMARY KEY AUTOINCREMENT
  //    - user_id:     INTEGER NOT NULL REFERENCES users(id)
  //    - category_id: INTEGER NOT NULL REFERENCES categories(id)
  //    - amount:      REAL NOT NULL CHECK(amount > 0)
  //    - type:        TEXT NOT NULL CHECK(type IN ('income', 'expense'))
  //    - description: TEXT
  //    - date:        TEXT NOT NULL
  //    - created_at:  TEXT NOT NULL DEFAULT (datetime('now'))

}

initialise();

export default db;
