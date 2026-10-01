import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Search } from "lucide-react";
import { jadwal } from "@/data/jadwal";
import { JadwalDoodles } from "./Doodles";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "jadwal-collapsed";

function loadCollapsed(): number[] {
  try {
    const raw = localStorage.getItem(COLLAPSE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "number") : [];
  } catch {
    return [];
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

/* Highlight semua kemunculan query di dalam nama (case-insensitive) */
function HighlightedName({ nama, query }: { nama: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{nama}</>;
  const lower = nama.toLowerCase();
  const needle = q.toLowerCase();
  const parts: { text: string; hit: boolean }[] = [];
  let i = 0;
  while (i < nama.length) {
    const idx = lower.indexOf(needle, i);
    if (idx === -1) {
      parts.push({ text: nama.slice(i), hit: false });
      break;
    }
    if (idx > i) parts.push({ text: nama.slice(i, idx), hit: false });
    parts.push({ text: nama.slice(idx, idx + needle.length), hit: true });
    i = idx + needle.length;
  }
  return (
    <>
      {parts.map((p, j) =>
        p.hit ? (
          <mark key={j} className="jadwal-mark">
            {p.text}
          </mark>
        ) : (
          <span key={j}>{p.text}</span>
        )
      )}
    </>
  );
}

export function Jadwal() {
  const [query, setQuery] = useState("");
  const [filterId, setFilterId] = useState<number | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<number[]>(() =>
    typeof window === "undefined" ? [] : loadCollapsed()
  );
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const copyTimer = useRef<number | null>(null);

  /* Shortcut "/" fokus search, "Escape" reset search */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing = el?.tagName === "INPUT" || el?.tagName === "TEXTAREA";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedIds));
    } catch {
      /* abaikan — mode privat */
    }
  }, [collapsedIds]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const total = jadwal.reduce((n, k) => n + k.anggota.length, 0);
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return jadwal
      .filter((k) => (filterId === null ? true : k.id === filterId))
      .map((k) => ({
        ...k,
        anggota: q
          ? k.anggota.filter((nama) => nama.toLowerCase().includes(q))
          : k.anggota,
      }))
      .filter((k) => (q ? k.anggota.length > 0 : true));
  }, [filterId, q]);

  const matchCount = groups.reduce((n, k) => n + k.anggota.length, 0);

  function toggleCollapse(id: number) {
    setCollapsedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  async function handleCopy(nama: string) {
    const ok = await copyText(nama);
    if (ok) {
      setCopiedName(nama);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopiedName(null), 1500);
    }
  }

  return (
    <div className="relative py-8 lg:py-12">
      <JadwalDoodles />
      <div className="relative max-w-[680px]">
        <p className="text-[13px] font-medium text-[var(--text-secondary)]">
          {jadwal.length} kelompok · {total} anggota
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--text-primary)] lg:text-[28px]">
          Jadwal Jimpitan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Daftar pengambilan jimpitan muda-mudi Danyangan RT03/RW02. Tiap
          kelompok beranggotakan 14 orang dan bergiliran menarik jimpitan
          keliling. Cari namamu, catat kelompokmu.
        </p>
      </div>

      {/* Toolbar: search + filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1 sm:max-w-[360px]">
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama anggota…"
            aria-label="Cari nama anggota"
            className="h-10 w-full rounded-btn border border-[var(--border)] bg-[var(--surface)] pl-9 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none"
          />
          <kbd
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-btn border border-[var(--border)] bg-[var(--bg)] px-1.5 font-mono text-[11px] leading-5 text-[var(--text-secondary)] sm:block"
          >
            /
          </kbd>
        </label>
        <div
          role="group"
          aria-label="Filter kelompok"
          className="flex flex-wrap items-center gap-1.5"
        >
          <FilterChip
            active={filterId === null}
            onClick={() => setFilterId(null)}
            label="Semua"
          />
          {jadwal.map((k) => (
            <FilterChip
              key={k.id}
              active={filterId === k.id}
              onClick={() =>
                setFilterId(filterId === k.id ? null : k.id)
              }
              label={`Kelompok ${k.id}`}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--text-secondary)]">
        Klik nama untuk menyalin · klik header kelompok untuk buka/tutup.
      </p>

      {q && (
        <p className="mt-2 text-[13px] text-[var(--text-secondary)]" role="status">
          {matchCount > 0
            ? `${matchCount} nama cocok dengan “${query.trim()}”.`
            : `Tidak ada nama yang cocok dengan “${query.trim()}”.`}
        </p>
      )}

      {/* Daftar kelompok */}
      <div className="mt-4 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((kelompok) => {
          const collapsed = collapsedIds.includes(kelompok.id);
          return (
            <section
              key={kelompok.id}
              aria-label={kelompok.nama}
              className="overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)]"
            >
              <header className="border-b border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => toggleCollapse(kelompok.id)}
                  aria-expanded={!collapsed}
                  aria-controls={`anggota-${kelompok.id}`}
                  title={collapsed ? "Buka daftar" : "Tutup daftar"}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-[var(--bg)] active:bg-[var(--bg)]"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <ChevronDown
                      size={16}
                      aria-hidden
                      className={cn(
                        "shrink-0 text-[var(--text-secondary)] transition-transform duration-200",
                        collapsed && "-rotate-90"
                      )}
                    />
                    <span className="truncate text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                      {kelompok.nama}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-normal text-[var(--text-secondary)]">
                    {!q
                      ? `${kelompok.anggota.length} orang`
                      : `${kelompok.anggota.length} nama`}
                  </span>
                </button>
              </header>
              {!collapsed &&
                (kelompok.anggota.length > 0 ? (
                  <ol id={`anggota-${kelompok.id}`}>
                    {kelompok.anggota.map((nama, i) => {
                      const copied = copiedName === nama;
                      return (
                        <li
                          key={nama}
                          className={cn(
                            "group flex items-center gap-3 px-4 py-2 text-sm leading-snug",
                            i !== kelompok.anggota.length - 1 &&
                              "border-b border-[#f1f1f3]"
                          )}
                        >
                          <span className="w-6 shrink-0 font-mono text-xs text-[var(--text-secondary)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(nama)}
                            title={`Salin "${nama}"`}
                            aria-label={`Salin nama ${nama}`}
                            className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded px-1 py-0.5 text-left text-[var(--text-primary)] transition-colors hover:bg-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                          >
                            <span className="min-w-0 truncate">
                              <HighlightedName nama={nama} query={query} />
                            </span>
                            <span className="shrink-0 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100">
                              {copied ? (
                                <Check size={14} aria-hidden className="text-[var(--accent)]" />
                              ) : (
                                <Copy size={14} aria-hidden />
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="px-4 py-6 text-center text-[13px] text-[var(--text-secondary)]">
                    Tidak ada anggota cocok.
                  </p>
                ))}
            </section>
          );
        })}
      </div>

      {groups.length === 0 && (
        <div className="mt-4 rounded-card border border-dashed border-[var(--border-strong)] p-8 text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Tidak ditemukan
          </p>
          <p className="mx-auto mt-1 max-w-[40ch] text-[13px] text-[var(--text-secondary)]">
            Coba kata kunci lain atau reset filter kelompok untuk melihat semua
            anggota.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setFilterId(null);
            }}
            className="mt-3 text-sm font-medium text-[var(--accent)] transition-transform duration-150 hover:underline active:scale-95"
          >
            Tampilkan semua anggota
          </button>
        </div>
      )}

      {/* Toast tersalin */}
      <div aria-live="polite">
        {copiedName && (
          <p className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-btn border border-[var(--accent-border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-medium text-[var(--text-primary)] shadow-lg">
            <Check size={14} aria-hidden className="text-[var(--accent)]" />
            Tersalin: {copiedName}
          </p>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-8 rounded-btn border px-3 text-[13px] font-medium transition-all duration-150 active:scale-95",
        active
          ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      )}
    >
      {label}
    </button>
  );
}
