/**
 * Static Data Access Layer
 * Replaces Payload CMS queries for static export preview
 * All functions return Promise for API consistency with dynamic version
 */

import {
  dummyAthletes,
  dummyLeaderboard,
  dummyKonten,
  dummyPengurus,
  dummyData,
  getAthleteById,
  getAchievementsByAthleteId,
  getKontenBySlug,
  getKontenByCategory,
  getPengurusByDivisi,
} from '@/data/dummy-data'

// Simulate async delay for realistic loading states (optional)
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================
// ATHLETES
// ============================================

export async function getAllAthletes() {
  // await delay(100)
  return dummyAthletes
}

export async function getAthleteByIdStatic(id: string) {
  // await delay(50)
  return getAthleteById(id)
}

export async function getAthleteAchievements(athleteId: string) {
  // await delay(50)
  return getAchievementsByAthleteId(athleteId)
}

// ============================================
// LEADERBOARD
// ============================================

export async function getLeaderboard() {
  // await delay(100)
  return dummyLeaderboard
}

export async function getTopAthletes(limit: number = 3) {
  // await delay(50)
  return dummyLeaderboard.slice(0, limit)
}

// ============================================
// KONTEN (CONTENT)
// ============================================

export async function getAllKonten() {
  // await delay(100)
  return dummyKonten
}

export async function getKontenBySlugStatic(slug: string) {
  // await delay(50)
  return getKontenBySlug(slug)
}

export async function getKontenByCategoryStatic(category: string) {
  // await delay(50)
  return getKontenByCategory(category as any)
}

export async function getPublishedKonten() {
  // await delay(100)
  return dummyKonten.filter(k => k.kategori !== 'Lainnya' || true)
}

export async function getLatestKonten(limit: number = 5) {
  // await delay(50)
  return [...dummyKonten]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export async function getUpcomingEvents() {
  // await delay(50)
  const now = new Date()
  return dummyKonten
    .filter(k => k.kategori === 'Kegiatan' || k.kategori === 'Kejuaraan' || k.kategori === 'Pelatihan')
    .filter(k => new Date(k.tanggalMulai) >= now)
    .sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime())
}

export async function getRecentNews(limit: number = 3) {
  // await delay(50)
  return dummyKonten
    .filter(k => k.kategori === 'Berita' || k.kategori === 'Pengumuman')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

// ============================================
// PENGURUS (BOARD MEMBERS)
// ============================================

export async function getAllPengurus() {
  // await delay(100)
  return dummyPengurus
}

export async function getPengurusByDivisiStatic(divisi: string) {
  // await delay(50)
  return getPengurusByDivisi(divisi as any)
}

export async function getPengurusInti() {
  // await delay(50)
  return getPengurusByDivisi('Pengurus Inti')
}

export async function getDivisiLatihan() {
  // await delay(50)
  return getPengurusByDivisi('Divisi Latihan')
}

export async function getDivisiHumas() {
  // await delay(50)
  return getPengurusByDivisi('Divisi Humas')
}

export async function getDivisiKRT() {
  // await delay(50)
  return getPengurusByDivisi('Divisi KRT/UU')
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export async function getHeroData() {
  // await delay(50)
  return {
    title: 'INKA - Ikatan Taekwondo',
    subtitle: 'Membangun Karakter, Menjaga Tradisi, Meraih Prestasi',
    description: 'Organisasi mahasiswa Taekwondo terdepan yang berfokus pada pengembangan karakter, pelestarian budaya bela diri, dan pencapaian prestasi di tingkat nasional maupun internasional.',
    ctaText: 'Bergabung Sekarang',
    ctaLink: '/atlet',
    backgroundImage: '/images/hero.png',
  }
}

export async function getAboutData() {
  // await delay(50)
  return {
    title: 'Tentang INKA',
    description: 'Ikatan Taekwondo (INKA) adalah organisasi mahasiswa yang bergerak di bidang olahraga Taekwondo. Didirikan dengan visi menjadi wadah pengembangan potensi mahasiswa di bidang bela diri, membangun karakter disiplin, dan meraih prestasi gemilang.',
    vision: 'Menjadi organisasi Taekwondo mahasiswa terdepan yang menghasilkan atlet berprestasi, berkarakter, dan berbudaya.',
    mission: [
      'Mengembangkan keterampilan Taekwondo melalui pelatihan terstruktur dan berkelanjutan',
      'Membangun karakter disiplin, tanggung jawab, dan sportivitas pada setiap anggota',
      'Meraih prestasi di tingkat regional, nasional, dan internasional',
      'Melestarikan nilai-nilai budaya dan filosofi Taekwondo',
      'Menciptakan komunitas yang solid, suportif, dan inklusif',
    ],
    stats: [
      { label: 'Anggota Aktif', value: '150+' },
      { label: 'Prestasi Nasional', value: '45+' },
      { label: 'Alumni Berprestasi', value: '200+' },
      { label: 'Tahun Berdiri', value: '15+' },
    ],
    images: [
      '/images/tentang-1.png',
      '/images/tentang-2.png',
    ],
  }
}

export async function getJoinData() {
  // await delay(50)
  return {
    title: 'Ayo Bergabung dengan INKA!',
    description: 'Buka untuk semua mahasiswa tanpa memerlukan pengalaman Taekwondo sebelumnya. Kami menyediakan pelatihan dari dasar hingga tingkat kompetisi.',
    benefits: [
      'Pelatihan terstruktur oleh pelatih berpengalaman',
      'Fasilitas dojo lengkap dan nyaman',
      'Kesempatan mengikuti kejuaraan regional & nasional',
      'Komunitas solid & suportif',
      'Pengembangan soft skill (leadership, teamwork, disiplin)',
      'Sertifikat keikutsertaan & prestasi',
    ],
    requirements: [
      'Mahasiswa aktif perguruan tinggi',
      'Bersedia mengikuti latihan rutin',
      'Memiliki komitmen & disiplin tinggi',
      'Tidak memerlukan pengalaman sebelumnya',
    ],
    ctaText: 'Daftar Sekarang',
    ctaLink: '/auth/register',
    image: '/images/ayo-bergabung.png',
  }
}

// ============================================
// FORMAT HELPERS (matching dynamic version)
// ============================================

export function formatDateStatic(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

export function formatDateRange(start: string, end?: string): string {
  const startDate = formatDateStatic(start)
  if (!end) return startDate
  const endDate = formatDateStatic(end)
  return startDate === endDate ? startDate : `${startDate} - ${endDate}`
}

export function getBeltColorClass(sabuk: string): string {
  if (!sabuk) return 'bg-slate-100 text-slate-700 border-slate-200'
  const s = sabuk.toLowerCase()
  if (s.includes('putih')) return 'bg-slate-50 text-slate-700 border-slate-300'
  if (s.includes('kuning')) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  if (s.includes('hijau')) return 'bg-green-100 text-green-800 border-green-300'
  if (s.includes('biru')) return 'bg-blue-100 text-blue-800 border-blue-300'
  if (s.includes('coklat')) return 'bg-[#d4a373]/30 text-[#8b5a2b] border-[#d4a373]'
  if (s.includes('hitam')) return 'bg-slate-800 text-white border-slate-900'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

// ============================================
// EXPORT ALL
// ============================================

export const staticData = {
  athletes: dummyAthletes,
  leaderboard: dummyLeaderboard,
  konten: dummyKonten,
  pengurus: dummyPengurus,
}