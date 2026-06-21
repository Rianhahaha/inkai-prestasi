// src/app/(frontend)/components/SearchBar.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useRef } from 'react'

export default function SearchBar({ placeholder = 'Cari...' }: { placeholder?: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // Menggunakan useRef untuk menyimpan ID timer debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (term: string) => {
    // Bersihkan timer sebelumnya jika user masih mengetik
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Eksekusi pembaruan URL hanya setelah user berhenti mengetik selama 300ms
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      // Reset paginasi ke halaman 1 setiap kali melakukan pencarian baru
      params.set('page', '1')

      if (term) {
        params.set('search', term)
      } else {
        params.delete('search')
      }

      // Gunakan replace agar history browser tidak dipenuhi oleh setiap ketikan
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
  }

  return (
    <div className="relative flex flex-1 w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        // Sinkronisasi input dengan nilai URL saat ini (misal saat direfresh)
        defaultValue={searchParams.get('search')?.toString()}
      />
    </div>
  )
}
