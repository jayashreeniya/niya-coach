#!/usr/bin/env node

/**
 * Reset the NIYA Practice tables by running the rollback migration,
 * then re-creating them from the migration file.
 *
 * Usage:
 *   node scripts/reset-database.js
 *
 * Env vars required:
 *   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const ROLLBACK_FILE = path.join(__dirname, '..', 'migrations', '001_rollback.sql');
const MIGRATE_FILE = path.join(__dirname, '..', 'migrations', '001_create_practice_tables.sql');

async function getConnection() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !user || !password || !database) {
    console.error(
      '❌ Missing required env vars: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE'
    );
    process.exit(1);
  }

  return mysql.createConnection({
    host,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true,
    charset: 'utf8mb4',
  });
}

async function reset() {
  let connection;

  try {
    console.log('🗑️  Resetting NIYA Practice database...\n');

    connection = await getConnection();
    console.log('🔌 Connected to database');

    // 1. Rollback (drop tables)
    console.log('📥 Running rollback (dropping tables)...');
    const rollbackSql = await fs.readFile(ROLLBACK_FILE, 'utf-8');
    await connection.query(rollbackSql);
    console.log('   Tables dropped.');

    // 2. Re-create tables
    console.log('📥 Running migration (creating tables)...');
    const migrateSql = await fs.readFile(MIGRATE_FILE, 'utf-8');
    await connection.query(migrateSql);
    console.log('   Tables created.');

    console.log('\n✅ Database reset complete. Run `npm run db:seed` to populate data.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    if (process.env.DEBUG) console.error(error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

reset();
