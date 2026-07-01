export type Jadwal = {
  id: number
  hari: string
  waktu: string
  lokasi: string
}

export const jadwalLatihan: Jadwal[] = [
  { id: 1, hari: 'Senin', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY' },
  { id: 2, hari: 'Selasa', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY' },
  { id: 3, hari: 'Rabu', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY' },
  { id: 4, hari: 'Kamis', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY' },
  { id: 5, hari: 'Jumat', waktu: '15.30 - 18.00', lokasi: 'GOR Beladiri UNY' },
]
