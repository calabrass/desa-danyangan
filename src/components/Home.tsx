import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { HeroDoodles } from "./Doodles";
import type { TabId } from "./Navbar";
import { cn } from "@/lib/utils";
import { kegiatan } from "@/data/kegiatan";

const HERO_PHOTO = "/foto/renang.jpg";

/* Nomor WhatsApp laporan warga: +62 856-4177-8932 → format wa.me */
const WA_NUMBER = "6285641778932";
const WA_TEXT = encodeURIComponent(
  "Halo Persimuda, saya ingin menyampaikan laporan: "
);

interface HomeProps {
  onNavigate: (tab: TabId) => void;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* Angka count-up — jalan sekali saat `start` true */
function CountUp({ value, start, duration = 1200 }: { value: number; start: boolean; duration?: number }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!start || reduced) {
      if (start) setDisplay(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, duration, reduced]);

  return <>{display}</>;
}

/* Bungkus reveal fade-up sekali saat masuk viewport */
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", visible && "is-visible", className)}
    >
      {children}
    </div>
  );
}

export function Home({ onNavigate }: HomeProps) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const terbaru = kegiatan.filter((k) => k.foto).slice(0, 3);
  const stats = [
    { value: 56, label: "Anggota aktif" },
    { value: 4, label: "Kelompok jimpitan" },
    {
      value: kegiatan.filter((k) => k.foto).length,
      label: "Kegiatan terdokumentasi",
    },
  ];

  const statsRef = useRef<HTMLElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pb-4">
      {/* Hero kompak — teks kiri, foto pendukung kanan; rata atas via grid alignment */}
      <section className="relative grid items-start gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <HeroDoodles />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            />
            Danyangan RT03/RW02 &mdash; Banyudono, Boyolali
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] lg:text-[40px] lg:leading-[1.15]">
            Selamat Datang di Persimuda
          </h1>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Wadah muda-mudi Danyangan RT03/RW02 &mdash; ronda, jimpitan, dan
            kegiatan warga, dicatat rapi dan terbuka untuk semua anggota.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button onClick={() => onNavigate("jadwal")}>
              Lihat Jadwal
              <ArrowRight
                size={16}
                strokeWidth={2}
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button variant="outline" onClick={() => onNavigate("kegiatan")}>
              Kegiatan
            </Button>
          </div>
        </div>

        <figure>
          <div className="overflow-hidden rounded-card border border-[var(--border)] bg-[#f4f4f5]">
            <img
              src={HERO_PHOTO}
              alt="Foto bersama anggota Persimuda Danyangan RT03/RW02 saat renang bersama"
              onLoad={() => setHeroLoaded(true)}
              className={`aspect-[4/3] w-full object-cover img-fade ${heroLoaded ? "is-loaded" : ""}`}
            />
          </div>
          <figcaption className="mt-2 text-xs text-[var(--text-secondary)]">
            Renang bareng anggota Persimuda &mdash; dokumentasi kegiatan.
          </figcaption>
        </figure>
      </section>

      {/* Statistik — strip dokumen, angka monospace + count-up */}
      <section ref={statsRef} aria-label="Statistik komunitas">
        <dl className="grid grid-cols-3 divide-x divide-[var(--border)] rounded-card border border-[var(--border)] bg-[var(--surface)]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col px-4 py-4 sm:px-6">
              <dd className="font-mono text-xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums sm:text-2xl">
                <CountUp value={s.value} start={statsInView} />
              </dd>
              <dt className="mt-1 text-xs leading-snug text-[var(--text-secondary)]">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Tentang */}
      <Reveal className="mt-12">
        <section className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            Tentang kami
          </p>
          <h2 className="mt-1.5 max-w-[36ch] text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Pemuda satu RT, kas tercatat, kerja nyata.
          </h2>
          <p className="mt-2.5 max-w-[72ch] text-sm leading-relaxed text-[var(--text-secondary)]">
            Persimuda adalah paguyuban muda-mudi Danyangan RT03/RW02. Setiap
            malam giliran, empat kelompok bergantian menarik jimpitan keliling
            &mdash; hasilnya jadi kas bersama untuk turnamen, bakti sosial, dan
            perayaan hari besar. Web ini jadi papan info tunggal: siapa giliran
            minggu ini, dan apa saja yang sudah dikerjakan.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("jadwal")}
            >
              Cek giliran kelompok
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("kegiatan")}
            >
              Lihat dokumentasi
            </Button>
          </div>
        </section>
      </Reveal>

      {/* Kegiatan terbaru */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              Kegiatan terbaru
            </h2>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              Arsip foto dan cerita dari lapangan.
            </p>
          </div>
          <button
            onClick={() => onNavigate("kegiatan")}
            className="group flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--accent)] transition-transform duration-150 hover:underline active:scale-95"
          >
            Semua
            <ArrowRight
              size={15}
              strokeWidth={2}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {terbaru.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 90}>
              <button
                onClick={() => onNavigate("kegiatan")}
                className="card-hover flex h-full w-full flex-col overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] text-left hover:-translate-y-0.5"
              >
                <span className="block aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#f4f4f5]">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="flex flex-1 flex-col p-4">
                  <span className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
                    <span>{item.tanggal}</span>
                    {item.tag && (
                      <>
                        <span aria-hidden className="text-[var(--border-strong)]">
                          ·
                        </span>
                        <span className="font-sans font-medium text-[var(--accent)]">
                          {item.tag}
                        </span>
                      </>
                    )}
                  </span>
                  <span className="mt-1.5 block text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
                    {item.judul}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.deskripsi}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      {/* Laporan warga via WhatsApp */}
      <Reveal className="mt-4">
        <section className="flex items-center gap-4 rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-[var(--accent)] text-white">
            <MessageCircle size={20} strokeWidth={2} aria-hidden />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-[var(--accent)]" />
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
              Laporan warga
            </span>
            <span className="mt-0.5 block text-sm text-[var(--text-secondary)]">
              Sampaikan laporan seputar kegiatan Persimuda langsung via
              WhatsApp.
            </span>
          </span>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp Persimuda untuk laporan warga"
            className={cn(buttonVariants(), "shrink-0")}
          >
            <MessageCircle size={16} strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Chat WhatsApp</span>
            <span className="sm:hidden">Chat</span>
          </a>
        </section>
      </Reveal>
    </div>
  );
}
