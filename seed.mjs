import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = 'postgresql://postgres.cjeoznjadtdssgrtbcck:alamfaisalrehan@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

const sql = postgres(dbUrl, { ssl: 'require' });

async function run() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf-8');
    
    await sql.unsafe(schemaSql);
    
    console.log("✅ Data berhasil diimpor ke Supabase!");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat import:", error);
  } finally {
    await sql.end();
  }
}

run();
