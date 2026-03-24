/**
 * Run database migration: creates tables for NIYA Practice.
 * Usage: node scripts/run-migration.js
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
  const config = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true,
  };

  console.log(`Connecting to ${config.host}/${config.database}...`);

  const connection = await mysql.createConnection(config);

  try {
    console.log('Connected to Azure MySQL');

    const sqlPath = path.resolve(__dirname, '..', 'migrations', '001_create_practice_tables.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');

    console.log('Running migration 001_create_practice_tables.sql...');
    await connection.query(sql);
    console.log('Migration complete!');

    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME LIKE 'practice%'
       ORDER BY TABLE_NAME`,
      [config.database]
    );

    console.log('\nPractice tables:');
    tables.forEach((t) => console.log(`  - ${t.TABLE_NAME}`));

    const [userTables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_practices'`,
      [config.database]
    );
    if (userTables.length > 0) {
      console.log('  - user_practices');
    }

    const [statsTables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_practice_stats'`,
      [config.database]
    );
    if (statsTables.length > 0) {
      console.log('  - user_practice_stats');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
