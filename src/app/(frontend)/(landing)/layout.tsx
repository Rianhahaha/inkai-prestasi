// src/app/layout.tsx
import React from 'react'
import '@/app/globals.css' // Pindahkan import Tailwind ke sini agar bersifat global
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased  text-slate-900" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />

          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
