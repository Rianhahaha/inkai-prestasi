// src/app/(frontend)/components/TableFilter.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export type FilterOption = {
  label: string
  value: string
}

export type FilterConfig = {
  key: string
  placeholder: string
  options: FilterOption[]
}

interface TableFilterProps {
  filters: FilterConfig[]
}

export default function TableFilter({ filters }: TableFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State untuk melacak dropdown mana yang sedang terbuka
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Event Listener: Tutup dropdown jika user klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Logika Multi-Select Toggle
  const handleFilterToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentParams = params.get(key)
    const currentValues = currentParams ? currentParams.split(',') : []

    let newValues: string[]

    // Jika value sudah ada, hapus dari array. Jika belum, tambahkan.
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value)
    } else {
      newValues = [...currentValues, value]
    }

    if (newValues.length > 0) {
      params.set(key, newValues.join(',')) // Gabung jadi string: "Juara 1,Juara 2"
    } else {
      params.delete(key)
    }

    params.set('page', '1') // Reset paginasi
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Logika Reset individual filter
  const handleResetFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }
  const handleResetFilterAll = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Iterate through all active filter schemas and delete their keys from URL
    filters.forEach((filter) => {
      params.delete(filter.key)
    })

    // Reset pagination state to prevent blank table views
    params.set('page', '1')

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (!filters || filters.length === 0) return null
  const hasActiveFilters = filters.some((filter) => searchParams.has(filter.key))
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 w-full lg:w-auto" ref={dropdownRef}>
      {hasActiveFilters && (
        <button
          onClick={handleResetFilterAll}
          className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-2.5 transition-colors"
        >
          Reset Semua Filter
        </button>
      )}
      {filters.map((filter) => {
        const currentParams = searchParams.get(filter.key)
        const selectedValues = currentParams ? currentParams.split(',') : []
        const isOpen = openDropdown === filter.key

        return (
          <div key={filter.key} className="relative">
            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setOpenDropdown(isOpen ? null : filter.key)}
              className={`cursor-pointer w-full sm:w-auto min-w-[170px] flex items-center justify-between border text-sm rounded-lg px-3 py-2.5 transition-colors focus:ring-2 focus:ring-blue-500 outline-none ${
                selectedValues.length > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate mr-2 font-medium">
                {selectedValues.length > 0
                  ? `${filter.placeholder} (${selectedValues.length})`
                  : filter.placeholder}
              </span>
              <span className="text-[10px] text-slate-400 opacity-70">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-10 mt-1.5 w-full sm:min-w-[220px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-60 overflow-y-auto">
                  {filter.options.map((opt) => {
                    const isSelected = selectedValues.includes(opt.value)
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="mr-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleFilterToggle(filter.key, opt.value)}
                        />
                        {opt.label}
                      </label>
                    )
                  })}
                </div>

                {/* Action Area: Muncul jika ada yang dipilih */}
                {selectedValues.length > 0 && (
                  <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-2">
                    <button
                      onClick={() => handleResetFilter(filter.key)}
                      className="cursor-pointer w-full text-left px-2 py-1.5 text-[13px] text-red-600 hover:bg-red-100 rounded-md font-semibold transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg leading-none">&times;</span>
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
