import { Pool } from "pg";

export class Database {
  constructor(dbUrl) {
    if (!dbUrl) return;
    this.pool = new Pool({
      connectionString: dbUrl,
    });
  }

  // Execute a query. Returns the `rows` array from pg result.
  async query(queryText, params = []) {
    try {
      const res = await this.pool.query(queryText, params);
      return res.rows;
    } catch (err) {
      // Re-throw so callers can handle/log errors as needed
      throw err;
    }
  }

  // Close the pool (useful for tests or graceful shutdown)
  async close() {
    await this.pool.end();
  }
}
