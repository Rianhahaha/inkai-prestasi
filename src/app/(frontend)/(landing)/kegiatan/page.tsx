'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { getAllKonten, getUpcomingEvents } from '@/lib/static-data'
import { categoryOptions } from '@/lib/utils'
import { AlertCircle, ImageIcon } from 'lucide-react'
import KontenCard from '../../components/KontenCard'
import PaginationControls from '../../components/PaginationControls'
import SearchBar from '../../components/SearchBar'
import Link from 'next/link'
import JadwalCarousel from './JadwalCarousel'

export default function page() {
  const [allKonten, setAllKonten] = useState<Awaited<ReturnType<typeof getAllKonten>>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const limitPerPage = 9

  const categorylist = ['Semua', ...categoryOptions]

  // Fetch konten on mount
  useEffect(() => {
    getAllKonten().then(setAllKonten)
  }, [])

  // Filter and sort konten
  const filteredKonten = useMemo(() => {
    let result = allKonten

    if (activeCategory !== 'Semua') {
      result = result.filter(k => k.kategori === activeCategory)
    }

    if (searchTerm) {
      result = result.filter(k => 
        k.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.ringkasan.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by publishedAt descending
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return result
  }, [allKonten, activeCategory, searchTerm])

  // Pagination
  const totalDocs = filteredKonten.length
  const totalPages = Math.ceil(totalDocs / limitPerPage)
  const startIndex = (currentPage - 1) * limitPerPage
  const endIndex = startIndex + limitPerPage
  const kontenDocs = filteredKonten.slice(startIndex, endIndex)

  const pagination = {
    totalDocs,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage + 1,
    prevPage: currentPage - 1,
  }

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchTerm])

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
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-colors border 
                  ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
          <div className="w-full">
            <SearchBar 
              placeholder="Cari judul konten..." 
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 w-full">
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
                totalPages={totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onNext={() => setCurrentPage(p => p + 1)}
                onPrev={() => setCurrentPage(p => p - 1)}
              />
            </div>
          )}
        </section>
      </div>
    </>
  )
}