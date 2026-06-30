import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '001_add_profiles_rls_policies.sql');
const sql = readFileSync(migrationPath, 'utf-8');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Execute SQL statement by statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

for (const stmt of statements) {
  try {
    const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' });
    if (error) {
      // Fallback: try direct PostgREST approach
      console.log(`Trying alternative approach for: ${stmt.substring(0, 60)}...`);
      const { error: fallbackError } = await supabase.from('_exec_sql').insert({ query: stmt + ';' }).select();
      if (fallbackError) {
        console.error(`Failed to execute: ${stmt.substring(0, 60)}...`);
        console.error(`  Error: ${fallbackError.message}`);
      } else {
        console.log(`  Success`);
      }
    } else {
      console.log(`Success: ${stmt.substring(0, 60)}...`);
    }
  } catch (err) {
    console.error(`Error executing: ${stmt.substring(0, 60)}...`);
    console.error(`  ${err.message}`);
  }
}

console.log('\nIf any statements failed, please apply them manually via the Supabase Dashboard SQL Editor.');
console.log(`Migration file: ${migrationPath}`);
