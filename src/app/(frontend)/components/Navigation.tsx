'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Kegiatan', path: '/kegiatan' },
    { name: 'Atlet', path: '/atlet' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ]

  return (
    <nav className="hidden md:flex gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.path

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`font-normal transition-all ${
              isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
