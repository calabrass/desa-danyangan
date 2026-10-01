import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { kegiatan } from "@/data/kegiatan";
import { Badge } from "./ui/badge";

/* Hanya tampilkan kegiatan yang punya foto dokumentasi asli.
   Entri tanpa foto disembunyikan (datanya tetap di data/kegiatan.ts —
   begitu diisi path fotonya, kartunya muncul otomatis). */
const denganFoto = kegiatan.filter((item) => item.foto);

export function Kegiatan() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const selected = lightboxIndex !== null ? denganFoto[lightboxIndex] : undefined;

  function openLightbox(id: number) {
    const idx = denganFoto.findIndex((item) => item.id === id);
    if (idx !== -1) setLightboxIndex(idx);
  }

  function step(dir: 1 | -1) {
    if (lightboxIndex === null || denganFoto.length === 0) return;
    setLightboxIndex(
      (prev) => (prev === null ? 0 : (prev + dir + denganFoto.length) % denganFoto.length)
    );
  }

  /* Esc tutup, panah navigasi, kunci scroll body saat lightbox terbuka */
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  });

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-[680px]">
        <p className="text-[13px] font-medium text-[var(--text-secondary)]">
          {denganFoto.length} kegiatan terdokumentasi
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--text-primary)] lg:text-[28px]">
          Kegiatan Persimuda
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Arsip foto dan cerita dari lapangan &mdash; jalan sehat, lomba 17-an,
          sampai renang bareng. Klik foto untuk memperbesar.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {denganFoto.map((item) => (
          <article
            key={item.id}
            className="card-hover overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)]"
          >
            <button
              type="button"
              onClick={() => openLightbox(item.id)}
              aria-label={`Perbesar foto ${item.judul}`}
              title="Klik untuk memperbesar"
              className="group relative block w-full overflow-hidden bg-[#f4f4f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <img
                src={item.foto}
                alt={item.judul}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-btn bg-black/60 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand size={12} aria-hidden />
                Perbesar
              </span>
            </button>
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  {item.tanggal}
                </span>
                {item.tag && <Badge variant="accent">{item.tag}</Badge>}
              </div>
              <h2 className="mt-2 text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-[17px]">
                {item.judul}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.deskripsi}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${selected.judul}`}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
        >
          <button
            aria-label="Tutup pratinjau"
            onClick={() => setLightboxIndex(null)}
            className="absolute inset-0 cursor-zoom-out bg-black/75"
          />
          <figure className="lightbox-enter relative w-full max-w-3xl overflow-hidden rounded-card bg-[var(--surface)] shadow-2xl">
            <img
              src={selected.foto}
              alt={selected.judul}
              className="max-h-[70vh] w-full bg-black object-contain"
            />
            <figcaption className="flex items-start justify-between gap-3 p-4 sm:p-5">
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
                  {selected.tanggal}
                  {selected.tag && <Badge variant="accent">{selected.tag}</Badge>}
                </span>
                <span className="mt-1 block text-[15px] font-semibold text-[var(--text-primary)]">
                  {selected.judul}
                </span>
                <span className="mt-0.5 block text-sm text-[var(--text-secondary)]">
                  {selected.deskripsi}
                </span>
                {denganFoto.length > 1 && (
                  <span className="mt-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    {(lightboxIndex ?? 0) + 1} / {denganFoto.length} · geser dengan ← →
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {denganFoto.length > 1 && (
                  <>
                    <button
                      onClick={() => step(-1)}
                      aria-label="Foto sebelumnya"
                      className="rounded-btn border border-[var(--border)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <ChevronLeft size={16} aria-hidden />
                    </button>
                    <button
                      onClick={() => step(1)}
                      aria-label="Foto berikutnya"
                      className="rounded-btn border border-[var(--border)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <ChevronRight size={16} aria-hidden />
                    </button>
                  </>
                )}
              </span>
            </figcaption>
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Tutup"
              autoFocus
              className="absolute right-3 top-3 rounded-btn bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <X size={16} aria-hidden />
            </button>
          </figure>
        </div>
      )}
    </div>
  );
}
