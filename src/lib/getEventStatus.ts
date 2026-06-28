type EventStatus = 'akan-datang' | 'berlangsung' | 'selesai'

function getEventStatus(startDate?: string, endDate?: string): EventStatus {
  if (!startDate) return 'akan-datang' // belum ada tanggal = anggap upcoming
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : start // single-day event jika endDate kosong
  if (now < start) return 'akan-datang'
  if (now > end) return 'selesai'
  return 'berlangsung'
}
