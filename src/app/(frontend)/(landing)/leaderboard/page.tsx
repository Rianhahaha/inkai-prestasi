import { getLeaderboardData } from '@/app/api/getPayloadData'
import { getBeltColor } from '@/lib/utils'
import { User2 } from 'lucide-react'
import React from 'react'
import Podium from '../../components/Podium'
import PaginationControls from '../../components/PaginationControls'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const payload = await getPayload({ config })
  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 10
  const searchTerm = resolvedParams.search || ''
  const queryWhere: any = {
    role: { equals: 'athlete' },
  }
  if (searchTerm) {
    // Sesuaikan field pencarian jika perlu
    queryWhere.namaLengkap = { contains: searchTerm }
  }

  const { top3, tableDocs, pagination } = await getLeaderboardData({
    limit: limitPerPage,
    search: searchTerm,
    page: currentPage,
  })

  const tableDocsWIthMedals = await Promise.all(
    tableDocs.map(async (doc: any) => {
      const countResult = await payload.count({
        collection: 'achievements',
        where: {
          and: [{ atlet: { equals: doc.id } }, { status: { equals: 'approved' } }],
        },
      })
      return { ...doc, totalMedali: countResult.totalDocs }
    }),
  )

  return (
    <>
      <section className="w-full bg-[#C5DDFF] ">
        <div className="w-full min-h-[372px] flex flex-col justify-center py-24 px-6 max-w-7xl mx-auto">
          <h1 className="font-bold text-[45px]">Leaderboard</h1>
          <p className="w-[60%]">
            Peringkat atlet terbaik berdasarkan total poin dan prestasi di berbagai kejuaraan.
          </p>
        </div>
      </section>

      <section id="leaderboard" className="py-24 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-12">Leaderboard Atlet Berprestasi</h2>
          {/* Slot for Leaderboard Data */}
          <Podium top3={top3} />
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center w-24">
                        Rank
                      </th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-sm">Nama Atlet</th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                        Sabuk
                      </th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                        Total Poin
                      </th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                        Medali
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDocsWIthMedals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          Tidak ada data atlet yang ditemukan.
                        </td>
                      </tr>
                    ) : (
                      tableDocsWIthMedals.map((doc: any, index: number) => {
                        const absoluteRank = doc.absoluteRank

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
                              {doc.totalMedali || 0}
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
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                nextPage={pagination.nextPage}
                prevPage={pagination.prevPage}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
