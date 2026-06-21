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
