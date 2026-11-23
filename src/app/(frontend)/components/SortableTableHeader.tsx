'use client'

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export type SortDirection = 'asc' | 'desc'

interface SortableTableHeaderProps {
  label: string
  sortKey: string
  className?: string
  align?: 'left' | 'center'
  sortConfig?: { key: string; direction: SortDirection } | null
  onSort?: (key: string) => void
}

export default function SortableTableHeader({
  label,
  sortKey,
  align = 'left',
  className = '',
  sortConfig,
  onSort,
}: SortableTableHeaderProps) {
  const isActive = sortConfig?.key === sortKey
  const currentDir = sortConfig?.direction || null

  const Icon = !isActive ? ChevronsUpDown : currentDir === 'asc' ? ChevronUp : ChevronDown

  return (
    <th
      className={`${align === 'center' ? 'flex justify-center' : ''} py-4 px-6 font-bold text-slate-700 text-sm select-none ${className}`}
    >
      <button
        onClick={() => onSort?.(sortKey)}
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