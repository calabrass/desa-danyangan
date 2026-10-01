# Persimuda — Web Komunitas Danyangan RT03/RW02

SPA mobile-first untuk komunitas muda-mudi Persimuda (Danyangan RT03/RW02, Banyudono, Boyolali):
papan info jadwal jimpitan, dokumentasi kegiatan, dan pengumuman desa.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + komponen UI internal (`src/components/ui`)
- Supabase (PostgreSQL) — **read-only** tabel `announcements` untuk fitur Pengumuman
- Tanpa auth/login, tanpa backend sendiri, tanpa upload file

## Fitur

| Tab | Sumber data |
|---|---|
| Home | Statis + tautan laporan warga via WhatsApp |
| Pengumuman | Live dari Supabase (`announcements`, terbaru di atas, badge untuk `is_important`) |
| Jadwal | Statis (`src/data/jadwal.ts`) — cari nama, filter kelompok, klik nama untuk salin |
| Kegiatan | Statis + foto di `public/foto/` (`src/data/kegiatan.ts`) |

## Menjalankan lokal

```bash
npm install
npm run dev
```

### Konfigurasi Supabase (wajib untuk tab Pengumuman)

1. Buat file `.env` di root (jangan commit file ini — sudah di-ignore). Contoh isi ada di `.env.example`:

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=isi-anon-key-di-sini
```

> Pakai **anon public key**, bukan `service_role`. Key `VITE_*` ikut ter-embed ke bundle
> frontend (public by design) — keamanan tulis-baca diatur via RLS di dashboard Supabase.

2. Buat tabel `announcements` + RLS read-publik (detail SQL ada di `supa.md` — file itu
   di-ignore git, hanya untuk maintainer lokal):

```sql
create table announcements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  image_url text,
  is_important boolean default false not null
);

alter table announcements enable row level security;

create policy "public read"
on announcements for select
using (true);

grant select on public.announcements to anon;
```

3. Restart dev server (Vite membaca `.env` saat start).

## Scripts

```bash
npm run dev     # dev server
npm run build   # typecheck + production build ke dist/
npm run lint    # oxlint
npm run preview # pratinjau hasil build
```

## Deploy (Vercel)

1. Push repo ini (file sensitif `.env`, arsip `foto kegiatan/`, dan dokumen internal
   `DESIGN.md`/`PRD (1).md`/`WORKFLOW.md`/`supa.md` sudah di-ignore via `.gitignore`).
2. Import repo di Vercel → framework preset **Vite**.
3. Isi Environment Variables (Production): `VITE_SUPABASE_URL` dan
   `VITE_SUPABASE_ANON_KEY` dari dashboard Supabase.
4. Deploy. Pastikan RLS di Supabase hanya mengizinkan `SELECT` untuk akses publik.

## Struktur

```
src/
  components/   # Home, Pengumuman, Jadwal, Kegiatan, Navbar, ui/
  data/         # jadwal.ts, kegiatan.ts, announcements.ts (tipe)
  hooks/        # useAnnouncements.ts (fetch Supabase)
  lib/          # supabaseClient.ts, utils.ts
public/foto/    # foto deploy (renang.jpg, kegiatan/)
```

## Catatan keamanan

- Jangan taruh `service_role key`, password database, atau secret server di `VITE_*` / kode frontend.
- Jangan commit `.env`. Rotasi key di dashboard Supabase jika key pernah bocor ke repo publik.
- Kolom `image_url` diisi URL `https://` tepercaya atau path lokal `/foto/...` saja.
