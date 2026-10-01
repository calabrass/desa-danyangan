import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Megaphone, Pin, RefreshCw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { formatTanggal, type Announcement } from "@/data/announcements";
import { useAnnouncementDetail, useAnnouncements } from "@/hooks/useAnnouncements";

function SkeletonCard() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="aspect-[16/10] w-full animate-pulse bg-[#f4f4f5]" />
      <div className="space-y-2 p-4 sm:p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-[#f4f4f5]" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#f4f4f5]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#f4f4f5]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[#f4f4f5]" />
      </div>
    </div>
  );
}

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function AnnouncementCard({
  item,
  onOpen,
}: {
  item: Announcement;
  onOpen: (slugOrId: string) => void;
}) {
  const key = item.slug || item.id;
  return (
    <article
      className={`card-hover overflow-hidden rounded-card border bg-[var(--surface)] ${
        item.is_important
          ? "border-[var(--accent-border)]"
          : "border-[var(--border)]"
      }`}
    >
      {item.image_url && (
        <span className="block w-full overflow-hidden bg-[#f4f4f5]">
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
        </span>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {formatTanggal(item.created_at)}
          </span>
          {item.is_important && (
            <Badge variant="solid">
              <Pin size={12} aria-hidden />
              Penting
            </Badge>
          )}
        </div>
        <h2 className="mt-2 text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-[17px]">
          {item.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {item.excerpt}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpen(key)}
          className="mt-3 px-0 text-[var(--accent)] hover:bg-transparent hover:underline"
        >
          Baca Selengkapnya
          <ArrowRight size={15} strokeWidth={2} aria-hidden />
        </Button>
      </div>
    </article>
  );
}

function DetailView({
  slugOrId,
  onBack,
}: {
  slugOrId: string;
  onBack: () => void;
}) {
  const { data, loading, error } = useAnnouncementDetail(slugOrId);

  if (loading) {
    return (
      <div className="mx-auto max-w-[680px]">
        <div className="h-4 w-32 animate-pulse rounded bg-[#f4f4f5]" />
        <div className="mt-3 overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
          <div className="h-3 w-28 animate-pulse rounded bg-[#f4f4f5]" />
          <div className="mt-3 h-7 w-3/4 animate-pulse rounded bg-[#f4f4f5]" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-[#f4f4f5]" />
          <div className="mt-4 aspect-[16/9] w-full animate-pulse rounded-btn bg-[#f4f4f5]" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-[#f4f4f5]" />
            <div className="h-3 w-full animate-pulse rounded bg-[#f4f4f5]" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-[#f4f4f5]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-[680px] rounded-card border border-dashed border-[var(--border-strong)] p-8 text-center">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {error ?? "Pengumuman tidak ditemukan."}
        </p>
        <Button variant="outline" size="sm" onClick={onBack} className="mt-4">
          <ArrowLeft size={15} aria-hidden />
          Kembali ke daftar
        </Button>
      </div>
    );
  }

  const minutes = readingMinutes(`${data.excerpt} ${data.content}`);
  const paragraphs = data.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-[680px]">
      <button
        onClick={onBack}
        className="group flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-transform duration-150 hover:underline active:scale-95"
      >
        <ArrowLeft
          size={15}
          strokeWidth={2}
          aria-hidden
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Semua pengumuman
      </button>

      <article className="mt-3 overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)]">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              {formatTanggal(data.created_at)}
            </span>
            <span
              aria-hidden
              className="text-[var(--border-strong)]"
            >
              ·
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <Clock size={12} aria-hidden />
              {minutes} menit baca
            </span>
            {data.is_important && (
              <Badge variant="solid">
                <Pin size={12} aria-hidden />
                Penting
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)] lg:text-[28px]">
            {data.title}
          </h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-[var(--text-secondary)]">
            {data.excerpt}
          </p>
        </div>

        <Separator />

        {data.image_url && (
          <figure className="bg-[#f4f4f5]">
            <img
              src={data.image_url}
              alt={data.title}
              className="aspect-[16/9] w-full object-cover"
            />
            <figcaption className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-2 font-mono text-[11px] text-[var(--text-secondary)] sm:px-7">
              Dokumentasi · {data.title}
            </figcaption>
          </figure>
        )}

        <div className="space-y-4 p-5 sm:p-7">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--text-primary)]"
            >
              {p}
            </p>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3 p-5 sm:px-7">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Persimuda
            </p>
            <p className="truncate text-xs text-[var(--text-secondary)]">
              Danyangan RT03/RW02, Banyudono
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft size={15} aria-hidden />
            Kembali
          </Button>
        </div>
      </article>
    </div>
  );
}

export function Pengumuman() {
  const { data, loading, error, refetch } = useAnnouncements();
  const [selected, setSelected] = useState<string | null>(null);

  function handleOpen(slugOrId: string) {
    setSelected(slugOrId);
    window.scrollTo({ top: 0 });
  }

  function handleBack() {
    setSelected(null);
    window.scrollTo({ top: 0 });
  }

  if (selected) {
    return (
      <div className="py-8 lg:py-12">
        <DetailView slugOrId={selected} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-[680px]">
        <p className="text-[13px] font-medium text-[var(--text-secondary)]">
          {loading ? "Memuat…" : error ? "Gagal memuat" : `${data.length} pengumuman`}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--text-primary)] lg:text-[28px]">
          Pengumuman Desa
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Info resmi Persimuda Danyangan RT03/RW02 — ditarik langsung dari
          database, terbaru di atas.
        </p>
      </div>

      {loading && (
        <div className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Memuat pengumuman">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-card border border-dashed border-[var(--border-strong)] p-8 text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Gagal memuat pengumuman
          </p>
          <p className="mx-auto mt-1 max-w-[44ch] text-[13px] text-[var(--text-secondary)]">
            {error}
          </p>
          <Button variant="outline" size="sm" onClick={refetch} className="mt-4">
            <RefreshCw size={14} aria-hidden />
            Coba lagi
          </Button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="mt-8 rounded-card border border-dashed border-[var(--border-strong)] p-8 text-center">
          <Megaphone
            size={20}
            aria-hidden
            className="mx-auto text-[var(--text-secondary)]"
          />
          <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
            Belum ada pengumuman desa saat ini.
          </p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {data.map((item) => (
            <AnnouncementCard key={item.id} item={item} onOpen={handleOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
