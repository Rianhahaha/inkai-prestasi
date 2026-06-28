import React from 'react'
import Link from 'next/link'

import '@/app/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ArrowRight } from 'lucide-react'
export default function LandingPage() {
  return (
    <>
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full h-screen flex items-center justify-center text-center px-6">
          {/* Background Wrapper */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              UKM Karate "INKAI"
              <br />
              Universitas Negeri Yogyakarta
            </h1>
            <p className="text-slate-200 text-lg md:text-xl max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <Link
              href="/register"
              className="mt-4 bg-[#4285F4] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Gabung Sekarang
            </Link>
          </div>
        </section>

        {/* TENTANG KAMI SECTION */}
        <section id="tentang" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Image Wrapper 1 */}
              <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-md col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                  alt="Tentang Kami 1"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <Link
                href="/"
                className="text-blue-600 font-normal transition-all  flex gap-1 items-end hover:underline w-fit"
              >
                Lihat Selengkapnya
                <ArrowRight className="size-5" />
              </Link>
              {/* Image Wrapper 2 */}
            </div>

            {/* Right: Text Content */}
            <div className="flex flex-col gap-6  h-full">
              <h2 className="text-3xl font-bold text-blue-600">Tentang Kami</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur.
              </p>
              <div className="relative bg-amber-200 w-full min-h-[250px]">
                <div className="absolute bottom-0 right-0 w-[calc(100%+150px)] h-full rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                    alt="Tentang Kami 1"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEGIATAN & PROGRAM UNGGULAN (EMPTY SECTION) */}
        <section id="kegiatan" className="py-24 px-6 bg-white w-full border-y border-slate-100">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-12">
              Kegiatan & Program Unggulan Kami
            </h2>
            {/* Slot for Kegiatan Cards */}
            <div className="min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
              [ Komponen Kegiatan Disini ]
            </div>
          </div>
        </section>

        {/* LEADERBOARD (EMPTY SECTION) */}
        <section id="leaderboard" className="py-24 px-6 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-12">
              Leaderboard Atlet Berprestasi
            </h2>
            {/* Slot for Leaderboard Data */}
            <div className="min-h-[400px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
              [ Komponen Leaderboard Disini ]
            </div>
          </div>
        </section>

        {/* PENGURUS ORGANISASI SECTION */}
        <section className="py-24 px-6 bg-white w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-12">Pengurus Organisasi</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Dummy Template Card - Rendered 4 times for visual parity */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col items-center group cursor-pointer">
                  {/* Image Wrapper */}
                  <div className="relative w-[200px] h-[250px] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={`https://i.pravatar.cc/300?img=${item + 10}`}
                      alt="Pengurus"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Gradient Overlay at bottom for text readability if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/80 to-transparent"></div>

                    {/* Name/Role Overlay inside image wrapper based on mockup */}
                    <div className="absolute bottom-4 left-0 w-full text-center px-2">
                      <h3 className="font-bold text-white text-sm">Nama Pengurus</h3>
                      <p className="text-blue-200 text-xs">Jabatan Organisasi</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA AYO BERGABUNG SECTION */}
        <section className="relative w-full py-24 flex items-center justify-center text-center px-6 mt-10">
          {/* Background Wrapper */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop"
              alt="CTA Background"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
          </div>

          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ayo Bergabung Sekarang!</h2>
            <p className="text-blue-100 text-lg">
              Jadilah bagian dari keluarga besar kami. Kembangkan potensi dirimu bersama UKM Karate
              INKAI UNY.
            </p>
            <Link
              href="/register"
              className="mt-4 bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 rounded-lg font-bold transition-all shadow-md"
            >
              Gabung Sekarang
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
