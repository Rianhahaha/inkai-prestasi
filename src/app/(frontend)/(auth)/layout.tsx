// src/app/layout.tsx
import React from 'react'
import '@/app/globals.css' // Pindahkan import Tailwind ke sini agar bersifat global
import { GoogleOAuthProvider } from '@react-oauth/google'
import Image from 'next/image'

export const metadata = {
  title: 'UKM Karate INKAI',
  description: 'Sistem Manajemen Pengajuan Prestasi',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  console.log('[DEBUG] Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
  return (
    <html lang="id">
      <body className="antialiased  text-slate-900">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <div className="h-screen w-screen flex overflow-hidden">
            <div className="w-full h-full md:w-1/2 p-10 bg-linear-to-b from-blue-500 to-white flex justify-center relative overflow-hidden">
              <h1 className="text-[36px] font-semibold  text-white z-20">
                Selamat datang di UKM Karate “INKAI” Universitas Negeri Yogyakarta
              </h1>
              <Image
                className="w-[25rem] absolute bottom-5 opacity-20 left-[10%] z-0"
                src={'/images/logo.png'}
                alt="logo"
                width={200}
                height={200}
                loading="eager"
              />
            </div>
            <div className="w-full min-h-screen md:w-1/2 px-[10rem] py-10 bg-white flex justify-center items-start overflow-y-auto">
              <div className="w-full h-auto max-w-[38rem] shadow-2xl p-10 border border-black/10 rounded-2xl">
                {children}
              </div>
            </div>
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
