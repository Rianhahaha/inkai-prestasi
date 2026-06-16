// src/app/(frontend)/(admin)/data-atlet/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Users } from 'lucide-react' // Asumsi menggunakan lucide-react
import PaginationControls from '@/app/(frontend)/components/PaginationControls' // Sesuaikan path
import { formatDate, formatDateTime } from '@/lib/utils' // Fungsi format tanggal dari step sebelumnya

// [!] ABSOLUTE RULE: Hancurkan cache Next.js untuk data dinamis
export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function DataAtletPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config })

  // 1. Parse URL Parameters
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 10

  // 2. Fetch Data (Hanya ambil yang rolenya 'athlete')
  const tableData = await payload.find({
    collection: 'users',
    where: {
      role: { equals: 'athlete' },
    },
    depth: 0, // Depth 0 cukup karena kita tidak butuh relasi dalam untuk list dasar
    sort: '-createdAt', // Urutkan dari yang terbaru mendaftar
    page: currentPage,
    limit: limitPerPage,
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="font-medium text-[32px] text-slate-800">Data Atlet</h1>
        <p className="text-slate-500 mt-1">
          Direktori seluruh atlet yang terdaftar di dalam sistem.
        </p>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Table Header Section */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-slate-800 text-[15px]">Daftar Atlet</h2>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            Total: {tableData.totalDocs} Atlet
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-700 text-sm w-16">No.</th>
                <th className="py-4 px-6 font-bold text-slate-700 text-sm">Nama Lengkap</th>
                <th className="py-4 px-6 font-bold text-slate-700 text-sm">Email Akun</th>
                <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Sabuk</th>
                <th className="py-4 px-6 font-bold text-slate-700 text-sm text-right">
                  Tanggal Bergabung
                </th>
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
                tableData.docs.map((doc: any, index: number) => (
                  <tr
                    key={doc.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Kalkulasi Nomor Urut Absolut */}
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-medium">
                        {(currentPage - 1) * limitPerPage + index + 1}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{doc.namaLengkap}</div>
                    </td>

                    <td className="py-4 px-6 text-sm text-slate-500">{doc.email}</td>

                    <td className="py-4 px-6 text-center flex justify-center">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-md text-xs font-bold">
                        {doc.sabuk}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm text-slate-500 font-normal text-right">
                      {formatDateTime(doc.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Integration */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={tableData.totalPages}
          hasNextPage={tableData.hasNextPage}
          hasPrevPage={tableData.hasPrevPage}
          nextPage={tableData.nextPage}
          prevPage={tableData.prevPage}
          currentStatus="" // Kosongkan karena kita tidak memfilter berdasarkan status di halaman ini
        />
      </div>
    </div>
  )
}
