/**
 * @file scripts/verify-db.js
 * @description Verifies Supabase connection and tests database table models.
 * Run using: node scripts/verify-db.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local if present and not in process.env
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('====================================================');
console.log('SIWES Portfolio - Database Verification (Module 2)');
console.log('====================================================\n');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref')) {
  console.log('ℹ️  STATUS: Supabase credentials are not configured in .env.local yet.');
  console.log('\nTo connect your real database:');
  console.log('  1. Create a Supabase project at https://database.new');
  console.log('  2. Copy .env.local.example to .env.local');
  console.log('  3. Paste your Project URL and Publishable/Anon API key');
  console.log('  4. Run the SQL schema in supabase/migrations/20260920000000_create_portfolio_tables.sql');
  console.log('  5. Re-run this check with: npm run db:verify\n');
  console.log('Database models and migration files are ready for deployment.');
  process.exit(0);
}

console.log(`Connecting to: ${supabaseUrl}...`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const tables = ['site_settings', 'profiles', 'skills', 'projects', 'experiences', 'education'];
  console.log('\nChecking table models...');

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: Error - ${error.message} (Code: ${error.code})`);
      } else {
        console.log(`  ✅ ${table}: Table reachable via RLS. Row count: ${count ?? 0}`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: Connection failed - ${err.message}`);
    }
  }

  console.log('\nVerification complete.');
}

testConnection();
