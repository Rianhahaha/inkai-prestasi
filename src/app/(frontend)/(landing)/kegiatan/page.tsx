import { getKontenData } from '@/app/api/getPayloadData'
import { AlertCircle, ImageIcon } from 'lucide-react'
import React from 'react'
import KontenCard from '../../components/KontenCard'
import PaginationControls from '../../components/PaginationControls'
import SearchBar from '../../components/SearchBar'
import { categoryOptions } from '@/lib/utils'
import Link from 'next/link'
import JadwalCarousel from './JadwalCarousel'
export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1

  const searchTerm = resolvedParams.search || ''
  const categorylist = ['Semua', ...categoryOptions]
  const activeCategory = resolvedParams.category || 'Semua'
  const currentCategory = resolvedParams.category || 'Semua' // Ambil dari URL
  const { docs: kontenDocs, pagination } = await getKontenData({
    status: 'published',
    search: searchTerm,
    page: currentPage,
    category: currentCategory,
  })

  return (
    <>
      <section className="w-full bg-[#C5DDFF] ">
        <div className="w-full min-h-[372px] flex flex-col justify-center py-24 px-6 max-w-7xl mx-auto">
          <h1 className="font-bold text-[45px]">Kegiatan</h1>
          <p className="w-[60%]">
            Jadwal latihan rutin, kejuaraan, seminar, dan berbagai kegiatan pengembangan atlet UKM
            Karate “INKAI” Universitas Negeri Yogyakarta.
          </p>
        </div>
      </section>
      {/* Jadwal Latihan */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full h-auto flex flex-col items-center justify-start gap-5">
        <div className="w-[20rem] text-center">
          <h4 className="uppercase text-blue-500 font-normal text-base mb-2">- LATIHAN -</h4>
          <h2 className="text-3xl font-bold text-blue-600">Jadwal Latihan Rutin</h2>
        </div>
        <JadwalCarousel />
        <div className="bg-[#C5DDFF] w-full rounded-lg flex items-center px-5 py-2 gap-2 max-w-5xl mx-auto">
          <AlertCircle />
          Wajib membawa kartu anggota dan perlengkapan lengkap saat latihan
        </div>
      </section>
      <div className="w-full h-full bg-[#F4F9FF]">
        <section
          id="konten-section"
          className="py-24 px-6 max-w-7xl mx-auto w-full min-h-screen flex flex-col items-center justify-start gap-5 "
        >
          <div className="w-[20rem] text-center">
            <h4 className="uppercase text-blue-500 font-normal text-base mb-2">- program -</h4>
            <h2 className="text-3xl font-bold text-blue-600">Kegiatan Kami</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-5">
            {categorylist.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <Link
                  key={cat}
                  href={{
                    pathname: '/kegiatan', // sesuaikan route kamu
                    query: {
                      ...resolvedParams,
                      category: cat === 'Semua' ? undefined : cat,
                      page: 1, // Reset ke page 1 tiap ganti filter
                    },
                    hash: 'konten-section',
                  }}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-colors border 
                  ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>
          <div className="w-full">
            <SearchBar placeholder="Cari judul konten..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {kontenDocs.length === 0 ? (
              <div className="col-span-full p-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                <p>Tidak ada konten yang ditemukan.</p>
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
        </section>
      </div>
    </>
  )
}
