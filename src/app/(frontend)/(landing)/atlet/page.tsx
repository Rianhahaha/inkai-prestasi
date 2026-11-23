// src/app/(frontend)/(public)/atlet/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { getAllAthletes } from '@/lib/static-data'
import SearchBar from '../../components/SearchBar'
import TableFilter, { FilterConfig } from '../../components/TableFilter'
import { getBeltColor, sabukOptions } from '@/lib/utils'
import { User2, Users } from 'lucide-react'
import SortableTableHeader from '../../components/SortableTableHeader'
import Link from 'next/link'
import Image from 'next/image'
import PaginationControls from '@/app/(frontend)/components/PaginationControls'

export default function Page() {
  const [allAthletes, setAllAthletes] = useState<Awaited<ReturnType<typeof getAllAthletes>>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSabuk, setFilterSabuk] = useState<Record<string, string[]>>({ sabuk: [] })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const limitPerPage = 10

  // Fetch athletes on mount
  React.useEffect(() => {
    getAllAthletes().then(setAllAthletes)
  }, [])

  // Filter and sort athletes
  const filteredAthletes = useMemo(() => {
    let result = allAthletes

    if (searchTerm) {
      result = result.filter(a =>
        a.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    const selectedSabuk = filterSabuk.sabuk || []
    if (selectedSabuk.length > 0) {
      result = result.filter(a => selectedSabuk.includes(a.sabuk))
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a]
        const bVal = b[sortConfig.key as keyof typeof b]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [allAthletes, searchTerm, filterSabuk, sortConfig])

  // Pagination
  const totalDocs = filteredAthletes.length
  const totalPages = Math.ceil(totalDocs / limitPerPage)
  const startIndex = (currentPage - 1) * limitPerPage
  const endIndex = startIndex + limitPerPage
  const docs = filteredAthletes.slice(startIndex, endIndex)

  const sabukFilters: FilterConfig[] = [
    {
      key: 'sabuk',
      placeholder: 'Filter Sabuk',
      options: sabukOptions.map((sabuk) => ({ label: sabuk, value: sabuk })),
    },
  ]

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilterChange = (key: string, values: string[]) => {
    setFilterSabuk(prev => ({ ...prev, [key]: values }))
  }

  return (
    <>
      <section className="w-full bg-[#C5DDFF] ">
        <div className="w-full min-h-[372px] flex flex-col justify-center py-24 px-6 max-w-7xl mx-auto">
          <h1 className="font-bold text-[45px]">Atlet</h1>
          <p className="w-[60%]">
            Mengenal lebih dekat para atlet berbakat yang mengharumkan nama UNY di berbagai
            kejuaraan.
          </p>
        </div>
      </section>

      {/* Daftar Atlet */}
      <section
        id="daftar-atlet"
        className="pt-16 pb-24 px-6 max-w-7xl mx-auto w-full h-auto flex flex-col items-center justify-start gap-5"
      >
        <div className="flex flex-col gap-6 w-full flex-wrap">
          {/* Header Section dengan Tombol Tambah */}
          <div className="flex gap-5">
            <SearchBar 
              placeholder="Cari nama atlet..." 
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <TableFilter 
              filters={sabukFilters} 
              selectedValues={filterSabuk}
              onChange={handleFilterChange}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            {/* Table Toolbar */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500" />
                <h2 className="font-semibold text-slate-800 text-[15px]">Daftar Atlet</h2>
              </div>
              <div className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                Total: {totalDocs} Atlet
              </div>
            </div>

            {/* Tabel Data */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="py-4 px-6 font-bold text-slate-700 text-sm">No.</th>
                    <SortableTableHeader 
                      label="Nama Atlet" 
                      sortKey="namaLengkap" 
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      align="center"
                      label="Sabuk"
                      sortKey="sabuk"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-center"
                    />
                    <SortableTableHeader
                      label="Total Poin"
                      sortKey="totalPoin"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-center"
                    />
                    {/* <SortableTableHeader label="Email" sortKey="email" /> */}
                    <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        Belum ada data atlet yang terdaftar.
                      </td>
                    </tr>
                  ) : (
                    docs.map((doc: any, index) => (
                      <tr
                        key={doc.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* No. */}
                        <td className="py-4 px-6 text-center flex justify-center">
                          {startIndex + index + 1}
                        </td>
                        {/* 3. Kolom Nama dengan Avatar Dummy */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {doc.fotoProfil ? (
                                <Image
                                  width={100}
                                  height={100}
                                  src={doc.fotoProfil}
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

                        {/* 4. Kolom Sabuk (Pill Style) */}
                        <td className="py-4 px-6 text-center flex justify-center">
                          <span
                            className={`px-4 py-1 rounded-md text-xs font-bold border w-[10rem] ${getBeltColor(doc.sabuk)}`}
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

                        {/* 6. Kolom Aksi (Detail & Edit) */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/atlet/${doc.id}`}
                              className="border border-blue-200 text-blue-500 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-50 transition-colors"
                            >
                              Lihat Detail
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
              totalPages={totalPages}
              hasNextPage={currentPage < totalPages}
              hasPrevPage={currentPage > 1}
              onNext={() => setCurrentPage(p => p + 1)}
              onPrev={() => setCurrentPage(p => p - 1)}
            />
          </div>
        </div>
      </section>
    </>
  )
}