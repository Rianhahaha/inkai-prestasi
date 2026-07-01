// src/app/(user)/components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Trophy, Medal, User, LogOut } from 'lucide-react'
import { logoutAction } from '../../(auth)/actions'
import { useRef, useState } from 'react'
import { ConfirmationDialog } from '@/app/(frontend)/components/ConfirmationDialog'

export function Sidebar() {
  const pathname = usePathname()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null) // Ref untuk form logout

  const navItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Verifikasi Prestasi', path: '/admin-dashboard/verifikasi-prestasi', icon: Trophy },
    { name: 'Kelola Konten', path: '/admin-dashboard/konten', icon: Medal },
    { name: 'Data Atlet', path: '/admin-dashboard/data-atlet', icon: User },
  ]

  return (
    <>
      <aside className="w-64 bg-blue-500 text-white flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="p-6 flex items-center gap-3">
            {/* Placeholder Logo */}
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              🥋
            </div>
            <div className="text-sm font-semibold leading-tight">
              UKM Karate "INKAI"
              <br />
              Universitas Negeri Yogyakarta
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-2 px-4">
            {navItems.map((item) => {
              const isActive =
                item.path === '/admin-dashboard'
                  ? pathname === item.path
                  : pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4">
          {/* Form tersembunyi agar bisa di-trigger programmatically */}
          <form action={logoutAction} ref={formRef} className="hidden">
            <button type="submit" />
          </form>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="cursor-pointer flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500 hover:text-white transition-colors text-left"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      <ConfirmationDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => formRef.current?.requestSubmit()} // Trigger form submit
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi? Sesi Anda akan berakhir."
        confirmText="Ya, Logout"
      />
    </>
  )
}
