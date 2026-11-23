/**
 * Static Dummy Data for Preview Export
 * All data is pre-calculated at build time - no database needed
 */

import { calculatePoints } from '@/lib/points'

// ============================================
// TYPES (mirroring Payload types for consistency)
// ============================================

export interface DummyAthlete {
  id: string
  namaLengkap: string
  sabuk: string
  jenisKelamin: 'Laki-laki' | 'Perempuan'
  tempatLahir: string
  tanggalLahir: string
  nomorTelepon: string
  fotoProfil: string
  totalPoin: number
  achievements: DummyAchievement[]
}

export interface DummyAchievement {
  id: string
  namaKejuaraan: string
  kategori: string
  jenisKejuaraan: 'Open' | 'Festival'
  peringkat: 'Juara 1' | 'Juara 2' | 'Juara 3'
  tingkatKejuaraan: 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional'
  tanggalKejuaraan: string
  lokasiKejuaraan: string
  status: 'approved'
  poin: number
}

export interface DummyKonten {
  id: string
  judul: string
  slug: string
  ringkasan: string
  kategori: 'Kegiatan' | 'Kejuaraan' | 'Ujian' | 'Pelatihan' | 'Pengumuman' | 'Berita' | 'Lainnya'
  tanggalMulai: string
  tanggalSelesai?: string
  publishedAt: string
  lokasi?: string
  thumbnail: string
  isiKonten: string
}

export interface DummyPengurus {
  id: string
  nama: string
  divisi: 'Pengurus Inti' | 'Divisi Latihan' | 'Divisi Humas' | 'Divisi KRT/UU'
  jabatan: string
  jurusan: string
  foto: string
}

export interface LeaderboardEntry {
  rank: number
  athlete: DummyAthlete
  poin: number
}

// ============================================
// HELPER: Generate consistent IDs
// ============================================

let idCounter = 0
const nextId = () => String(++idCounter)

// ============================================
// DUMMY ACHIEVEMENTS GENERATOR
// ============================================

function createAchievements(): DummyAchievement[] {
  const achievements: DummyAchievement[] = []
  
  const tournaments = [
    // Open tournaments
    { nama: 'Kejuaraan INKA Open', kategori: 'Poomsae Individual', jenis: 'Open' as const },
    { nama: 'Piala Rektor Open', kategori: 'Kyorugi', jenis: 'Open' as const },
    { nama: 'Turnamen Taekwondo Open', kategori: 'Poomsae Team', jenis: 'Open' as const },
    { nama: 'Championship Open', kategori: 'Freestyle Poomsae', jenis: 'Open' as const },
    { nama: 'Festival Taekwondo Open', kategori: 'Demo Team', jenis: 'Open' as const },
    
    // Festival tournaments
    { nama: 'Festival Taekwondo Nasional', kategori: 'Poomsae Individual', jenis: 'Festival' as const },
    { nama: 'Festival Poomsae Regional', kategori: 'Poomsae Team', jenis: 'Festival' as const },
    { nama: 'Festival Kyorugi', kategori: 'Kyorugi', jenis: 'Festival' as const },
    { nama: 'Festival Demo Team', kategori: 'Demo Team', jenis: 'Festival' as const },
    { nama: 'Festival Freestyle', kategori: 'Freestyle Poomsae', jenis: 'Festival' as const },
  ]

  const levels: Array<'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional'> = [
    'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'
  ]
  
  const ranks: Array<'Juara 1' | 'Juara 2' | 'Juara 3'> = ['Juara 1', 'Juara 2', 'Juara 3']
  
  const locations = [
    'GOR Amongrogo', 'GOR Universitas Negeri', 'GOR Pusdikpom', 'GOR TNI', 'GOR POLRI',
    'Gelanggang Merdeka', 'GOR Sritex', 'GOR Bung Karno', 'GOR C-Tra', 'GOR Popki'
  ]

  // Generate 40 achievements distributed across athletes
  for (let i = 0; i < 40; i++) {
    const t = tournaments[i % tournaments.length]
    const level = levels[i % levels.length]
    const rank = ranks[i % ranks.length]
    const poin = calculatePoints(t.jenis, level, rank)
    
    // Generate date within last 2 years
    const daysAgo = Math.floor(Math.random() * 730)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    achievements.push({
      id: nextId(),
      namaKejuaraan: `${t.nama} ${Math.floor(i / tournaments.length) + 1}`,
      kategori: t.kategori,
      jenisKejuaraan: t.jenis,
      peringkat: rank,
      tingkatKejuaraan: level,
      tanggalKejuaraan: date.toISOString().split('T')[0],
      lokasiKejuaraan: locations[i % locations.length],
      status: 'approved',
      poin,
    })
  }
  
  return achievements
}

const ALL_ACHIEVEMENTS = createAchievements()

// ============================================
// DUMMY ATHLETES (15 athletes)
// ============================================

export const dummyAthletes: DummyAthlete[] = [
  {
    id: '1',
    namaLengkap: 'Ahmad Rizki Pratama',
    sabuk: 'Hitam Dan 3',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2000-05-15',
    nomorTelepon: '081234567890',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0, // calculated below
    achievements: [],
  },
  {
    id: '2',
    namaLengkap: 'Siti Nurhaliza',
    sabuk: 'Hitam Dan 2',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Bandung',
    tanggalLahir: '2001-08-22',
    nomorTelepon: '081234567891',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '3',
    namaLengkap: 'Budi Santoso',
    sabuk: 'Hitam Dan 1',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1999-11-10',
    nomorTelepon: '081234567892',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '4',
    namaLengkap: 'Dewi Sartika',
    sabuk: 'Coklat Kyu 1',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '2002-03-18',
    nomorTelepon: '081234567893',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '5',
    namaLengkap: 'Eko Prasetyo',
    sabuk: 'Coklat Kyu 2',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Semarang',
    tanggalLahir: '2001-07-25',
    nomorTelepon: '081234567894',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '6',
    namaLengkap: 'Farah Amalia',
    sabuk: 'Coklat Kyu 3',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Medan',
    tanggalLahir: '2003-01-30',
    nomorTelepon: '081234567895',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '7',
    namaLengkap: 'Gunawan Wibowo',
    sabuk: 'Biru',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Makassar',
    tanggalLahir: '2002-09-12',
    nomorTelepon: '081234567896',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '8',
    namaLengkap: 'Hani Rahmawati',
    sabuk: 'Biru',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Palembang',
    tanggalLahir: '2003-04-05',
    nomorTelepon: '081234567897',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '9',
    namaLengkap: 'Indra Lesmana',
    sabuk: 'Hijau',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Balikpapan',
    tanggalLahir: '2004-06-20',
    nomorTelepon: '081234567898',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '10',
    namaLengkap: 'Joko Susilo',
    sabuk: 'Hijau',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Manado',
    tanggalLahir: '2003-12-08',
    nomorTelepon: '081234567899',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '11',
    namaLengkap: 'Kartika Putri',
    sabuk: 'Kuning',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Denpasar',
    tanggalLahir: '2004-02-14',
    nomorTelepon: '081234567900',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '12',
    namaLengkap: 'Lukman Hakim',
    sabuk: 'Kuning',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Mataram',
    tanggalLahir: '2005-08-03',
    nomorTelepon: '081234567901',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '13',
    namaLengkap: 'Maya Sari',
    sabuk: 'Putih',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Kupang',
    tanggalLahir: '2005-11-27',
    nomorTelepon: '081234567902',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '14',
    namaLengkap: 'Nanda Putra',
    sabuk: 'Putih',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Ambon',
    tanggalLahir: '2006-04-09',
    nomorTelepon: '081234567903',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
  {
    id: '15',
    namaLengkap: 'Olivia Herlina',
    sabuk: 'Putih',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Jayapura',
    tanggalLahir: '2006-09-16',
    nomorTelepon: '081234567904',
    fotoProfil: '/images/user-placeholder.png',
    totalPoin: 0,
    achievements: [],
  },
]

// ============================================
// ASSIGN ACHIEVEMENTS TO ATHLETES & CALCULATE POINTS
// ============================================

// Distribute achievements: higher belts get more achievements
const achievementDistribution = [5, 5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1]

let achievementIndex = 0
dummyAthletes.forEach((athlete, i) => {
  const count = achievementDistribution[i]
  athlete.achievements = ALL_ACHIEVEMENTS.slice(achievementIndex, achievementIndex + count)
  achievementIndex += count
  
  // Calculate total points from approved achievements
  athlete.totalPoin = athlete.achievements.reduce((sum, a) => sum + a.poin, 0)
})

// ============================================
// LEADERBOARD (pre-sorted by points)
// ============================================

export const dummyLeaderboard: LeaderboardEntry[] = [...dummyAthletes]
  .sort((a, b) => b.totalPoin - a.totalPoin)
  .map((athlete, index) => ({
    rank: index + 1,
    athlete,
    poin: athlete.totalPoin,
  }))

// ============================================
// DUMMY KONTEN (12 published articles)
// ============================================

export const dummyKonten: DummyKonten[] = [
  {
    id: '1',
    judul: 'Pelaksanaan Kejuaraan INKA Open 2025',
    slug: 'pelaksanaan-kejuaraan-inka-open-2025',
    ringkasan: 'Kejuaraan INKA Open 2025 berlangsung sukses dengan partisipasi 200+ atlet dari seluruh Indonesia. Event ini menjadi ajang perebutan poin ranking nasional.',
    kategori: 'Kejuaraan',
    tanggalMulai: '2025-08-15',
    tanggalSelesai: '2025-08-17',
    publishedAt: '2025-08-10T08:00:00Z',
    lokasi: 'GOR Amongrogo, Yogyakarta',
    thumbnail: '/images/hero.png',
    isiKonten: '<p>Kejuaraan INKA Open 2025 telah berhasil diselenggarakan pada tanggal 15-17 Agustus 2025 di GOR Amongrogo, Yogyakarta. Acara ini dihadiri oleh lebih dari 200 atlet dari berbagai perguruan tinggi di seluruh Indonesia.</p><p>Kategori yang diperlombakan meliputi Poomsae Individual, Poomsae Team, Kyorugi, dan Demo Team. Semua pertandingan berlangsung lancar dengan protokol kesehatan yang ketat.</p><p>Selamat kepada seluruh pemenang dan terima kasih kepada panitia, wasit, dan sponsor yang telah mendukung kelancaran acara ini.</p>',
  },
  {
    id: '2',
    judul: 'Jadwal Pelatihan Rutin Semester Ganjil 2025/2026',
    slug: 'jadwal-pelatihan-rutin-semester-ganjil-2025-2026',
    ringkasan: 'Jadwal latihan rutin INKA untuk semester ganjil telah ditetapkan. Latihan dilakukan 3x seminggu dengan fokus persiapan kejuaraan regional.',
    kategori: 'Pelatihan',
    tanggalMulai: '2025-09-01',
    tanggalSelesai: '2025-12-20',
    publishedAt: '2025-08-25T10:00:00Z',
    lokasi: 'Dojo INKA Kampus Utama',
    thumbnail: '/images/tentang-1.png',
    isiKonten: '<p>Pengurus INKA mengumumkan jadwal pelatihan rutin untuk semester ganjil tahun akademik 2025/2026. Pelatihan akan dilaksanakan 3 kali seminggu dengan jadwal sebagai berikut:</p><ul><li>Senin: 18.30 - 20.30 WIB (Fisik & Dasar)</li><li>Rabu: 18.30 - 20.30 WIB (Teknik Poomsae)</li><li>Sabtu: 08.00 - 10.00 WIB (Kyorugi & Sparring)</li></ul><p>Semua anggota wajib hadir tepat waktu. Bawa peralatan latihan lengkap dan minum sendiri.</p>',
  },
  {
    id: '3',
    judul: 'Pengumuman Ujian Kenaikan Sabuk Periode Oktober 2025',
    slug: 'pengumuman-ujian-kenaikan-sabuk-periode-oktober-2025',
    ringkasan: 'Ujian kenaikan sabuk periode Oktober 2025 akan dilaksanakan pada minggu ke-3. Persyaratan dan jadwal detail telah tersedia di sekretariat.',
    kategori: 'Ujian',
    tanggalMulai: '2025-10-18',
    publishedAt: '2025-10-01T09:00:00Z',
    lokasi: 'Dojo INKA Kampus Utama',
    thumbnail: '/images/tentang-2.png',
    isiKonten: '<p>Dengan hormat, kami menginformasikan bahwa Ujian Kenaikan Sabuk periode Oktober 2025 akan dilaksanakan pada:</p><p><strong>Tanggal:</strong> Sabtu, 18 Oktober 2025<br><strong>Waktu:</strong> 08.00 - 12.00 WIB<br><strong>Tempat:</strong> Dojo INKA Kampus Utama</p><p><strong>Persyaratan:</strong></p><ul><li>Sudah memenuhi masa minimal sabuk</li><li>Kehadiran latihan minimal 80%</li><li>Membayar biaya ujian sesuai ketentuan</li><li>Membawa seragam lengkap (dobok, sabuk, perlindungan)</li></ul><p>Pendaftaran dibuka hingga 11 Oktober 2025 di sekretariat INKA.</p>',
  },
  {
    id: '4',
    judul: 'Hasil Kejuaraan Provinsi DIY 2025 - INKA Raih 15 Medali',
    slug: 'hasil-kejuaraan-provinsi-diy-2025-inka-raih-15-medali',
    ringkasan: 'Tim INKA meraih 15 medali (6 emas, 5 perak, 4 perunggu) di Kejuaraan Provinsi DIY 2025. Prestasi terbaik dalam 5 tahun terakhir.',
    kategori: 'Kejuaraan',
    tanggalMulai: '2025-07-20',
    tanggalSelesai: '2025-07-22',
    publishedAt: '2025-07-23T14:00:00Z',
    lokasi: 'GOR Universitas Negeri Yogyakarta',
    thumbnail: '/images/hero.png',
    isiKonten: '<p>Tim Taekwondo INKA kembali membanggakan kampus dengan meraih 15 medali di Kejuaraan Provinsi DIY 2025 yang berlangsung di GOR Universitas Negeri Yogyakarta pada 20-22 Juli 2025.</p><p><strong>Rincian Medali:</strong></p><ul><li>Emas: 6 (Poomsae Individual 2, Poomsae Team 1, Kyorugi 3)</li><li>Perak: 5</li><li>Perunggu: 4</li></ul><p>Prestasi ini menjadi yang terbaik dalam 5 tahun terakhir. Selamat kepada seluruh atlet dan pelatih!</p>',
  },
  {
    id: '5',
    judul: 'Kegiatan Bakti Sosial & Olahraga Bersama',
    slug: 'kegiatan-bakti-sosial-olahraga-bersama',
    ringkasan: 'INKA mengadakan bakti sosial dan olahraga bersama warga sekitar kampus. Kegiatan rutin bulanan untuk mempererat silaturahmi.',
    kategori: 'Kegiatan',
    tanggalMulai: '2025-11-09',
    publishedAt: '2025-11-01T08:00:00Z',
    lokasi: 'Lapangan Kampus & Lingkungan Sekitar',
    thumbnail: '/images/ayo-bergabung.png',
    isiKonten: '<p>Sebagai bentuk tanggung jawab sosial, INKA mengadakan Kegiatan Bakti Sosial & Olahraga Bersama bulanan. Kegiatan ini bertujuan mempererat silaturahmi dengan warga sekitar kampus serta mempromosikan gaya hidup sehat.</p><p><strong>Jadwal:</strong></p><ul><li>06.00 - 07.00: Senam Bersama & Jogging</li><li>07.00 - 09.00: Bakti Sosial (bersih lingkungan, pohon tumbuh)</li><li>09.00 - 09.30: Sarapan Bersama & Doorprize</li></ul><p>Dress code: Kaos INKA / Olahraga bebas. Dibuka untuk umum, silakan mengajak teman/keluarga.</p>',
  },
  {
    id: '6',
    judul: 'Berita: INKA Mengirim 5 Atlet ke Kejuaraan Nasional 2025',
    slug: 'berita-inka-mengirim-5-atlet-ke-kejuaraan-nasional-2025',
    ringkasan: 'Sebanyak 5 atlet terpilih INKA akan mewakili DIY di Kejuaraan Nasional Taekwondo 2025 di Jakarta. Seleksi ketat telah dilakukan bulan lalu.',
    kategori: 'Berita',
    tanggalMulai: '2025-11-15',
    tanggalSelesai: '2025-11-20',
    publishedAt: '2025-11-05T11:00:00Z',
    lokasi: 'GOR Bung Karno, Jakarta',
    thumbnail: '/images/hero.png',
    isiKonten: '<p>Pengurus INKA resmi mengumumkan 5 atlet terpilih yang akan mewakili Daerah Istimewa Yogyakarta di Kejuaraan Nasional Taekwondo 2025 di Jakarta.</p><p><strong>Atlet Terpilih:</strong></p><ol><li>Ahmad Rizki Pratama (Hitam Dan 3) - Poomsae Individual</li><li>Siti Nurhaliza (Hitam Dan 2) - Kyorugi Putri -53kg</li><li>Budi Santoso (Hitam Dan 1) - Poomsae Team</li><li>Dewi Sartika (Coklat Kyu 1) - Kyorugi Putri -49kg</li><li>Eko Prasetyo (Coklat Kyu 2) - Poomsae Team</li></ol><p>Selamat kepada atlet terpilih! Persiapan intensif akan dimulai segera. INKA bangga dengan kalian!</p>',
  },
  {
    id: '7',
    judul: 'Pengumuman: Rapat Anggota Bulanan November 2025',
    slug: 'pengumuman-rapat-anggota-bulanan-november-2025',
    ringkasan: 'Rapat anggota bulanan wajib dihadiri seluruh pengurus dan anggota aktif. Akan dibahas evaluasi kegiatan semester dan rencana semester depan.',
    kategori: 'Pengumuman',
    tanggalMulai: '2025-11-23',
    publishedAt: '2025-11-15T15:00:00Z',
    lokasi: 'Ruang Rapat INKA, Lantai 2 Gedung Organisasi',
    thumbnail: '/images/pengurus.png',
    isiKonten: '<p>Kepada seluruh pengurus dan anggota INKA,</p><p>Dengan ini kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri Rapat Anggota Bulanan November 2025.</p><p><strong>Waktu:</strong> Minggu, 23 November 2025 | 14.00 - 16.00 WIB<br><strong>Tempat:</strong> Ruang Rapat INKA, Lantai 2 Gedung Organisasi</p><p><strong>Agenda:</strong></p><ol><li>Evaluasi kegiatan semester ganjil 2025/2026</li><li>Laporan keuangan semester</li><li>Rencana kerja semester genap 2025/2026</li><li>Pemilihan ketua kegiatan bakti sosial</li><li>Lain-lain</li></ol><p>Kehadiran wajib. Apabila berhalangan, wajib mengisi surat keterangan tidak hadir di sekretariat.</p>',
  },
  {
    id: '8',
    judul: 'Workshop Mental Training untuk Atlet Kompetisi',
    slug: 'workshop-mental-training-untuk-atlet-kompetisi',
    ringkasan: 'Workshop khusus mental training dengan psikolog olahraga profesional. Fokus pada manajemen tekanan, fokus, dan visualisasi sebelum kompetisi.',
    kategori: 'Pelatihan',
    tanggalMulai: '2025-12-06',
    tanggalSelesai: '2025-12-07',
    publishedAt: '2025-11-20T10:00:00Z',
    lokasi: 'Aula Kampus Utama',
    thumbnail: '/images/tentang-1.png',
    isiKonten: '<p>INKA bekerjasama dengan psikolog olahraga profesional mengadakan Workshop Mental Training untuk Atlet Kompetisi.</p><p><strong>Materi:</strong></p><ul><li>Manajemen kecemasan pra-kompetisi</li><li>Teknik visualisasi & mental rehearsal</li><li>Rutinitas pre-fight untuk performa optimal</li><li>Recovery mental pasca kompetisi</li></ul><p><strong>Pembicara:</strong> Dr. Andi Wijaya, M.Psi (Psikolog Olahraga Terakreditasi)<br><strong>Biaya:</strong> Gratis untuk anggota INKA<br><strong>Kuota:</strong> 30 peserta (prioritas atlet kompetisi)</p><p>Daftar di sekretariat hingga 30 November 2025.</p>',
  },
  {
    id: '9',
    judul: 'Kejuaraan Kyorugi Regional Java Tengah 2025',
    slug: 'kejuaraan-kyorugi-regional-java-tengah-2025',
    ringkasan: 'Kejuaraan regional Kyorugi tingkat Jawa Tengah. INKA mengirim 12 atlet. Target minimal 5 medali emas.',
    kategori: 'Kejuaraan',
    tanggalMulai: '2026-01-10',
    tanggalSelesai: '2026-01-12',
    publishedAt: '2025-12-01T08:00:00Z',
    lokasi: 'GOR C-Tra, Semarang',
    thumbnail: '/images/hero.png',
    isiKonten: '<p>Kejuaraan Kyorugi Regional Jawa Tengah 2026 akan diselenggarakan di GOR C-Tra, Semarang. INKA akan mengirim kontingen 12 atlet (6 putra, 6 putri) dalam berbagai kategori berat.</p><p><strong>Target:</strong> Minimal 5 medali emas, 3 perak, 4 perunggu</p><p><strong>Persiapan:</strong> Latihan intensif 6x seminggu mulai 15 Desember 2025. Program khusus kondisi fisik, taktik pertarungan, dan analisis video lawan.</p><p>Doakan keberhasilan tim INKA!</p>',
  },
  {
    id: '10',
    judul: 'Lainnya: Alumni INKA Berprestasi di Proliga 2025',
    slug: 'lainnya-alumni-inka-berprestasi-di-proliga-2025',
    ringkasan: 'Alumni INKA angkatan 2020, Rizky Firmansyah, kini bermain di tim nasional dan berprestasi di liga profesional. Bangga menjadi bagian dari keluarga INKA.',
    kategori: 'Lainnya',
    tanggalMulai: '2025-10-01',
    publishedAt: '2025-10-15T09:00:00Z',
    lokasi: '-',
    thumbnail: '/images/ayo-bergabung.png',
    isiKonten: '<p>Kabar gembira dari alumni INKA! Rizky Firmansyah (angkatan 2020, mantan Ketua INKA) kini telah resmi menjadi bagian dari tim nasional Indonesia dan berkompetisi di Proliga Taekwondo 2025.</p><p>Rizky bermain untuk klub PB Djarum dan telah meraih medali emas di kategori Kyorugi Senior -68kg. Perjalanannya dari atlet mahasiswa INKA hingga ke level profesional menjadi inspirasi bagi generasi muda.</p><p>"INKA mengajarkan saya disiplin, kerja tim, dan tidak pernah menyerah. Nilai-nilai itu saya bawa hingga sekarang," ucap Rizky saat diwawancara.</p><p>Selamat dan terus berprestasi, Rizky! INKA selalu bangga denganmu! 🥋🇮🇩</p>',
  },
  {
    id: '11',
    judul: 'Pengumuman: Libur Semester & Jadwal Latihan Akhir Tahun',
    slug: 'pengumuman-libur-semester-jadwal-latihan-akhir-tahun',
    ringkasan: 'Jadwal latihan khusus periode libur semester Desember 2025 - Januari 2026. Latihan opsional tapi sangat dianjurkan untuk atlet kompetisi.',
    kategori: 'Pengumuman',
    tanggalMulai: '2025-12-20',
    tanggalSelesai: '2026-01-10',
    publishedAt: '2025-12-10T12:00:00Z',
    lokasi: 'Dojo INKA Kampus Utama',
    thumbnail: '/images/tentang-2.png',
    isiKonten: '<p>Sehubungan dengan libur semester ganjil 2025/2026, jadwal latihan INKA akan mengalami penyesuaian sebagai berikut:</p><p><strong>Periode:</strong> 20 Desember 2025 - 10 Januari 2026</p><p><strong>Jadwal Latihan (Opsional):</strong></p><ul><li>Senin & Kamis: 08.00 - 10.00 WIB (Fisik & Kondisi)</li><li>Sabtu: 08.00 - 10.00 WIB (Teknik & Sparring Ringan)</li></ul><p><strong>Catatan:</strong></p><ul><li>Latihan opsional namun <strong>sangat dianjurkan</strong> untuk atlet yang akan berkompetisi semester depan</li><li>Dojo tetap buka untuk latihan mandiri (jam 07.00-12.00)</li><li>Jadwal normal kembali efektif 12 Januari 2026</li></ul><p>Gunakan libur dengan bijak untuk istirahat dan persiapan! 🎄🥋</p>',
  },
  {
    id: '12',
    judul: 'Kegiatan: Tahun Baru INKA 2026 - Malam Persahabatan',
    slug: 'kegiatan-tahun-baru-inka-2026-malam-persahabatan',
    ringkasan: 'Acara tahunan malam persahabatan INKA menyambut tahun baru 2026. Hiburan, doorprize, pengumuman pengurus baru, dan makan bersama.',
    kategori: 'Kegiatan',
    tanggalMulai: '2025-12-28',
    publishedAt: '2025-12-01T10:00:00Z',
    lokasi: 'Hotel Grand Inna, Yogyakarta',
    thumbnail: '/images/ayo-bergabung.png',
    isiKonten: '<p>INKA mengadakan Malam Persahabatan Tahunan untuk menyambut Tahun Baru 2026. Acara ini menjadi momen kumpul seluruh anggota, alumni, dan pengurus.</p><p><strong>Acara:</strong></p><ul><li>18.00 - Registrasi & Foto Bersama</li><li>19.00 - Pembukaan & Sambutan Ketua</li><li>19.30 - Makan Malam Bersama (Buffet)</li><li>20.30 - Hibutan: Karaoke, Game, Performa Anggota</li><li>21.30 - Pengumuman Pengurus Baru Periode 2026</li><li>22.00 - Doorprize & Penutupan</li></ul><p><strong>Dress Code:</strong> Batik Modern / Semi Formal<br><strong>Biaya:</strong> Rp 150.000/anggota (termasuk makan & doorprize)<br><strong>Konfirmasi:</strong> Maksimal 20 Desember 2025 di sekretariat</p><p>Jangan lewatkan momen kekeluargaan INKA! 🎉🥋</p>',
  },
]

// ============================================
// DUMMY PENGURUS (10 board members)
// ============================================

export const dummyPengurus: DummyPengurus[] = [
  {
    id: '1',
    nama: 'Ahmad Rizki Pratama',
    divisi: 'Pengurus Inti',
    jabatan: 'Ketua',
    jurusan: 'Teknik Informatika',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '2',
    nama: 'Siti Nurhaliza',
    divisi: 'Pengurus Inti',
    jabatan: 'Wakil Ketua',
    jurusan: 'Sistem Informasi',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    divisi: 'Pengurus Inti',
    jabatan: 'Sekretaris 1',
    jurusan: 'Teknik Komputer',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '4',
    nama: 'Dewi Sartika',
    divisi: 'Pengurus Inti',
    jabatan: 'Bendahara 1',
    jurusan: 'Manajemen Informatika',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '5',
    nama: 'Eko Prasetyo',
    divisi: 'Divisi Latihan',
    jabatan: 'Koor',
    jurusan: 'Teknik Elektro',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '6',
    nama: 'Farah Amalia',
    divisi: 'Divisi Latihan',
    jabatan: 'Staf',
    jurusan: 'Teknik Mesin',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '7',
    nama: 'Gunawan Wibowo',
    divisi: 'Divisi Humas',
    jabatan: 'Koor',
    jurusan: 'Teknik Sipil',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '8',
    nama: 'Hani Rahmawati',
    divisi: 'Divisi Humas',
    jabatan: 'Staf',
    jurusan: 'Administrasi Bisnis',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '9',
    nama: 'Indra Lesmana',
    divisi: 'Divisi KRT/UU',
    jabatan: 'Koor',
    jurusan: 'Teknik Informatika',
    foto: '/images/user-placeholder.png',
  },
  {
    id: '10',
    nama: 'Joko Susilo',
    divisi: 'Divisi KRT/UU',
    jabatan: 'Staf',
    jurusan: 'Sistem Informasi',
    foto: '/images/user-placeholder.png',
  },
]

// ============================================
// EXPORT ALL
// ============================================

export const dummyData = {
  athletes: dummyAthletes,
  achievements: ALL_ACHIEVEMENTS,
  leaderboard: dummyLeaderboard,
  konten: dummyKonten,
  pengurus: dummyPengurus,
}

// Helper functions for easy access
export function getAthleteById(id: string): DummyAthlete | undefined {
  return dummyAthletes.find(a => a.id === id)
}

export function getAchievementsByAthleteId(athleteId: string): DummyAchievement[] {
  const athlete = getAthleteById(athleteId)
  return athlete?.achievements || []
}

export function getKontenBySlug(slug: string): DummyKonten | undefined {
  return dummyKonten.find(k => k.slug === slug)
}

export function getKontenByCategory(category: DummyKonten['kategori']): DummyKonten[] {
  return dummyKonten.filter(k => k.kategori === category)
}

export function getPublishedKonten(): DummyKonten[] {
  return dummyKonten.filter(k => k.kategori !== 'Lainnya' || true) // all are published
}

export function getPengurusByDivisi(divisi: DummyPengurus['divisi']): DummyPengurus[] {
  return dummyPengurus.filter(p => p.divisi === divisi)
}