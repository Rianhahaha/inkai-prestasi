// src/app/(frontend)/(admin)/kelola-konten/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { CalendarDays, MapPin, Plus, Image as ImageIcon, Edit } from 'lucide-react'
import SearchBar from '@/app/(frontend)/components/SearchBar'
import PaginationControls from '@/app/(frontend)/components/PaginationControls'
import KontenCard from '@/app/(frontend)/components/KontenCard'
import { getKontenData } from '@/app/api/getPayloadData'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function KelolaKontenPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config })
  const resolvedParams = await searchParams

  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 9 // 3x3 grid
  const searchTerm = resolvedParams.search || ''

  // Tab Routing State
  const currentStatus = resolvedParams.status === 'draft' ? 'draft' : 'published'

  // 1. Kueri Dinamis (Decoupled dari UI)
  const queryWhere: any = {
    status: { equals: currentStatus },
  }

  // if (searchTerm) {
  //   queryWhere.judul = { contains: searchTerm }
  // }

  // const kontenData = await payload.find({
  //   collection: 'konten',
  //   where: queryWhere,
  //   sort: '-createdAt',
  //   page: currentPage,
  //   limit: limitPerPage,
  //   depth: 1, // Ekstrak URL Thumbnail
  // })

  // // 2. Type Guard Helper untuk Media Resolusion
  // const getMediaUrl = (mediaField: any): string | null => {
  //   if (typeof mediaField === 'object' && mediaField !== null && 'url' in mediaField) {
  //     return mediaField.url as string
  //   }
  //   return null
  // }

  const { docs: kontenDocs, pagination } = await getKontenData({
    status: currentStatus,
    search: searchTerm,
    page: currentPage,
    limit: 0,
  })

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-medium text-[32px] text-slate-800">Kelola Konten</h1>
        </div>

        {/* Bypass ke Native Admin untuk Lexical Editor */}
        <a
          href="/superadmin/collections/konten/create"
          className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Konten
        </a>
      </div>

      {/* Control Bar: Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="w-full md:w-96">
          <SearchBar placeholder="Cari judul konten..." />
        </div>

        {/* Tab Switcher menggunakan URL Params */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          <Link
            href={`?status=published${searchTerm ? `&search=${searchTerm}` : ''}`}
            scroll={false}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all text-center ${
              currentStatus === 'published'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Published
          </Link>
          <Link
            href={`?status=draft${searchTerm ? `&search=${searchTerm}` : ''}`}
            scroll={false}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all text-center ${
              currentStatus === 'draft'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Draft
          </Link>
        </div>
      </div>

      {/* Grid Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {kontenDocs.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
            <p>Tidak ada konten {currentStatus} yang ditemukan.</p>
          </div>
        ) : (
          kontenDocs.map((item: any) => <KontenCard key={item.id} item={item} />)
        )}
      </div>

      {/* Pagination Container */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            nextPage={pagination.nextPage}
            prevPage={pagination.prevPage}
          />
        </div>
      )}
    </div>
  )
}
