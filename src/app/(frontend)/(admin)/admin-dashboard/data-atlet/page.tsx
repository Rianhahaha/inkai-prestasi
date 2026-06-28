// src/app/(frontend)/(admin)/data-atlet/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Users, User2, Plus } from 'lucide-react'
import Link from 'next/link'
import PaginationControls from '@/app/(frontend)/components/PaginationControls'
import { formatDate, sabukOptions } from '@/lib/utils'
import SearchBar from '@/app/(frontend)/components/SearchBar'
import AthleteFormModal from './AthleteFormModal'
import TableFilter, { FilterConfig } from '@/app/(frontend)/components/TableFilter'
import { buildSortParam } from '@/lib/buildSortParam'
import SortableTableHeader from '@/app/(frontend)/components/SortableTableHeader'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function DataAtletPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config })

  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 10
  const searchTerm = resolvedParams.search || ''

  const modalAction = resolvedParams.action // 'tambah' atau 'edit'
  const modalId = resolvedParams.id
  let modalInitialData = null
  const filterSabuk = resolvedParams.sabuk ? resolvedParams.sabuk.split(',') : []

  const sortField = resolvedParams.sort
  const sortDir = resolvedParams.dir

  if (modalAction === 'edit' && modalId) {
    try {
      modalInitialData = await payload.findByID({
        collection: 'users',
        id: modalId,
        depth: 0,
      })
    } catch (error) {
      // Abaikan jika ID tidak ditemukan, biarkan null
    }
  }

  // 1. Eksekusi Query Dinamis (dengan Omnisearch jika diperlukan)
  const queryWhere: any = {
    and: [{ role: { equals: 'athlete' } }],
  }

  if (searchTerm) {
    queryWhere.or = [{ namaLengkap: { contains: searchTerm } }, { email: { contains: searchTerm } }]
  }

  if (filterSabuk.length > 0) {
    queryWhere.and.push({ sabuk: { in: filterSabuk } })
  }

  const tableData = await payload.find({
    collection: 'users',
    where: queryWhere,
    depth: 0, // Kedalaman 0 cukup untuk data profil dasar
    sort: buildSortParam(sortField, sortDir, '-createdAt'),
    page: currentPage,
    limit: limitPerPage,
  })

  // console.log(tableData)

  // 2. Fungsi Ekstraksi Warna Sabuk Berdasarkan String Database
  const getBeltColor = (sabuk: string) => {
    if (!sabuk) return 'bg-slate-100 text-slate-700 border-slate-200'
    const s = sabuk.toLowerCase()
    if (s.includes('putih')) return 'bg-slate-50 text-slate-700 border-slate-300'
    if (s.includes('kuning')) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (s.includes('hijau')) return 'bg-green-100 text-green-800 border-green-300'
    if (s.includes('biru')) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (s.includes('coklat')) return 'bg-[#d4a373]/30 text-[#8b5a2b] border-[#d4a373]' // Earth tone soft
    if (s.includes('hitam')) return 'bg-slate-800 text-white border-slate-900'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }
  // console.log(sabukOptions)
  const sabukFilters: FilterConfig[] = [
    {
      key: 'sabuk',
      placeholder: 'Filter Sabuk',
      options: sabukOptions.map((sabuk) => ({ label: sabuk, value: sabuk })),
    },
  ]
  // console.log(getBeltColor)
  // console.log(sabukFilters)

  return (
    <>
      {modalAction === 'tambah' && <AthleteFormModal />}
      {modalAction === 'edit' && modalInitialData && (
        <AthleteFormModal initialData={modalInitialData} />
      )}
      <div className="flex flex-col gap-6">
        {/* Header Section dengan Tombol Tambah */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-medium text-[32px] text-slate-800">Data Atlet</h1>
            {/* <p className="text-slate-500 mt-1">
            Direktori seluruh atlet yang terdaftar di dalam sistem.
          </p> */}
          </div>

          <Link
            href="?action=tambah"
            scroll={false}
            className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Atlet
          </Link>
        </div>

        <SearchBar placeholder="Cari nama atlet..." />
        <TableFilter filters={sabukFilters} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-800 text-[15px]">Daftar Atlet</h2>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              Total: {tableData.totalDocs} Atlet
            </div>
          </div>

          {/* Tabel Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm">No.</th>
                  <SortableTableHeader label="Nama Atlet" sortKey="namaLengkap" />
                  <SortableTableHeader label="Sabuk" sortKey="sabuk" className="text-center" />
                  <SortableTableHeader
                    label="Total Poin"
                    sortKey="totalPoin"
                    className="text-center"
                  />
                  <SortableTableHeader label="Email" sortKey="email" />
                  <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tableData.docs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Belum ada data atlet yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  tableData.docs.map((doc: any, index) => (
                    <tr
                      key={doc.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* 3. Kolom Nama dengan Avatar Dummy */}
                      {/* 4. Kolom Sabuk (Pill Style) */}
                      <td className="py-4 px-6 text-center flex justify-center">
                        {(currentPage - 1) * limitPerPage + index + 1}
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
                          <div className="font-bold text-slate-800 text-sm">{doc.namaLengkap}</div>
                        </div>
                      </td>

                      {/* 4. Kolom Sabuk (Pill Style) */}
                      <td className="py-4 px-6 text-center flex justify-center">
                        <span
                          className={`px-4 py-1 rounded-md text-xs font-bold border ${getBeltColor(doc.sabuk)}`}
                        >
                          {doc.sabuk || 'Belum Diatur'}
                        </span>
                      </td>

                      {/* 5. Kolom Total Poin */}
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-medium text-slate-700">
                          {doc.totalPoin || 0}{' '}
                          <span className="text-slate-400 font-normal">poin</span>
                        </span>
                      </td>

                      {/* 6. Kolom Email */}
                      <td className="py-4 px-6 text-sm text-slate-500">{doc.email}</td>

                      {/* 7. Kolom Aksi (Detail & Edit) */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin-dashboard/data-atlet/${doc.id}`}
                            className="border border-blue-200 text-blue-500 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-50 transition-colors"
                          >
                            Detail
                          </Link>
                          <Link
                            href={`?action=edit&id=${doc.id}`}
                            scroll={false}
                            className="border border-slate-200 text-slate-600 px-3 py-1 rounded text-xs font-semibold hover:bg-slate-100 transition-colors"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
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
    </>
  )
}
