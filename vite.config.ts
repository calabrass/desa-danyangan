import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  server: {
    watch: {
      /* Abaikan file konten pengguna & file temp yang sering terkunci program lain
         (download Chrome .crdownload → EBUSY & dev server mati). */
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/*.crdownload",
        "**/Unconfirmed *",
        "**/*.tmp",
        "**/~$*",
        "**/foto kegiatan/**",
        /* public/ di-serve langsung dari disk & tidak lewat HMR, jadi tak perlu
           di-watch — mencegah EBUSY saat file disalin ke sana (Windows). */
        "**/public/**",
      ],
    },
  },
});
