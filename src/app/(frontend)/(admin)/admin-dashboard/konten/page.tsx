// src/app/(frontend)/(admin)/kelola-konten/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { CalendarDays, MapPin, Plus, Image as ImageIcon } from 'lucide-react'
import SearchBar from '@/app/(frontend)/components/SearchBar'
import PaginationControls from '@/app/(frontend)/components/PaginationControls'

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

  if (searchTerm) {
    queryWhere.judul = { contains: searchTerm }
  }

  const kontenData = await payload.find({
    collection: 'konten',
    where: queryWhere,
    sort: '-createdAt',
    page: currentPage,
    limit: limitPerPage,
    depth: 1, // Ekstrak URL Thumbnail
  })

  // 2. Type Guard Helper untuk Media Resolusion
  const getMediaUrl = (mediaField: any): string | null => {
    if (typeof mediaField === 'object' && mediaField !== null && 'url' in mediaField) {
      return mediaField.url as string
    }
    return null
  }

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
        {kontenData.docs.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
            <p>Tidak ada konten {currentStatus} yang ditemukan.</p>
          </div>
        ) : (
          kontenData.docs.map((item: any) => {
            const thumbnailUrl = getMediaUrl(item.thumbnail)

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
              >
                {/* Thumbnail Area */}
                <div className="relative h-48 bg-slate-100 w-full shrink-0 flex items-center justify-center overflow-hidden">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                  {/* Category Badge absolute */}
                  <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded">
                    {item.kategori}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-[16px] leading-snug line-clamp-2 mb-3">
                    {item.judul}
                  </h3>

                  {/* Meta Data */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate">{item.tanggalPelaksanaan || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate">{item.lokasi || '-'}</span>
                    </div>
                  </div>

                  {/* Ringkasan */}
                  <p className="text-sm text-slate-600 line-clamp-3 mb-5 flex-grow">
                    {item.ringkasan}
                  </p>

                  {/* Action Link: Edit via Native Admin */}
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <a
                      href={`/superadmin/collections/konten/${item.id}`}
                      className="text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors inline-block"
                    >
                      Lihat detail / Edit
                    </a>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Container */}
      {kontenData.totalPages > 1 && (
        <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={kontenData.totalPages}
            hasNextPage={kontenData.hasNextPage}
            hasPrevPage={kontenData.hasPrevPage}
            nextPage={kontenData.nextPage}
            prevPage={kontenData.prevPage}
          />
        </div>
      )}
    </div>
  )
}
