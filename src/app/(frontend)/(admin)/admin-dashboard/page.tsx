// src/app/(admin)/admin-dashboard/page.tsx
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import VerificationActions from './VerificationActions'

export default async function AdminDashboardPage() {
  const payload = await getPayload({ config })

  // Ambil hanya prestasi dengan status 'pending'
  // Depth 2 diperlukan agar Payload me-resolve relasi:
  // Achievement -> Atlet (User) DAN Achievement -> Sertifikat (Media)
  const pendingAchievements = await payload.find({
    collection: 'achievements',
    where: {
      status: { equals: 'pending' },
    },
    depth: 2,
    sort: 'createdAt', // FIFO (First In First Out)
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Verifikasi Prestasi</h1>
        <p className="text-slate-500">Daftar pengajuan prestasi yang membutuhkan peninjauan.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-medium text-slate-600 text-sm">Nama Atlet</th>
              <th className="p-4 font-medium text-slate-600 text-sm">Detail Kejuaraan</th>
              <th className="p-4 font-medium text-slate-600 text-sm">Sertifikat</th>
              <th className="p-4 font-medium text-slate-600 text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendingAchievements.docs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Tidak ada pengajuan yang tertunda.
                </td>
              </tr>
            ) : (
              pendingAchievements.docs.map((doc: any) => (
                <tr
                  key={doc.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{doc.atlet?.namaLengkap}</div>
                    <div className="text-sm text-slate-500">{doc.atlet?.sabuk}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{doc.namaKejuaraan}</div>
                    <div className="text-sm text-slate-500">
                      {doc.peringkat} - {doc.tingkatKejuaraan}
                    </div>
                  </td>
                  <td className="p-4">
                    {doc.sertifikat?.url ? (
                      <a
                        href={doc.sertifikat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Lihat Dokumen
                      </a>
                    ) : (
                      <span className="text-red-500 text-sm">File Tidak Valid</span>
                    )}
                  </td>
                  <td className="p-4">
                    <VerificationActions achievementId={doc.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
