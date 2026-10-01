/* Coretan dekoratif garis-tangan ala Notion — murni visual
   (aria-hidden, tanpa interaksi), warna token proyek, opacity rendah
   agar tidak mengganggu keterbacaan. */

export function HeroDoodles() {
  return (
    <>
      {/* Pola titik memudar */}
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)]"
      />
      {/* Bintang kilau besar — kanan atas, area kosong */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-2 hidden h-14 w-14 text-[var(--border-strong)] sm:block lg:right-16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3c.5 4.5 2.3 6.8 6.5 7.5-4.2.7-6 3-6.5 7.5-.5-4.5-2.3-6.8-6.5-7.5 4.2-.7 6-3 6.5-7.5Z" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-24 top-16 hidden h-6 w-6 text-[var(--accent)] opacity-40 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <path d="M12 4v16M4 12h16" />
      </svg>
      {/* Lingkaran sketsa besar — kiri bawah, area kosong */}
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="pointer-events-none absolute -left-4 bottom-4 hidden h-28 w-28 text-[var(--accent)] opacity-25 sm:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <circle
          cx="24"
          cy="24"
          r="17"
          strokeDasharray="75 32"
          transform="rotate(-24 24 24)"
        />
      </svg>
      {/* Gelombang besar — tengah bawah */}
      <svg
        aria-hidden
        viewBox="0 0 120 20"
        className="pointer-events-none absolute bottom-1 left-1/3 hidden h-6 w-32 text-[var(--border-strong)] md:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <path d="M2 12c6-9 12-9 18 0s12 9 18 0 12-9 18 0 12 9 18 0 12-9 18 0 8-7 16-3" />
      </svg>
      {/* Bintang kecil — kiri atas teks */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-1 top-8 hidden h-5 w-5 text-[var(--border-strong)] md:block"
        fill="currentColor"
      >
        <path d="M12 2c.4 4 2 6.2 6 6.6-4 .4-5.6 2.6-6 6.6-.4-4-2-6.2-6-6.6 4-.4 5.6-2.6 6-6.6Z" />
      </svg>
    </>
  );
}

/* Dekorasi halaman Jadwal — titik + doodle di area kosong kanan header. */
export function JadwalDoodles() {
  return (
    <>
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-56 opacity-60 [mask-image:linear-gradient(to_bottom,black_10%,transparent_90%)]"
      />
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-8 top-10 hidden h-12 w-12 text-[var(--border-strong)] md:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3c.5 4.5 2.3 6.8 6.5 7.5-4.2.7-6 3-6.5 7.5-.5-4.5-2.3-6.8-6.5-7.5 4.2-.7 6-3 6.5-7.5Z" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="pointer-events-none absolute right-32 top-24 hidden h-20 w-20 text-[var(--accent)] opacity-25 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <circle
          cx="24"
          cy="24"
          r="17"
          strokeDasharray="75 32"
          transform="rotate(-24 24 24)"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-32 hidden h-5 w-5 text-[var(--accent)] opacity-40 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <path d="M12 4v16M4 12h16" />
      </svg>
    </>
  );
}
/* Pemandangan garis satu-warna: bukit + matahari + burung.
   Full-width, tipis, ditaruh sebagai pemisah antar section. */
export function SceneDivider() {
  return (
    <div aria-hidden className="pointer-events-none mt-12 select-none">
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="xMidYMax slice"
        className="h-28 w-full sm:h-36"
        fill="none"
      >
        {/* Bukit belakang — isi hijau lembut */}
        <path
          d="M0 122C180 62 360 58 540 102s360 44 660-8v66H0Z"
          fill="var(--accent-soft)"
          opacity={0.55}
        />
        {/* Bukit depan — garis */}
        <path
          d="M0 140C220 100 430 98 640 128s380 26 560-6"
          stroke="var(--border-strong)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Matahari */}
        <circle
          cx={1015}
          cy={48}
          r={24}
          stroke="var(--accent)"
          strokeWidth={2}
          opacity={0.4}
        />
        <g stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" opacity={0.4}>
          <path d="M1015 8v10M1015 78v10M975 48h10M1045 48h10" />
        </g>
        {/* Burung */}
        <g stroke="var(--border-strong)" strokeWidth={2} strokeLinecap="round">
          <path d="M300 52q5-6 10 0q5-6 10 0" />
          <path d="M340 38q4-5 8 0q4-5 8 0" />
        </g>
        {/* Kilau kecil */}
        <path
          d="M180 40c.3 3 1.5 4.6 4.5 5-3 .4-4.2 2-4.5 5-.3-3-1.5-4.6-4.5-5 3-.4 4.2-2 4.5-5Z"
          fill="var(--border-strong)"
        />
        <path
          d="M880 70c.3 3 1.5 4.6 4.5 5-3 .4-4.2 2-4.5 5-.3-3-1.5-4.6-4.5-5 3-.4 4.2-2 4.5-5Z"
          fill="var(--border-strong)"
        />
      </svg>
    </div>
  );
}
