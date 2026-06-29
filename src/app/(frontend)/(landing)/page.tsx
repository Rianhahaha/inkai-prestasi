import React from 'react'
import Link from 'next/link'

import '@/app/globals.css'
import { ArrowRight, ImageIcon, User2 } from 'lucide-react'
import { getKontenData, getLeaderboardData, getPengurusList } from '@/app/api/getPayloadData'
import Podium from '../components/Podium'
import { getBeltColor } from '@/lib/utils'
import KontenCard from '../components/KontenCard'
export default async function LandingPage() {
  const pengurus = await getPengurusList()
  console.log('Pengurus :', pengurus)

  const { top3, tableDocs } = await getLeaderboardData({
    limit: 5,
  })
  const { docs: kontenDocs } = await getKontenData({
    limit: 0,
  })
  // console.log(event)
  return (
    <>
      <main className="grow">
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
            {/* <div className="min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
              [ Komponen Kegiatan Disini ]
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {kontenDocs.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                  <p>Tidak ada konten yang ditemukan.</p>
                </div>
              ) : (
                kontenDocs.map((item: any) => <KontenCard key={item.id} item={item} />)
              )}
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
            <Podium top3={top3} />
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200">
                        <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center w-24">
                          Rank
                        </th>
                        <th className="py-4 px-6 font-bold text-slate-700 text-sm">Nama Atlet</th>
                        <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                          Sabuk
                        </th>
                        <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                          Total Poin
                        </th>
                        <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">
                          Medali
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableDocs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            Tidak ada data atlet yang ditemukan.
                          </td>
                        </tr>
                      ) : (
                        tableDocs.map((doc: any, index: number) => {
                          const absoluteRank = doc.absoluteRank

                          // Indikator Warna Rank (Hanya untuk Top 3)
                          let rankColor = 'text-slate-700 font-bold'
                          let rankBg = 'bg-transparent'
                          if (absoluteRank === 1) {
                            rankColor = 'text-white font-bold'
                            rankBg = 'bg-amber-400'
                          } else if (absoluteRank === 2) {
                            rankColor = 'text-white font-bold'
                            rankBg = 'bg-slate-300'
                          } else if (absoluteRank === 3) {
                            rankColor = 'text-white font-bold'
                            rankBg = 'bg-orange-400'
                          }

                          return (
                            <tr
                              key={doc.id}
                              className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="py-4 px-6 text-center">
                                <div
                                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${rankBg} ${rankColor}`}
                                >
                                  {absoluteRank}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {doc.fotoProfil?.url ? (
                                      <img
                                        src={doc.fotoProfil.url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User2 className="w-5 h-5 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="font-bold text-slate-800 text-sm">
                                    {doc.namaLengkap}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center flex justify-center">
                                <span
                                  className={`px-4 py-1 rounded-md text-xs font-bold border ${getBeltColor(doc.sabuk)}`}
                                >
                                  {doc.sabuk || 'Belum Diatur'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className="text-sm font-medium text-slate-700">
                                  {doc.totalPoin || 0}{' '}
                                  <span className="text-slate-400 font-normal">poin</span>
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center text-sm font-medium text-slate-700">
                                0{' '}
                                {/* Ganti dengan doc.totalMedali jika field-nya sudah Anda buat nanti */}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PENGURUS ORGANISASI SECTION */}
        <section className="py-24 px-6 bg-white w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-12">Pengurus Organisasi</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Dummy Template Card - Rendered 4 times for visual parity */}
              {pengurus.map((item, index) => (
                <div key={index} className="flex flex-col items-center group cursor-pointer">
                  {/* Image Wrapper */}
                  <div className="relative w-[300px] h-[350px] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={item?.foto.url}
                      alt="Pengurus"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Gradient Overlay at bottom for text readability if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#98C3FF] to-transparent"></div>

                    {/* Name/Role Overlay inside image wrapper based on mockup */}
                    <div className="absolute bottom-4 left-0 w-full text-center px-2 z-50">
                      <p className="text-white text-sm font-semibold">{item?.jabatan}</p>
                      <h3 className="font-bold text-white text-lg">{item?.nama}</h3>
                      <p className="text-white text-sm">{item?.jurusan}</p>
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
