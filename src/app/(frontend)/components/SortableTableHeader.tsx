'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { useCallback } from 'react'

export type SortDirection = 'asc' | 'desc'

interface SortableTableHeaderProps {
  label: string
  sortKey: string
  className?: string
  align?: 'left' | 'center'
}

export default function SortableTableHeader({
  label,
  sortKey,
  align = 'left',
  className = '',
}: SortableTableHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort')
  const currentDir = searchParams.get('dir') as SortDirection | null
  const isActive = currentSort === sortKey

  const handleSort = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Determine next direction: idle → asc → desc → idle
    if (!isActive) {
      params.set('sort', sortKey)
      params.set('dir', 'asc')
    } else if (currentDir === 'asc') {
      params.set('dir', 'desc')
    } else {
      // Reset ke idle
      params.delete('sort')
      params.delete('dir')
    }

    // Reset page ke 1 saat sort berubah
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, isActive, currentDir, sortKey, pathname, router])

  const Icon = !isActive ? ChevronsUpDown : currentDir === 'asc' ? ChevronUp : ChevronDown

  return (
    <th
      className={`${align === 'center' ? 'flex justify-center' : ''} py-4 px-6 font-bold text-slate-700 text-sm select-none ${className}`}
    >
      <button
        onClick={handleSort}
        className="cursor-pointer flex items-center gap-1.5 hover:text-slate-900 transition-colors group"
      >
        {label}
        <Icon
          className={`w-3.5 h-3.5 transition-colors ${
            isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'
          }`}
        />
      </button>
    </th>
  )
}
