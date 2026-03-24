#!/usr/bin/env node

/**
 * Seed the NIYA Practice database with the 90-day curriculum.
 *
 * Usage:
 *   node scripts/seed-database.js
 *
 * Env vars required:
 *   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 *   MYSQL_PORT (optional, default 3306)
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'seed-practices-90day.sql');

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

async function seed() {
  let connection;

  try {
    // 1. Read seed file
    console.log('📄 Reading seed file...');
    let sql;
    try {
      sql = await fs.readFile(SEED_FILE, 'utf-8');
    } catch (err) {
      console.error(`❌ Could not read ${SEED_FILE}: ${err.message}`);
      process.exit(1);
    }
    console.log(`   File size: ${(Buffer.byteLength(sql) / 1024).toFixed(1)} KB`);

    // 2. Connect
    console.log('🔌 Connecting to Azure MySQL...');
    connection = await getConnection();
    console.log('   Connected successfully');

    // 3. Check for existing data
    const [existing] = await connection.query(
      'SELECT COUNT(*) AS cnt FROM practices'
    );
    const existingCount = existing[0].cnt;

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing practices.`);
      console.log('   Clearing existing data before re-seeding...');
      await connection.query('DELETE FROM practices');
      console.log('   Cleared.');
    }

    // 4. Execute seed SQL
    console.log('📥 Inserting 90-day practice curriculum...');
    await connection.query(sql);
    console.log('   Insert complete.');

    // 5. Validate total count
    const [countRows] = await connection.query(
      'SELECT COUNT(*) AS count FROM practices'
    );
    const total = countRows[0].count;
    console.log(`\n✅ Total practices inserted: ${total}`);

    // 6. Verify all 90 unique days
    const [dayRows] = await connection.query(
      'SELECT COUNT(DISTINCT day_number) AS unique_days FROM practices'
    );
    const uniqueDays = dayRows[0].unique_days;

    if (uniqueDays === 90) {
      console.log('✅ All 90 days present');
    } else {
      console.warn(`⚠️  Only ${uniqueDays} unique days found (expected 90)`);
    }

    // 7. Phase breakdown
    const [phases] = await connection.query(`
      SELECT
        CASE
          WHEN day_number <= 30 THEN 'Foundation (1-30)'
          WHEN day_number <= 60 THEN 'Development (31-60)'
          ELSE 'Integration (61-90)'
        END AS phase,
        COUNT(*) AS count
      FROM practices
      GROUP BY phase
      ORDER BY MIN(day_number)
    `);
    console.log('\n📊 Phase breakdown:');
    phases.forEach((p) => {
      console.log(`   ${p.phase}: ${p.count} practices`);
    });

    // 8. Verify JSON structure (sample)
    const [sampleRows] = await connection.query(
      'SELECT day_number, title, JSON_LENGTH(instructions) AS step_count FROM practices ORDER BY day_number LIMIT 5'
    );
    console.log('\n📋 Sample practices:');
    sampleRows.forEach((row) => {
      console.log(
        `   Day ${String(row.day_number).padStart(2)}: ${row.title} (${row.step_count} steps)`
      );
    });

    // 9. Verify JSON integrity for ALL rows
    const [badJson] = await connection.query(
      "SELECT day_number, title FROM practices WHERE JSON_VALID(instructions) = 0"
    );
    if (badJson.length > 0) {
      console.warn('\n⚠️  Invalid JSON found in:');
      badJson.forEach((r) => console.warn(`   Day ${r.day_number}: ${r.title}`));
    } else {
      console.log('\n✅ JSON structure valid for all 90 practices');
    }

    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
      console.error(
        '   Duplicate entry detected. Run with a clean table or use --force.'
      );
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error(
        '   Could not connect to database. Check MYSQL_HOST and network.'
      );
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Access denied. Check MYSQL_USER and MYSQL_PASSWORD.');
    } else if (error.code === 'ER_PARSE_ERROR') {
      console.error('   SQL syntax error in seed file.');
    }

    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();
