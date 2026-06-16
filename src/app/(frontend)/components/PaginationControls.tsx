// src/components/PaginationControls.tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react' // Gunakan icon library Anda

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
  currentStatus?: string
}

export default function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  currentStatus,
}: PaginationProps) {
  // Cegah render jika hanya ada 1 halaman (tidak ada yang perlu di-paginate)
  if (totalPages <= 1) return null

  const buildUrl = (targetPage: number | null | undefined) => {
    if (!targetPage) return '#'
    const params = new URLSearchParams()
    if (currentStatus) params.set('status', currentStatus)
    params.set('page', targetPage.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
      <div className="text-sm text-slate-500 font-medium">
        Halaman <span className="font-bold text-slate-800">{currentPage}</span> dari{' '}
        <span className="font-bold text-slate-800">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        {hasPrevPage ? (
          <Link
            href={buildUrl(prevPage)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Link>
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
          <Link
            href={buildUrl(nextPage)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Link>
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
