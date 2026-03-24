/**
 * NIYA Practice — QA Test Workflow Script
 *
 * Run: node scripts/test-workflow.js
 *
 * This script outlines critical user flows to test manually or with
 * end-to-end testing tools (Playwright, Cypress, etc.).
 * It also performs basic environment and dependency checks.
 */

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// Colours
// ─────────────────────────────────────────────────────────────────────────────
const G = '\x1b[32m';
const R = '\x1b[31m';
const Y = '\x1b[33m';
const C = '\x1b[36m';
const B = '\x1b[1m';
const X = '\x1b[0m';

let pass = 0;
let fail = 0;
let warn = 0;

function ok(msg) { pass++; console.log(`  ${G}✓${X} ${msg}`); }
function bad(msg) { fail++; console.log(`  ${R}✗${X} ${msg}`); }
function notice(msg) { warn++; console.log(`  ${Y}⚠${X} ${msg}`); }
function section(title) { console.log(`\n${B}${C}── ${title}${X}\n`); }

// ─────────────────────────────────────────────────────────────────────────────
// 1. File structure checks
// ─────────────────────────────────────────────────────────────────────────────
section('1. Project Structure');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.ts',
  '.env.example',
  'app/layout.tsx',
  'app/page.tsx',
  'app/(practice)/layout.tsx',
  'app/(practice)/practice/page.tsx',
  'app/(practice)/practice/[id]/page.tsx',
  'app/(practice)/complete/page.tsx',
  'app/(practice)/progress/page.tsx',
  'app/api/health/route.ts',
  'app/api/tts/route.ts',
  'app/api/tts/prefetch/route.ts',
  'app/api/practice/complete/route.ts',
  'app/api/settings/route.ts',
  'lib/db.ts',
  'lib/auth.ts',
  'lib/auth-options.ts',
  'lib/practice-queries.ts',
  'lib/practice-actions.ts',
  'lib/streak.ts',
  'lib/score.ts',
  'lib/utils.ts',
  'lib/tts-service.ts',
  'lib/tts-cache.ts',
  'lib/speech-fallback.ts',
  'lib/analytics.ts',
  'hooks/useAuth.ts',
  'hooks/usePracticeTimer.ts',
  'hooks/usePracticeAudio.ts',
  'hooks/useWindowSize.ts',
  'types/database.ts',
  'types/tts.ts',
  'types/api.ts',
  'types/props.ts',
  'types/next-auth.d.ts',
  'components/auth/AuthProvider.tsx',
  'components/auth/LoginButton.tsx',
  'components/navigation/NavBar.tsx',
  'components/practice/PhaseIndicator.tsx',
  'components/practice/StreakDisplay.tsx',
  'components/practice/PracticeCard.tsx',
  'components/practice/ScoreWidget.tsx',
  'components/practice/CompletionMessage.tsx',
  'components/practice/AudioGuidedPlayer.tsx',
  'components/practice/TextPracticePlayer.tsx',
  'components/practice/PracticePlayerWrapper.tsx',
  'components/practice/BreathingAnimation.tsx',
  'components/practice/LanguageSelectionModal.tsx',
  'components/practice/MoodCheckIn.tsx',
  'components/practice/ReflectionInput.tsx',
  'components/practice/CalendarHeatmap.tsx',
  'components/practice/ScoreBreakdownCard.tsx',
  'components/practice/SettingsForm.tsx',
  'components/integration/AppFooter.tsx',
  'components/integration/CoachingLink.tsx',
  'components/integration/PracticeBanner.tsx',
  'data/seed-practices-90day.sql',
  'scripts/seed-database.js',
  'scripts/verify-practices.js',
  '.github/workflows/deploy-production.yml',
  '.github/workflows/pr-check.yml',
  'Dockerfile',
];

const root = path.resolve(__dirname, '..');
for (const f of requiredFiles) {
  if (fs.existsSync(path.join(root, f))) {
    ok(f);
  } else {
    bad(`Missing: ${f}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Package.json checks
// ─────────────────────────────────────────────────────────────────────────────
section('2. Dependencies & Scripts');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const requiredDeps = [
  'next', 'react', 'react-dom', 'next-auth', 'mysql2',
  '@headlessui/react', 'react-confetti', 'clsx',
  'microsoft-cognitiveservices-speech-sdk',
];
for (const dep of requiredDeps) {
  if (pkg.dependencies?.[dep]) {
    ok(`dep: ${dep} (${pkg.dependencies[dep]})`);
  } else {
    bad(`Missing dependency: ${dep}`);
  }
}

const requiredScripts = ['dev', 'build', 'start', 'lint', 'db:seed', 'db:verify'];
for (const s of requiredScripts) {
  if (pkg.scripts?.[s]) {
    ok(`script: ${s}`);
  } else {
    bad(`Missing script: ${s}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Environment variables check
// ─────────────────────────────────────────────────────────────────────────────
section('3. Environment Variables');

const requiredEnvVars = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_NIYA_URL',
];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    ok(`${envVar} is set`);
  } else {
    notice(`${envVar} not set (required for runtime)`);
  }
}

// Optional but recommended
const optionalEnvVars = ['AZURE_TTS_KEY', 'AZURE_TTS_REGION', 'APPLE_CLIENT_ID', 'MICROSOFT_CLIENT_ID'];
for (const envVar of optionalEnvVars) {
  if (process.env[envVar]) {
    ok(`${envVar} is set`);
  } else {
    notice(`${envVar} not set (optional)`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Seed data check
// ─────────────────────────────────────────────────────────────────────────────
section('4. Seed Data');

const seedPath = path.join(root, 'data', 'seed-practices-90day.sql');
if (fs.existsSync(seedPath)) {
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  const insertCount = (seedContent.match(/\(\d+,\s*'/g) || []).length;
  if (insertCount >= 90) {
    ok(`Seed file contains ${insertCount} practice INSERT values`);
  } else {
    bad(`Seed file only has ${insertCount} inserts (expected >= 90)`);
  }
} else {
  bad('Seed file not found');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Critical user flow checklists
// ─────────────────────────────────────────────────────────────────────────────
section('5. Manual Test Flows');

const flows = [
  {
    name: 'New User — First Practice',
    steps: [
      'Visit practice.niya.app → see landing page',
      'Click Sign in with Google → OAuth flow → redirect to /practice',
      'See Day 1 practice card with audio/text buttons',
      'Phase indicator shows "Foundation Phase — Day 1 of 90"',
      'Click Audio Guidance → language modal opens',
      'Select English → navigate to /practice/1?mode=audio&lang=en',
      'Audio player loads, orb animates, step text displays',
      'Pause / resume works, skip step works',
      'After last step → redirect to /complete',
      'Select mood (1-5), add optional reflection',
      'Click Done for Today → streak updates, redirect to /practice',
      'Dashboard shows "completed today" message',
    ],
  },
  {
    name: 'Returning User — Text Mode',
    steps: [
      'Already authenticated → lands on /practice',
      'Correct day practice displayed based on total_practices',
      'Click Read & Practice → /practice/[day]?mode=text',
      'Timer counts down for each step',
      'Breathing animation on Settle/Reflect steps',
      'Skip and pause buttons work',
      'Complete → mood check → redirect to dashboard',
    ],
  },
  {
    name: 'Streak Logic',
    steps: [
      'Complete practice on Day 1 → streak = 1',
      'Complete practice on Day 2 → streak = 2',
      'Skip Day 3, return Day 4 → streak resets to 1',
      'Milestone days (3, 7, 14, 21, 30, 60, 90) show confetti',
    ],
  },
  {
    name: 'Progress Page',
    steps: [
      'Navigate to /progress → see stats grid',
      'Calendar heatmap shows last 30 days with green/grey',
      'Score breakdown shows completion/mood/consistency bars',
      'Recent practices list with mood emoji',
      'Coaching CTA links to niya.app/coaching',
      'Settings: change reminder time, timezone, language',
      'Save settings → success message',
      'Sign out → redirected to landing page',
    ],
  },
  {
    name: 'Edge Cases',
    steps: [
      'First-time user (no stats) → default stats created',
      'User completes 90 days → cycles back to Day 1',
      'Visit /practice/0 or /practice/91 → 404 page',
      'Visit /practice/abc → 404 page',
      'Double-complete same day → unique constraint prevents duplicate',
      'Network error on API → graceful error message',
      'Refresh during practice → exit confirmation dialog',
      'Browser back button from practice → exit confirmation',
    ],
  },
  {
    name: 'Audio Features',
    steps: [
      'Azure TTS configured → audio plays from Azure voice',
      'Azure TTS not configured → browser speech fallback',
      'Browser voice shows "Using browser voice" badge',
      'Pause gaps between steps countdown displayed',
      'Language selection modal shows 4 languages with samples',
      'Preferred language saved after audio practice',
    ],
  },
  {
    name: 'Cross-App Integration',
    steps: [
      'Footer shows NIYA ecosystem links on all pages',
      'Coaching CTA on progress page links to niya.app',
      'Landing page footer links work',
      'Sign out clears session on .niya.app domain',
    ],
  },
  {
    name: 'Responsive Design',
    steps: [
      'Mobile (375px) — all layouts stack properly',
      'Tablet (768px) — practice card comfortable width',
      'Desktop (1440px) — max-width container centred',
      'Calendar heatmap 10-column grid responsive',
      'Language modal full-width on mobile',
    ],
  },
  {
    name: 'Deployment',
    steps: [
      'Push to main → GitHub Actions deploys to Azure',
      'Health check at /api/health returns 200',
      'practice.niya.app resolves (CNAME + SSL)',
      'Environment variables set in Azure App Service',
      'Database connection works from Azure',
    ],
  },
];

for (const flow of flows) {
  console.log(`  ${B}${flow.name}${X}`);
  flow.steps.forEach((step, i) => {
    console.log(`    ${i + 1}. ${step}`);
  });
  console.log('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
section('Summary');

console.log(`  ${G}Passed: ${pass}${X}`);
console.log(`  ${Y}Warnings: ${warn}${X}`);
console.log(`  ${R}Failed: ${fail}${X}`);
console.log('');

if (fail > 0) {
  console.log(`${R}${B}  ✗ Fix ${fail} failure(s) before deploying.${X}\n`);
  process.exit(1);
} else if (warn > 0) {
  console.log(`${Y}${B}  ⚠ ${warn} warning(s) — check env vars before deploying.${X}\n`);
  process.exit(0);
} else {
  console.log(`${G}${B}  ✓ All automated checks passed! Run manual flows above.${X}\n`);
  process.exit(0);
}
