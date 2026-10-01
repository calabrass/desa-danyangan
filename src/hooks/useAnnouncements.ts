import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Announcement } from "@/data/announcements";

interface ListState {
  data: Announcement[];
  loading: boolean;
  error: string | null;
}

export function useAnnouncements(): ListState & { refetch: () => void } {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        if (!cancelled) {
          setData([]);
          setError(
            "Konfigurasi Supabase belum ditemukan. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env."
          );
          setLoading(false);
        }
        return;
      }
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
      const { data: rows, error: err } = await supabase
        .from("announcements")
        .select("id,created_at,title,slug,excerpt,content,image_url,is_important")
        .order("is_important", { ascending: false })
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (err) {
        console.error("[pengumuman] list gagal dimuat:", err);
        setError("Gagal memuat pengumuman. Periksa koneksi lalu coba lagi.");
        setData([]);
      } else {
        setData((rows ?? []) as Announcement[]);
        setError(null);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, refetch };
}

interface DetailState {
  data: Announcement | null;
  loading: boolean;
  error: string | null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useAnnouncementDetail(slugOrId: string | null): DetailState {
  const [data, setData] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const key: string = slugOrId;

    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        if (!cancelled) {
          setError("Konfigurasi Supabase belum ditemukan.");
          setLoading(false);
        }
        return;
      }
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
      /* Jangan pakai .or(slug.eq.X,id.eq.X): saat X bukan UUID,
         Postgres gagal cast "X" ke tipe uuid (error 22P02) dan detail
         selalu gagal. Pilih kolom berdasarkan format nilai. */
      const base = supabase
        .from("announcements")
        .select("id,created_at,title,slug,excerpt,content,image_url,is_important");
      const { data: row, error: err } = await (UUID_RE.test(key)
        ? base.eq("id", key).maybeSingle()
        : base.eq("slug", key).maybeSingle());

      if (cancelled) return;
      if (err || !row) {
        console.error("[pengumuman] detail gagal dimuat:", err);
        setError("Pengumuman tidak ditemukan atau gagal dimuat.");
        setData(null);
      } else {
        setData(row as Announcement);
        setError(null);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  return { data, loading, error };
}
