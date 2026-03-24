#!/usr/bin/env node

/**
 * Verify the 90-day practice curriculum in the database.
 *
 * Usage:
 *   node scripts/verify-practices.js
 *
 * Env vars required:
 *   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 */

const mysql = require('mysql2/promise');

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
    charset: 'utf8mb4',
  });
}

async function verify() {
  let connection;

  try {
    console.log('🔍 Verifying 90-Day Practice Curriculum\n');

    connection = await getConnection();
    console.log('🔌 Connected to database\n');

    // 1. Total count
    const [countRows] = await connection.query(
      'SELECT COUNT(*) AS total FROM practices'
    );
    const total = countRows[0].total;
    console.log(`Total practices in database: ${total}`);

    if (total === 0) {
      console.error('❌ No practices found. Run: npm run db:seed');
      process.exit(1);
    }

    // 2. Fetch all practices ordered by day
    const [practices] = await connection.query(`
      SELECT
        day_number,
        title,
        duration_minutes,
        language,
        JSON_LENGTH(instructions) AS steps,
        JSON_VALID(instructions) AS json_ok,
        CHAR_LENGTH(description) AS desc_len
      FROM practices
      ORDER BY day_number
    `);

    // 3. Display by phase
    let currentPhase = '';
    let phaseCount = 0;
    let errors = [];

    practices.forEach((p) => {
      const phase =
        p.day_number <= 30
          ? 'FOUNDATION (Days 1-30)'
          : p.day_number <= 60
          ? 'DEVELOPMENT (Days 31-60)'
          : 'INTEGRATION (Days 61-90)';

      if (phase !== currentPhase) {
        if (currentPhase) console.log(`   Phase total: ${phaseCount}\n`);
        console.log(`--- ${phase} ---\n`);
        currentPhase = phase;
        phaseCount = 0;
      }

      phaseCount++;
      const status = p.json_ok && p.steps >= 2 ? '✅' : '⚠️';
      console.log(
        `${status} Day ${String(p.day_number).padStart(2)}: ${p.title} ` +
          `(${p.steps} steps, ${p.duration_minutes} min, ${p.desc_len} char desc)`
      );

      // Collect errors
      if (!p.json_ok) {
        errors.push(`Day ${p.day_number}: Invalid JSON in instructions`);
      }
      if (p.steps < 2) {
        errors.push(`Day ${p.day_number}: Only ${p.steps} steps (expected 3)`);
      }
      if (p.duration_minutes <= 0) {
        errors.push(`Day ${p.day_number}: Invalid duration ${p.duration_minutes}`);
      }
    });
    console.log(`   Phase total: ${phaseCount}\n`);

    // 4. Check for missing days
    const dayNumbers = practices.map((p) => p.day_number);
    const missing = [];
    for (let i = 1; i <= 90; i++) {
      if (!dayNumbers.includes(i)) missing.push(i);
    }

    if (missing.length > 0) {
      errors.push(`Missing days: ${missing.join(', ')}`);
    }

    // 5. Check for duplicates
    const [dupes] = await connection.query(`
      SELECT day_number, COUNT(*) AS cnt
      FROM practices
      GROUP BY day_number
      HAVING cnt > 1
    `);
    if (dupes.length > 0) {
      dupes.forEach((d) => {
        errors.push(`Day ${d.day_number}: Duplicate (${d.cnt} entries)`);
      });
    }

    // 6. Verify step structure (sample deep check)
    const [sampleDeep] = await connection.query(`
      SELECT day_number, title, instructions
      FROM practices
      WHERE day_number IN (1, 30, 45, 60, 75, 90)
      ORDER BY day_number
    `);

    console.log('🔬 Deep structure check (sample days):\n');
    sampleDeep.forEach((row) => {
      let steps;
      try {
        steps = typeof row.instructions === 'string'
          ? JSON.parse(row.instructions)
          : row.instructions;
      } catch {
        errors.push(`Day ${row.day_number}: JSON parse failed`);
        return;
      }

      const hasRequiredFields = steps.every(
        (s) => s.step && s.title && s.text && s.duration_seconds != null
      );
      const hasPauseAfter = steps.every((s) => s.pause_after != null);

      console.log(`   Day ${String(row.day_number).padStart(2)}: ${row.title}`);
      steps.forEach((s) => {
        console.log(
          `      Step ${s.step}: "${s.title}" — ${s.duration_seconds}s, ` +
            `pause ${s.pause_after || 0}s, ${s.text.length} chars`
        );
      });
      console.log(
        `      Required fields: ${hasRequiredFields ? '✅' : '❌'}  ` +
          `Pause timing: ${hasPauseAfter ? '✅' : '⚠️ missing'}`
      );
      console.log();

      if (!hasRequiredFields) {
        errors.push(`Day ${row.day_number}: Missing required step fields`);
      }
    });

    // 7. Summary
    console.log('═══════════════════════════════════');
    console.log(`  Total practices : ${total}`);
    console.log(`  Unique days     : ${dayNumbers.length}`);
    console.log(`  Missing days    : ${missing.length === 0 ? 'None' : missing.join(', ')}`);
    console.log(`  Duplicates      : ${dupes.length === 0 ? 'None' : dupes.length}`);
    console.log(`  Errors          : ${errors.length}`);
    console.log('═══════════════════════════════════\n');

    if (errors.length > 0) {
      console.warn('⚠️  Issues found:');
      errors.forEach((e) => console.warn(`   - ${e}`));
      console.log();
      process.exit(1);
    } else {
      console.log('✅ Verification complete — all 90 practices valid!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    if (process.env.DEBUG) console.error(error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

verify();
