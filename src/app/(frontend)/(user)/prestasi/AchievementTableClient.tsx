// src/app/(user)/prestasi/AchievementTableClient.tsx
'use client'

import React, { useState } from 'react'

// 1. Replikasi Matriks Poin (Derived State)
// 1. Replikasi Matriks Poin (Absolute Dictionary Pattern)
const calculatePoints = (peringkat: string, tingkat: string): number => {
  const pointMatrix: Record<string, Record<string, number>> = {
    Kecamatan: { 'Juara 1': 10, 'Juara 2': 8, 'Juara 3': 5 },
    'Kabupaten/Kota': { 'Juara 1': 20, 'Juara 2': 15, 'Juara 3': 10 },
    Provinsi: { 'Juara 1': 40, 'Juara 2': 30, 'Juara 3': 20 },
    Nasional: { 'Juara 1': 80, 'Juara 2': 60, 'Juara 3': 40 },
    Internasional: { 'Juara 1': 160, 'Juara 2': 120, 'Juara 3': 80 },
  }

  return pointMatrix[tingkat]?.[peringkat] || 0
}

// 2. Re-styled Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    {
      pending: 'bg-[#facc15] text-white', // Yellow
      approved: 'bg-[#4ade80] text-white', // Green
      rejected: 'bg-[#f43f5e] text-white', // Red
    }[status] || 'bg-gray-200 text-gray-700'

  const labels =
    {
      pending: 'Menunggu',
      approved: 'Diterima',
      rejected: 'Ditolak',
    }[status] || status

  return <span className={`px-4 py-1.5 text-xs font-semibold rounded-md ${styles}`}>{labels}</span>
}

export default function AchievementTableClient({ initialData }: { initialData: any[] }) {
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)

  const closeModal = () => setSelectedDoc(null)

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
        {/* Title bisa Anda hapus dari sini jika di page.tsx sudah ada judulnya */}
        <h2 className="text-xl font-bold text-slate-800 mb-6">Riwayat Prestasi</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-y border-slate-200">
                <th className="py-4 px-2 font-bold text-slate-800 text-sm text-center">No.</th>
                <th className="py-4 px-4 font-bold text-slate-800 text-sm">Nama Kejuaraan</th>
                <th className="py-4 px-4 font-bold text-slate-800 text-sm text-center">Juara</th>
                <th className="py-4 px-4 font-bold text-slate-800 text-sm text-center">Poin</th>
                <th className="py-4 px-4 font-bold text-slate-800 text-sm text-center">Status</th>
                <th className="py-4 px-4 font-bold text-slate-800 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Anda belum pernah mengajukan prestasi.
                  </td>
                </tr>
              ) : (
                initialData.map((doc: any, index: number) => {
                  const displayPoints = calculatePoints(doc.peringkat, doc.tingkatKejuaraan)

                  return (
                    <tr
                      key={doc.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-2 text-sm text-slate-600 text-center">{index + 1}</td>
                      <td className="py-4 px-4 font-bold text-slate-800 text-sm">
                        {doc.namaKejuaraan}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 text-center">
                        {doc.peringkat}
                      </td>
                      <td
                        className={`py-4 px-4 text-sm
                          
                         ${doc?.status === 'approved' ? 'text-green-500 font-bold' : 'text-slate-600'}
                         text-center`}
                      >
                        {doc?.status === 'approved' && <>+</>}
                        {displayPoints}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="border border-blue-400 text-blue-500 px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Overlay */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Detail Prestasi</h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Nama Kejuaraan</div>
                  <div className="font-medium text-slate-800">{selectedDoc.namaKejuaraan}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Status Verifikasi</div>
                  <StatusBadge status={selectedDoc.status} />
                </div>

                <div>
                  <div className="text-slate-500 mb-1">Peringkat</div>
                  <div className="font-medium text-slate-800">{selectedDoc.peringkat}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Kategori</div>
                  <div className="font-medium text-slate-800">{selectedDoc.kategori}</div>
                </div>

                <div>
                  <div className="text-slate-500 mb-1">Tingkat</div>
                  <div className="font-medium text-slate-800">{selectedDoc.tingkatKejuaraan}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Tanggal</div>
                  <div className="font-medium text-slate-800">
                    {/* Menggunakan property string statis dari Server Component untuk mencegah Hydration Mismatch */}
                    {selectedDoc.tanggalFormatted}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-slate-500 mb-1">Lokasi</div>
                  <div className="font-medium text-slate-800">
                    {selectedDoc.lokasiKejuaraan || '-'}
                  </div>
                </div>
              </div>

              {selectedDoc.status === 'rejected' && selectedDoc.catatanPenolakan && (
                <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="text-red-800 font-semibold text-sm mb-1">
                    Catatan Penolakan Admin:
                  </div>
                  <div className="text-red-700 text-sm">{selectedDoc.catatanPenolakan}</div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
