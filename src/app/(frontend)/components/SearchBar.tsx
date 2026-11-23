// src/app/(frontend)/components/SearchBar.tsx
'use client'

import { Search } from 'lucide-react'
import { useRef } from 'react'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export default function SearchBar({ 
  placeholder = 'Cari...', 
  value = '', 
  onChange 
}: SearchBarProps) {
  // Menggunakan useRef untuk menyimpan ID timer debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (term: string) => {
    // Bersihkan timer sebelumnya jika user masih mengetik
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Eksekusi pembaruan setelah user berhenti mengetik selama 300ms
    timeoutRef.current = setTimeout(() => {
      onChange?.(term)
    }, 300)
  }

  return (
    <div className="relative flex flex-1 w-full bg-white">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}