// src/app/(frontend)/(admin)/data-atlet/[id]/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArrowLeft, Award, Trophy, User2, Mail, Phone, MapPin, Calendar, Info } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { calculatePoints } from '@/lib/points'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}

// 2. Dictionary Pattern untuk Badge Status & Tingkat
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-[#fef08a] text-[#ca8a04]', // Yellow
    approved: 'bg-[#dcfce7] text-[#22c55e]', // Green
    rejected: 'bg-[#fee2e2] text-[#ef4444]', // Red
  }
  const labels: Record<string, string> = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  }
  return (
    <span
      className={`px-4 py-1.5 rounded-md text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {labels[status] || status}
    </span>
  )
}

const TingkatBadge = ({ tingkat }: { tingkat: string }) => {
  return (
    <span className="px-4 py-1.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-600">
      {tingkat}
    </span>
  )
}

export default async function DetailAtletPage({ params }: PageProps) {
  const resolvedParams = await params
  const athleteId = resolvedParams.id
  const payload = await getPayload({ config })

  try {
    // 3. Parallel Fetching: Ambil user dan prestasinya sekaligus
    const [user, achievementsData] = await Promise.all([
      payload.findByID({
        collection: 'users',
        id: athleteId,
        depth: 0,
      }),
      payload.find({
        collection: 'achievements',
        where: { atlet: { equals: athleteId } },
        sort: '-tanggalKejuaraan',
        limit: 100, // Asumsi tampilan riwayat lengkap tanpa paginasi kompleks untuk detail
        depth: 0,
      }),
    ])

    if (user.role !== 'athlete') {
      return notFound() // Guard: Jangan tampilkan jika ID tersebut bukan atlet
    }

    return (
      <div className="flex flex-col gap-6 max-w-6xl">
        {/* Header Navigasi */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin-dashboard/data-atlet/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            Data Atlet
          </Link>
          {/* Tombol Edit: Nantinya bisa memicu parameter ?modal=edit atau route khusus */}
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer">
            Edit Profil →
          </button>
        </div>

        {/* Hero Banner Profil */}
        <div className="bg-[#8bb4f7] rounded-2xl p-8 flex items-center gap-6 shadow-sm relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white/50 shadow-md flex items-center justify-center overflow-hidden shrink-0 z-10">
            {/* {user.fotoProfil?.url ? (
              <img src={user.fotoProfil.url} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <User2 className="w-10 h-10 text-slate-300" />
              )} */}
            <User2 className="w-10 h-10 text-slate-300" />
          </div>
          <div className="flex flex-col gap-1 z-10">
            <h1 className="text-3xl font-bold text-slate-900">{user.namaLengkap}</h1>
            <div className="text-slate-800 font-medium">Sabuk {user.sabuk}</div>
          </div>
          {/* Ornamen dekoratif (opsional, meniru gradasi UI) */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        </div>

        {/* Statistik Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#cffafe] text-[#06b6d4] flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <div className="text-slate-800 font-bold text-lg">Total Poin</div>
              <div className="text-2xl font-bold text-slate-900">
                {user.totalPoin || 0}{' '}
                <span className="text-slate-500 font-medium text-base">poin</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#dcfce7] text-[#22c55e] flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <div className="text-slate-800 font-bold text-lg">Total Prestasi</div>
              <div className="text-2xl font-bold text-slate-900">
                {achievementsData.totalDocs}{' '}
                <span className="text-slate-500 font-medium text-base">prestasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Informasi Pribadi */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800">Informasi Pribadi</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Tempat Tanggal Lahir
              </div>
              <div className="font-bold text-slate-800">
                {user.tempatLahir || '-'}, {user.tanggalLahir ? formatDate(user.tanggalLahir) : '-'}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </div>
              <div className="font-bold text-slate-800">{user.email}</div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Nomor Telepon
              </div>
              <div className="font-bold text-slate-800">{user.nomorTelepon || '-'}</div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Sabuk
              </div>
              <div className="font-bold text-slate-800">{user.sabuk || '-'}</div>
            </div>
          </div>
        </div>

        {/* Tabel Riwayat Prestasi */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800">Riwayat Prestasi</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm">Nama Kejuaraan</th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm">Juara</th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                    Tingkat
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Status</th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Poin</th>
                </tr>
              </thead>
              <tbody>
                {achievementsData.docs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Atlet ini belum memiliki riwayat prestasi.
                    </td>
                  </tr>
                ) : (
                  achievementsData.docs.map((doc: any) => {
                    const rowPoints = calculatePoints(
                      doc.jenisKejuaraan,
                      doc.tingkatKejuaraan,
                      doc.peringkat,
                    )

                    return (
                      <tr
                        key={doc.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 text-sm whitespace-normal max-w-[280px]">
                            {doc.namaKejuaraan}
                          </div>
                          {/* Opsional: Render tahun dari tanggalKejuaraan jika desain membutuhkan konteks waktu */}
                          <div className="text-xs text-slate-400 mt-0.5">
                            {new Date(doc.tanggalKejuaraan).getFullYear()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-700 font-medium">
                          {doc.peringkat}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <TingkatBadge tingkat={doc.tingkatKejuaraan} />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-800">
                          {rowPoints}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    // Tangkap error jika ID format tidak valid (bukan number/UUID)
    return notFound()
  }
}
