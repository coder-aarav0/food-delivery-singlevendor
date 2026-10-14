import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local if DATABASE_URL is not set in environment
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('DATABASE_URL=')) {
          dbUrl = trimmed.substring('DATABASE_URL='.length).trim();
          break;
        }
      }
    }
  } catch (err) {
    console.error('Failed reading .env.local:', err.message);
  }
}

if (!dbUrl) {
  console.error('❌ Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

const targetFile = process.argv[2];

if (!targetFile) {
  console.error('Usage: node scripts/run-sql.mjs <path-to-sql-file>');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), targetFile);

if (!fs.existsSync(resolvedPath)) {
  console.error(`❌ Error: File not found: ${resolvedPath}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(resolvedPath, 'utf8');

async function executeSql() {
  console.log(`🔌 Connecting to Supabase via Postgres Pooler...`);
  const sql = postgres(dbUrl, { ssl: 'require', connect_timeout: 10 });
  try {
    console.log(`🚀 Executing SQL script: ${targetFile} (${(sqlContent.length / 1024).toFixed(1)} KB)...`);
    await sql.unsafe(sqlContent);
    console.log(`✅ Successfully executed ${targetFile}!`);
  } catch (err) {
    console.error(`❌ SQL Execution failed:`, err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

executeSql();
