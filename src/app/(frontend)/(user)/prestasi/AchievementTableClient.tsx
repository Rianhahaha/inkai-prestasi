// src/app/(user)/prestasi/AchievementTableClient.tsx
'use client'

import React, { useState } from 'react'
import { calculatePoints } from '@/lib/points'
import AthleteDetailModal from '../components/AthleteDetailModal'

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
                <th className="py-4 px-4 font-bold text-slate-800 text-sm text-center">
                  Jenis Kejuaraan
                </th>
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
                  const displayPoints = calculatePoints(
                    doc.jenisKejuaraan,
                    doc.tingkatKejuaraan,
                    doc.peringkat,
                  )
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
                      <td className="py-4 px-4 text-sm text-slate-600 text-center">
                        {doc.jenisKejuaraan}
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

      {/* [!] Render Modal Eksternal */}
      {selectedDoc && <AthleteDetailModal doc={selectedDoc} onClose={closeModal} />}
    </>
  )
}
