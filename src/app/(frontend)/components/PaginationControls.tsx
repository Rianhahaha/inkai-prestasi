// src/components/PaginationControls.tsx
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
  onNext?: () => void
  onPrev?: () => void
}

export default function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  onNext,
  onPrev,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
      <div className="text-sm text-slate-500 font-medium">
        Halaman <span className="font-bold text-slate-800">{currentPage}</span> dari{' '}
        <span className="font-bold text-slate-800">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        {hasPrevPage ? (
          <button
            onClick={onPrev}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>
        ) : (
          <button
            disabled
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>
        )}

        {hasNextPage ? (
          <button
            onClick={onNext}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            disabled
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}