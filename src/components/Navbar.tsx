import { cn } from "@/lib/utils";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";

export type TabId = "home" | "pengumuman" | "jadwal" | "kegiatan";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "pengumuman", label: "Pengumuman" },
  { id: "jadwal", label: "Jadwal" },
  { id: "kegiatan", label: "Kegiatan" },
];

interface NavbarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function Navbar({ active, onChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-3 px-4 sm:px-6">
        <button
          onClick={() => onChange("home")}
          className="flex min-w-0 items-center gap-2.5 text-left transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95"
          aria-label="Persimuda — kembali ke Home"
        >
          <img
            src="/logo-persimuda.png"
            alt="Logo Karang Taruna Persimuda"
            className="h-8 w-8 shrink-0 rounded-full border border-[var(--border)] object-cover"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-tight text-[var(--text-primary)]">
              Persimuda
            </span>
            <span className="hidden truncate text-xs font-normal text-[var(--text-secondary)] sm:block">
              Danyangan RT03/RW02, Banyudono
            </span>
          </span>
        </button>

        <nav aria-label="Navigasi utama">
          <div className="flex items-center gap-1">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChange(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-[40px] items-center px-3 text-sm transition-all duration-150 active:scale-95",
                    isActive
                      ? "font-semibold text-[var(--accent)]"
                      : "font-normal text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <RandomLetterSwap
                    label={tab.label}
                    staggerDuration={0.025}
                    transition={{ duration: 0.6, type: "spring" }}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-[var(--accent)] transition-transform duration-200",
                      isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
