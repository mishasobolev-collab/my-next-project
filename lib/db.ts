// lib/db.ts
console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined! Make sure it's set in DigitalOcean App Platform, build & run scopes."
  );
}


import { Client, QueryResultRow } from "pg";

/**
 * Run a SQL query and return all rows
 */
export async function query<T extends QueryResultRow = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const result = await client.query<T>(sql, params);
    return result.rows;
  } finally {
    await client.end();
  }
}

/**
 * Run a SQL query and return only the first row
 */
export async function queryOne<T extends QueryResultRow = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

/**
 * Execute a SQL statement that does not return rows (INSERT, UPDATE, DELETE)
 */
export async function execute(sql: string, params: any[] = []): Promise<void> {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    await client.query(sql, params);
  } finally {
    await client.end();
  }
}