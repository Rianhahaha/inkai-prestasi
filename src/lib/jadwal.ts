export type Jadwal = {
  id: number
  hari: string
  waktu: string
  lokasi: string
}

export const jadwalLatihan = [
  { id: 1, hari: 'Rabu', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY', dayIndex: 1 },
  { id: 2, hari: 'Jumat', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY', dayIndex: 5 },
  { id: 3, hari: 'Minggu', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY', dayIndex: 7 },
]
