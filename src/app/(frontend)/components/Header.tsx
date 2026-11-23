import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users } from 'lucide-react'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="sticky top-0 z-[9999999] w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Area */}
          <div className="flex items-center gap-10">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="size-12 flex items-center justify-center text-white font-bold text-xl">
                <Image
                  className="size-full"
                  src={'/images/logo.png'}
                  alt="INKAI UNY Logo"
                  height={50}
                  width={50}
                  priority
                />
              </div>
            </div>

            {/* Client Navigation */}
            <Navigation />
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/atlet"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 flex gap-3 py-2.5 rounded-lg font-semibold transition-colors"
            >
              Lihat Atlet
              <Users />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}