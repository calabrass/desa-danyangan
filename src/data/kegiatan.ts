export interface Kegiatan {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  /* Kosongkan ("") = tampil placeholder netral "Foto menyusul".
     Isi dengan path foto dokumentasi asli — taruh file di public/foto/kegiatan/
     lalu pakai "/foto/kegiatan/nama-file.jpg" (folder itu ikut ter-serve dev & build).
     JANGAN pakai foto random dari internet — bikin kartu terasa tidak nyambung. */
  foto: string;
  tag?: string;
}

/* Lokasi lengkap — dipakai konsisten di seluruh copy web. */
const LOKASI = "Danyangan RT03/RW02 Banyudono, Banyudono, Boyolali";

/* GANTI: judul + deskripsi + tanggal + foto di bawah ini dengan dokumentasi asli.
   Tambah kegiatan baru = tambah 1 objek ke array ini, feed ke-render otomatis.
   Foto asli yang sudah terpasang: jalan-sehat.jpg, lomba-17-an.jpg,
   lomba-17.jpg, /foto/renang.jpg (sumber: folder "foto kegiatan/").
   Tanggal diseragamkan: semua 23 Agu 2026, kecuali Lomba 9 Agu 2026. */
export const kegiatan: Kegiatan[] = [
  {
    id: 1,
    // GANTI: judul kegiatan asli
    judul: "Kerja Bakti Lapangan & Selokan",
    // GANTI: deskripsi asli 1–2 kalimat
    deskripsi: `Anggota Persimuda bersama warga ${LOKASI} membersihkan lapangan dan selokan menjelang musim hujan.`,
    tanggal: "23 Agu 2026",
    // GANTI: URL foto dokumentasi asli ("" = placeholder "Foto menyusul")
    foto: "",
    tag: "Gotong royong",
  },
  {
    id: 2,
    // GANTI: judul kegiatan asli
    judul: "Ronda Malam & Jimpitan Rutin",
    // GANTI: deskripsi asli 1–2 kalimat
    deskripsi:
      "Setiap kelompok bergiliran menarik jimpitan keliling RT. Hasilnya dicatat terbuka sebagai kas kegiatan pemuda.",
    tanggal: "23 Agu 2026",
    // GANTI: URL foto dokumentasi asli ("" = placeholder "Foto menyusul")
    foto: "",
    tag: "Rutin",
  },
  {
    id: 3,
    // GANTI: judul kegiatan asli
    judul: "Latihan Karang Taruna & Diskusi",
    // GANTI: deskripsi asli 1–2 kalimat
    deskripsi:
      "Pertemuan rutin membahas agenda bulan depan, antara lain turnamen antar-RT dan pengajian akbar.",
    tanggal: "23 Agu 2026",
    // GANTI: URL foto dokumentasi asli ("" = placeholder "Foto menyusul")
    foto: "",
    tag: "Rapat",
  },
  {
    id: 4,
    // GANTI: judul kegiatan asli
    judul: "Turnamen Mini Sepak Bola",
    // GANTI: deskripsi asli 1–2 kalimat
    deskripsi:
      "Laga persahabatan antar empat kelompok jimpitan. Kelompok 3 menjadi juara.",
    tanggal: "23 Agu 2026",
    // GANTI: URL foto dokumentasi asli ("" = placeholder "Foto menyusul")
    foto: "",
    tag: "Olahraga",
  },
  {
    id: 5,
    judul: "Jalan Sehat Bersama Warga",
    deskripsi: `Jalan sehat pagi menyusuri gang ${LOKASI}, diikuti warga dan anggota Persimuda berseragam.`,
    tanggal: "23 Agu 2026",
    foto: "/foto/kegiatan/jalan-sehat.jpg",
    tag: "Olahraga",
  },
  {
    id: 6,
    judul: "Kemeriahan Jalan Sehat Warga",
    deskripsi:
      "Peserta berkumpul di gang sebelum start jalan sehat, dengan bendera merah putih dan seragam Persimuda.",
    // Satu acara dengan foto jalan-sehat.jpg — diseragamkan 23 Agu 2026
    tanggal: "23 Agu 2026",
    foto: "/foto/kegiatan/lomba-17-an.jpg",
    tag: "Olahraga",
  },
  {
    id: 7,
    // GANTI: judul kegiatan asli
    judul: "Bakti Sosial Sembako Warga",
    // GANTI: deskripsi asli 1–2 kalimat
    deskripsi:
      "Sebagian kas jimpitan disalurkan sebagai 20 paket sembako untuk warga yang membutuhkan.",
    tanggal: "23 Agu 2026",
    // GANTI: URL foto dokumentasi asli ("" = placeholder "Foto menyusul")
    foto: "",
    tag: "Sosial",
  },
  {
    id: 8,
    judul: "Lomba 17-an Bersama Warga",
    deskripsi:
      "Lomba air untuk anak-anak dan warga di halaman, dalam rangka perayaan 17 Agustus.",
    // Lomba: 9 Agu 2026
    tanggal: "9 Agu 2026",
    foto: "/foto/kegiatan/lomba-17.jpg",
    tag: "Acara",
  },
  {
    id: 9,
    judul: "Renang Bareng Persimuda",
    deskripsi: "Rekreasi renang bersama anggota Persimuda.",
    tanggal: "23 Agu 2026",
    foto: "/foto/renang.jpg",
    tag: "Olahraga",
  },
];
