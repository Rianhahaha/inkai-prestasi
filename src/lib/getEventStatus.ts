type EventStatus = 'Akan datang' | 'Berlangsung' | 'Selesai'

export function getEventStatus(startDate?: string, endDate?: string): EventStatus {
  if (!startDate) return 'Akan datang' // belum ada tanggal = anggap upcoming
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : start // single-day event jika endDate kosong
  if (now < start) return 'Akan datang'
  if (now > end) return 'Selesai'
  return 'Berlangsung'
}
