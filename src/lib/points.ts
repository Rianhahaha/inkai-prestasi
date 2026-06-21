// src/lib/points.ts
export const POINT_MATRIX: Record<string, Record<string, Record<string, number>>> = {
  open: {
    Kecamatan: { 'Juara 1': 40, 'Juara 2': 28, 'Juara 3': 16 },
    'Kabupaten/Kota': { 'Juara 1': 80, 'Juara 2': 56, 'Juara 3': 32 },
    Provinsi: { 'Juara 1': 150, 'Juara 2': 105, 'Juara 3': 60 },
    Nasional: { 'Juara 1': 300, 'Juara 2': 210, 'Juara 3': 120 },
    Internasional: { 'Juara 1': 500, 'Juara 2': 350, 'Juara 3': 200 },
  },
  festival: {
    Kecamatan: { 'Juara 1': 8, 'Juara 2': 6, 'Juara 3': 3 },
    'Kabupaten/Kota': { 'Juara 1': 16, 'Juara 2': 11, 'Juara 3': 6 },
    Provinsi: { 'Juara 1': 30, 'Juara 2': 21, 'Juara 3': 12 },
    Nasional: { 'Juara 1': 60, 'Juara 2': 42, 'Juara 3': 24 },
    Internasional: { 'Juara 1': 100, 'Juara 2': 70, 'Juara 3': 40 },
  },
}

export const calculatePoints = (jenis: string, tingkat: string, peringkat: string): number => {
  const normalizedJenis = jenis?.toLowerCase() || 'open'
  return POINT_MATRIX[normalizedJenis]?.[tingkat]?.[peringkat] || 0
}
