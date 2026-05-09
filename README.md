# MainYuk

Website absensi simpel untuk teman main. Akses utamanya:

- `/main` untuk rekap lengkap.
- `/main/faisal`, `/main/alam`, `/main/raihan`, `/main/rozik`, `/main/ikbal`, `/main/denar`, `/main/avatar` untuk link pribadi teman.
- `/main/admin` untuk reset absensi harian dan reset PIN teman ke `1234`.

## Setup

1. Buat project Supabase.
2. Jalankan SQL di `supabase/schema.sql` lewat Supabase SQL Editor.
3. Copy `.env.example` menjadi `.env.local`.
4. Isi:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PIN`
5. Jalankan:

```bash
npm install
npm run dev
```

PIN awal semua teman adalah `1234`. Setelah masuk, teman bisa ganti PIN sendiri.
