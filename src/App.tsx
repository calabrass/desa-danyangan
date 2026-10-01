import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Navbar, type TabId } from "./components/Navbar";
import { Home } from "./components/Home";
import { Pengumuman } from "./components/Pengumuman";
import { Jadwal } from "./components/Jadwal";
import { Kegiatan } from "./components/Kegiatan";
import { cn } from "./lib/utils";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [showTop, setShowTop] = useState(false);

  function handleChange(next: TabId) {
    setTab(next);
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar active={tab} onChange={handleChange} />

      <main className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div key={tab} className="tab-enter">
          {tab === "home" && <Home key="home" onNavigate={handleChange} />}
          {tab === "pengumuman" && <Pengumuman key="pengumuman" />}
          {tab === "jadwal" && <Jadwal key="jadwal" />}
          {tab === "kegiatan" && <Kegiatan key="kegiatan" />}
        </div>

        <footer className="mt-8 border-t border-[var(--border)] py-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Persimuda
            </p>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Muda-mudi Danyangan RT03/RW02, Banyudono, Boyolali
            </p>
          </div>
        </footer>
      </main>

      {/* Back-to-top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Kembali ke atas"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-btn border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg transition-all duration-200 hover:border-[var(--border-strong)] active:scale-95",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <ArrowUp size={18} aria-hidden className="text-[var(--text-primary)]" />
      </button>
    </div>
  );
}
