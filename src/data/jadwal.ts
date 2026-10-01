export interface Kelompok {
  id: number;
  nama: string;
  anggota: string[];
}

/* Data asli pengambilan jimpitan — dari pemilik web, Sept 2026 */
export const jadwal: Kelompok[] = [
  {
    id: 1,
    nama: "Kelompok 1",
    anggota: [
      "Parmuji",
      "Dwi Maryanto",
      "Talenta",
      "Indri",
      "Nia",
      "Amanda",
      "Chelsea",
      "Rio",
      "Nur Prabowo",
      "Radit",
      "Eko Doni",
      "Rendi",
      "Danang",
      "Eko Marwoto",
    ],
  },
  {
    id: 2,
    nama: "Kelompok 2",
    anggota: [
      "Dwi Tanto",
      "Eka",
      "Rahma",
      "Sela",
      "Jeki",
      "Zulfa",
      "Putri",
      "Ruli",
      "Ridho",
      "Andi",
      "Edwin",
      "Diki",
      "Marjoko",
      "Mujiman",
    ],
  },
  {
    id: 3,
    nama: "Kelompok 3",
    anggota: [
      "Rizki",
      "Iqbal",
      "Yusuf",
      "Lutfi",
      "Desta",
      "Hari",
      "Galih",
      "Iyus",
      "Adit",
      "Norika",
      "Orlandi",
      "Mulyani",
      "Desi",
      "Dinda",
    ],
  },
  {
    id: 4,
    nama: "Kelompok 4",
    anggota: [
      "Ehsan",
      "Irvan",
      "Nugraha",
      "Yakub",
      "Nabila",
      "Aan",
      "Yusuf Afandi",
      "Fadhil",
      "Reza",
      "Sofi",
      "Rini",
      "Rivana",
      "Andri",
      "Iis",
    ],
  },
];
