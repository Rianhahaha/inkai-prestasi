// src/app/layout.tsx
import React from 'react'
import '@/app/globals.css' // Pindahkan import Tailwind ke sini agar bersifat global

export const metadata = {
  title: 'UKM Karate INKAI',
  description: 'Sistem Manajemen Pengajuan Prestasi',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased  text-slate-900">
        {/* Seluruh page.tsx, termasuk /login dan route groups, akan dirender di dalam children ini */}
        {children}
      </body>
    </html>
  )
}
