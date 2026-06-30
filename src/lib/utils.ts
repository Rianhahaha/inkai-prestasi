// src/lib/utils.ts
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Baru saja'

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} jam lalu`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} hari lalu`

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// src/lib/utils.ts

/**
 * Merender waktu spesifik ke format 24-jam dengan zona waktu.
 * @returns "09:00 WIB"
 */
export const formatTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput)

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'Asia/Jakarta', // Absolute lock to WIB
  }).format(date)
}

/**
 * Merender tanggal lengkap dengan ejaan bulan bahasa Indonesia.
 * @returns "16 Juni 2026"
 */
export const formatDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput)

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

/**
 * Merender kombinasi tanggal dan jam.
 * @returns "16 Juni 2026, 09:00 WIB"
 */
export const formatDateTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput)

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

export const sabukOptions = [
  'Putih',
  'Kuning',
  'Hijau',
  'Biru',
  'Coklat Kyu 3',
  'Coklat Kyu 2',
  'Coklat Kyu 1',
  'Hitam Dan 1',
  'Hitam Dan 2',
  'Hitam Dan 3',
  'Hitam Dan 4',
  'Hitam Dan 5',
]

export const categoryOptions = [
  'Kegiatan',
  'Kejuaraan',
  'Ujian',
  'Pelatihan',
  'Pengumuman',
  'Berita',
  'Lainnya',
]

export const JABATAN_OPTIONS = [
  'Ketua',
  'Wakil Ketua',
  'Sekretaris 1',
  'Sekretaris 2',
  'Bendahara 1',
  'Bendahara 2',
  'Bendahara 3',
  'Koor',
  'Staf',
]

export const DIVISI_OPTIONS = ['Pengurus Inti', 'Divisi Latihan', 'Divisi Humas', 'Divisi KRT/UU']

export const getBeltColor = (sabuk: string) => {
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

// src/lib/utils.ts — tambahkan function ini

interface TransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'origin' | 'avif' | 'webp'
  resize?: 'cover' | 'contain' | 'fill'
}

export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: TransformOptions = {},
): string | null {
  if (!url) return null

  // Hanya transform URL Supabase
  if (!url.includes('.supabase.co/storage/v1/object/public/')) return url

  const { width = 800, quality = 80, format = 'webp', resize = 'cover' } = options

  const transformedUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/',
  )

  const params = new URLSearchParams({
    width: width.toString(),
    quality: quality.toString(),
    format,
    resize,
  })

  return `${transformedUrl}?${params.toString()}`
}
