import mysql, {
  Pool,
  PoolConnection,
  RowDataPacket,
  ResultSetHeader,
  PoolOptions,
} from 'mysql2/promise';

// ---------------------------------------------------------------------------
// Configuration — mirrors the existing NIYA Rails database.yml pattern
// (ssl_mode: required, sslverify: false, ssl_ca: false)
// ---------------------------------------------------------------------------

function getPoolConfig(): PoolOptions {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !user || !password || !database) {
    throw new Error(
      'Missing required database environment variables. ' +
        'Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.'
    );
  }

  return {
    host,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.MYSQL_POOL_SIZE || '10', 10),
    maxIdle: 5,
    idleTimeout: 60_000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30_000,
    charset: 'utf8mb4',
    timezone: '+00:00',

    ssl: {
      rejectUnauthorized: false,
    },
  };
}

// ---------------------------------------------------------------------------
// Singleton pool — lazy init so it doesn't throw during next build
// ---------------------------------------------------------------------------

const globalForDb = globalThis as unknown as { __niyaPool?: Pool };

function getPool(): Pool {
  if (!globalForDb.__niyaPool) {
    globalForDb.__niyaPool = mysql.createPool(getPoolConfig());
  }
  return globalForDb.__niyaPool;
}

export function pool(): Pool {
  return getPool();
}

// ---------------------------------------------------------------------------
// query<T>  —  execute a parameterised SQL statement
// ---------------------------------------------------------------------------

export async function query<T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  // Cast params for mysql2 strict typing (unknown[] → any)
  const p = params as any;
  try {
    const [rows] = await pool().execute<T>(sql, p);
    return rows;
  } catch (error) {
    const err = error as mysql.QueryError;

    if (
      err.code === 'PROTOCOL_CONNECTION_LOST' ||
      err.code === 'ECONNRESET' ||
      err.code === 'EPIPE'
    ) {
      console.warn(`[db] Connection lost, retrying query: ${err.code}`);
      const [rows] = await pool().execute<T>(sql, p);
      return rows;
    }

    console.error('[db] Query error:', err.message);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// queryRows<T>  —  convenience wrapper that returns typed row arrays
// ---------------------------------------------------------------------------

export async function queryRows<T extends RowDataPacket>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  return query<T[]>(sql, params);
}

// ---------------------------------------------------------------------------
// queryOne<T>  —  fetch a single row or null
// ---------------------------------------------------------------------------

export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await queryRows<T>(sql, params);
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// execute  —  for INSERT / UPDATE / DELETE (returns ResultSetHeader)
// ---------------------------------------------------------------------------

export async function execute(
  sql: string,
  params?: unknown[]
): Promise<ResultSetHeader> {
  return query<ResultSetHeader>(sql, params);
}

// ---------------------------------------------------------------------------
// transaction  —  run a callback inside a MySQL transaction
// ---------------------------------------------------------------------------

export async function transaction<T>(
  callback: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// ---------------------------------------------------------------------------
// healthCheck  —  verify database connectivity
// ---------------------------------------------------------------------------

export async function healthCheck(): Promise<{
  ok: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await pool().execute('SELECT 1');
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    const err = error as Error;
    return { ok: false, latencyMs: Date.now() - start, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// shutdown  —  drain pool gracefully (for scripts / tests)
// ---------------------------------------------------------------------------

export async function shutdown(): Promise<void> {
  await pool().end();
  delete globalForDb.__niyaPool;
}
