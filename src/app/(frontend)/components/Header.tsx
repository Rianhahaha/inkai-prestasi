import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { LayoutDashboard, LogIn } from 'lucide-react'

export default async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Area */}
          <div className="flex items-center gap-10">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="size-12  flex items-center justify-center text-white font-bold text-xl">
                <Image
                  className="size-full"
                  src={'/images/logo.png'}
                  alt=""
                  height={50}
                  width={50}
                />
              </div>
              {/* <span className="font-bold text-xl text-slate-800">INKAI UNY</span> */}
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex gap-8">
              <Link href="/" className="text-blue-600 font-normal transition-all  ">
                Beranda
              </Link>
              <Link
                href="/tentang"
                className="text-slate-600 hover:text-blue-600 font-normal transition-all "
              >
                Tentang
              </Link>
              <Link
                href="/kegiatan"
                className="text-slate-600 hover:text-blue-600 font-normal transition-all "
              >
                Kegiatan
              </Link>
              <Link
                href="/atlet"
                className="text-slate-600 hover:text-blue-600 font-normal transition-all "
              >
                Atlet
              </Link>
              <Link
                href="/leaderboard"
                className="text-slate-600 hover:text-blue-600 font-normal transition-all "
              >
                Leaderboard
              </Link>
            </nav>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 flex gap-3 py-2.5 rounded-lg font-semibold transition-colors"
            >
              {user ? 'Dashboard' : 'Daftar Sekarang'}
              {user ? <LayoutDashboard /> : <LogIn />}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
