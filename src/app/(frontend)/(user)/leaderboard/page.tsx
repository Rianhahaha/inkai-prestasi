// src/app/(frontend)/(user)/leaderboard/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { User2 } from 'lucide-react'
import PaginationControls from '@/app/(frontend)/components/PaginationControls'
import SearchBar from '@/app/(frontend)/components/SearchBar'
import { calculatePoints, POINT_MATRIX } from '@/lib/points'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config })
  const resolvedParams = await searchParams

  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 10
  const searchTerm = resolvedParams.search || ''

  // 1. Decoupled Parallel Data Fetching
  const queryWhere: any = {
    role: { equals: 'athlete' },
  }

  if (searchTerm) {
    // Sesuaikan field pencarian jika perlu
    queryWhere.namaLengkap = { contains: searchTerm }
  }

  const [podiumData, tableData] = await Promise.all([
    // Query A: Global Top 3 (Statis, kebal terhadap search & pagination)
    payload.find({
      collection: 'users',
      where: { role: { equals: 'athlete' } },
      sort: '-totalPoin',
      limit: 3,
      depth: 1, // Ekstrak URL relasi fotoProfil
    }),
    // Query B: Paginated & Filtered Table
    payload.find({
      collection: 'users',
      where: queryWhere,
      sort: '-totalPoin',
      page: currentPage,
      limit: limitPerPage,
      depth: 1,
    }),
  ])

  const top3 = podiumData.docs
  const rank1 = top3[0]
  const rank2 = top3[1]
  const rank3 = top3[2]

  // 2. Utilitas Visual
  const getBeltColor = (sabuk: string) => {
    if (!sabuk) return 'bg-slate-100 text-slate-700 border-slate-200'
    const s = sabuk.toLowerCase()
    if (s.includes('putih')) return 'bg-slate-50 text-slate-700 border-slate-300'
    if (s.includes('kuning')) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (s.includes('hijau')) return 'bg-green-100 text-green-800 border-green-300'
    if (s.includes('biru')) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (s.includes('coklat')) return 'bg-[#d4a373]/30 text-[#8b5a2b] border-[#d4a373]'
    if (s.includes('hitam')) return 'bg-slate-800 text-white border-slate-900'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  // Type Guard Helper: Ekstrak URL secara aman dari Payload Relationship Field
  const getAvatarUrl = (mediaField: any): string | null => {
    if (typeof mediaField === 'object' && mediaField !== null && 'url' in mediaField) {
      return mediaField.url as string
    }
    return null
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <h1 className="font-medium text-[32px] text-slate-800">Leaderboard</h1>

      {/* 3. PODIUM COMPONENT (Hanya tampil di halaman 1 dan jika tidak sedang mencari) */}
      {!searchTerm && currentPage === 1 && top3.length > 0 && (
        <div className="flex justify-center items-end gap-4 mt-8 mb-4 h-[300px]">
          {/* Rank 2 (Kiri) */}
          {rank2 && (
            <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-t-3xl w-64 p-6 pt-10 relative h-[80%]">
              <div className="absolute -top-6 bg-slate-300 text-white w-10 h-10 flex items-center justify-center font-bold text-xl clip-star">
                2
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 bg-amber-100 flex items-center justify-center overflow-hidden">
                {getAvatarUrl(rank1.fotoProfil) ? (
                  <img
                    src={getAvatarUrl(rank1.fotoProfil)!}
                    alt="Rank 1"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-10 h-10 text-amber-400" />
                )}
              </div>{' '}
              <h3 className="font-bold text-lg text-center truncate w-full">{rank2.namaLengkap}</h3>
              <p className="font-bold text-slate-400 text-xl mt-1">{rank2.totalPoin} poin</p>
            </div>
          )}

          {/* Rank 1 (Tengah) */}
          {rank1 && (
            <div className="flex flex-col items-center bg-amber-50 border border-amber-200 rounded-t-3xl w-72 p-6 pt-12 relative h-full shadow-lg z-10">
              <div className="absolute -top-8 bg-amber-400 text-white w-14 h-14 flex items-center justify-center font-bold text-2xl clip-star shadow-sm">
                1
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 bg-amber-100 flex items-center justify-center overflow-hidden">
                {getAvatarUrl(rank1.fotoProfil) ? (
                  <img
                    src={getAvatarUrl(rank1.fotoProfil)!}
                    alt="Rank 1"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-10 h-10 text-amber-400" />
                )}
              </div>
              <h3 className="font-bold text-xl text-center truncate w-full">{rank1.namaLengkap}</h3>
              <p className="font-bold text-amber-500 text-2xl mt-1">{rank1.totalPoin} poin</p>
            </div>
          )}

          {/* Rank 3 (Kanan) */}
          {rank3 && (
            <div className="flex flex-col items-center bg-orange-50 border border-orange-200 rounded-t-3xl w-64 p-6 pt-10 relative h-[70%]">
              <div className="absolute -top-6 bg-orange-400 text-white w-10 h-10 flex items-center justify-center font-bold text-xl clip-star">
                3
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 bg-amber-100 flex items-center justify-center overflow-hidden">
                {getAvatarUrl(rank1.fotoProfil) ? (
                  <img
                    src={getAvatarUrl(rank1.fotoProfil)!}
                    alt="Rank 1"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-10 h-10 text-amber-400" />
                )}
              </div>{' '}
              <h3 className="font-bold text-lg text-center truncate w-full">{rank3.namaLengkap}</h3>
              <p className="font-bold text-orange-500 text-xl mt-1">{rank3.totalPoin} poin</p>
            </div>
          )}
        </div>
      )}

      {/* 4. TABEL DATA (Persis seperti format Data Atlet) */}
      <div className="flex flex-col gap-4">
        <SearchBar placeholder="Cari nama atlet..." />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center w-24">
                    Rank
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm">Nama Atlet</th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Sabuk</th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                    Total Poin
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Medali</th>
                </tr>
              </thead>
              <tbody>
                {tableData.docs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Tidak ada data atlet yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  tableData.docs.map((doc: any, index: number) => {
                    const rowPoints = calculatePoints(
                      doc.jenisKejuaraan,
                      doc.tingkatKejuaraan,
                      doc.peringkat,
                    )
                    const absoluteRank = (currentPage - 1) * limitPerPage + index + 1

                    // Indikator Warna Rank (Hanya untuk Top 3)
                    let rankColor = 'text-slate-700 font-bold'
                    let rankBg = 'bg-transparent'
                    if (absoluteRank === 1) {
                      rankColor = 'text-white font-bold'
                      rankBg = 'bg-amber-400'
                    } else if (absoluteRank === 2) {
                      rankColor = 'text-white font-bold'
                      rankBg = 'bg-slate-300'
                    } else if (absoluteRank === 3) {
                      rankColor = 'text-white font-bold'
                      rankBg = 'bg-orange-400'
                    }

                    return (
                      <tr
                        key={doc.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${rankBg} ${rankColor}`}
                          >
                            {absoluteRank}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {doc.fotoProfil?.url ? (
                                <img
                                  src={doc.fotoProfil.url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User2 className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="font-bold text-slate-800 text-sm">
                              {doc.namaLengkap}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center flex justify-center">
                          <span
                            className={`px-4 py-1 rounded-md text-xs font-bold border ${getBeltColor(doc.sabuk)}`}
                          >
                            {doc.sabuk || 'Belum Diatur'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm font-medium text-slate-700">
                            {doc.totalPoin || 0}{' '}
                            <span className="text-slate-400 font-normal">poin</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-medium text-slate-700">
                          0{' '}
                          {/* Ganti dengan doc.totalMedali jika field-nya sudah Anda buat nanti */}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={tableData.totalPages}
            hasNextPage={tableData.hasNextPage}
            hasPrevPage={tableData.hasPrevPage}
            nextPage={tableData.nextPage}
            prevPage={tableData.prevPage}
          />
        </div>
      </div>
    </div>
  )
}
