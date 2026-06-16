import Link from 'next/link'
import React, { ElementType } from 'react'

interface StatCardProps {
  count: number | string
  label: string
  icon: ElementType
  theme: 'yellow' | 'green' | 'red'
  isActive?: boolean
  href: string // [!] Ubah onClick menjadi href
}

export default function StatCard({
  count,
  label,
  icon: Icon,
  theme,
  isActive,
  href,
}: StatCardProps) {
  // Dictionary pattern untuk mapping kelas Tailwind secara absolut
  const themeStyles = {
    yellow: {
      bg: 'bg-yellow-500/20',
      iconText: 'text-yellow-500',
      borderFocus: 'border-yellow-300 shadow-yellow-300/50 text-yellow-500',
      hover: 'hover:border-yellow-300 hover:shadow-yellow-300/50 group-hover:text-yellow-500',
    },
    green: {
      bg: 'bg-green-500/20',
      iconText: 'text-green-500',
      borderFocus: 'border-green-300 shadow-green-300/50 text-green-500',
      hover: 'hover:border-green-300 hover:shadow-green-300/50 group-hover:text-green-500',
    },
    red: {
      bg: 'bg-red-500/20',
      iconText: 'text-red-500',
      borderFocus: 'border-red-300 shadow-red-300/50 text-red-500',
      hover: 'hover:border-red-300 hover:shadow-red-300/50 group-hover:text-red-500',
    },
  }

  const currentTheme = themeStyles[theme]

  return (
    <Link
      href={href}
      className={`card-outline flex gap-5 items-stretch cursor-pointer group transition-all duration-200 
        hover:shadow-lg ${currentTheme.hover} 
        ${isActive ? `shadow-lg border-2 ${currentTheme.borderFocus}` : 'border-transparent'}
      `}
    >
      <div
        className={`${currentTheme.bg} ${currentTheme.iconText} p-4 rounded-full flex items-center justify-center transition-colors`}
      >
        <Icon className="size-10" />
      </div>
      <div className="flex flex-col justify-between text-[20px] text-left">
        <div>
          <span
            className={`font-bold text-[32px] transition-colors ${isActive ? currentTheme.iconText : ''} ${currentTheme.hover}`}
          >
            {count}
          </span>
        </div>
        <span className="text-[15px] text-slate-500 font-medium">{label}</span>
      </div>
    </Link>
  )
}
