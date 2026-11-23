import React from 'react'
import Link from 'next/link'

import '@/app/globals.css'
import { ArrowRight, ImageIcon, User2 } from 'lucide-react'
import { 
  getLeaderboard, 
  getPublishedKonten, 
  getAllPengurus,
  getPengurusInti 
} from '@/lib/static-data'
import Podium from '../components/Podium'
import { getBeltColor } from '@/lib/utils'
import KontenCard from '../components/KontenCard'
import Image from 'next/image'
import PengurusCarousel from './PengurusCarousel'

export default async function LandingPage() {
  const pengurus = await getAllPengurus()
  const pengurusInti = await getPengurusInti()
  
  const leaderboard = await getLeaderboard()
  const top3 = leaderboard.slice(0, 3).map(entry => entry.athlete)
  const tableDocs = leaderboard.slice(3, 10)

  const kontenDocs = await getPublishedKonten()

  return (
    <>
      <main className="grow">
        {/* HERO SECTION */}
        <section className="relative w-full h-screen flex items-center justify-center text-center px-6">
          {/* Background Wrapper */}
          <div className="absolute inset-0 z-0">
            <Image
              width={2000}
              height={2000}
              src={'/images/hero.png'}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 "></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              UKM Karate "INKAI"
              <br />
              Universitas Negeri Yogyakarta
            </h1>
            <p className="text-slate-200 text-lg md:text-xl max-w-2xl">
              Mengembangkan potensi diri, menjunjung tinggi karakter, dan mencetak prestasi bersama
              UKM Karate INKAI UNY
            </p>
            <Link
              href="/atlet"
              className="mt-4 bg-[#4285F4] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Lihat Atlet Kami
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
                <Image
                  width={2000}
                  height={2000}
                  src={'/images/tentang-1.png'}
                  alt="Tentang Kami 1"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <Link
                href="/tentang"
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
                UKM Karate INKAI UNY adalah organisasi seni bela diri yang berada di bawah naungan
                perguruan INKAI. Selain bagi mahasiswa, UKM Karate INKAI UNY juga membina amggota
                umum dari usia anak-anak hingga dewasa melalui lembaga olahraga Selabora UNY,
                menciptakan lingkungan latihan yang inklusif untuk pembentukan fisik, mental, dan
                pencapaian prestasi
              </p>
              <div className="relative bg-amber-200 w-full min-h-[250px]">
                <div className="absolute bottom-0 right-0 w-[calc(100%+150px)] h-full rounded-2xl overflow-hidden shadow-md">
                  <Image
                    width={2000}
                    height={2000}
                    src={'/images/tentang-2.png'}
                    alt="Tentang Kami 2"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEGIATAN & PROGRAM UNGGULAN */}
        <section id="kegiatan" className="py-24 px-6 bg-white w-full border-y border-slate-100">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-12">
              Kegiatan & Program Unggulan Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 text-left">
              {kontenDocs.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                  <p>Tidak ada konten yang ditemukan.</p>
                </div>
              ) : (
                kontenDocs.map((item: any) => <KontenCard key={item.id} item={item} />)
              )}
            </div>
            <div className="flex justify-center w-full">
              <Link
                href="/kegiatan"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 flex gap-3 py-2.5 rounded-lg font-semibold transition-colors w-fit mt-5"
              >
                Lihat Selengkapnya
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* LEADERBOARD */}
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
                        tableDocs.map((entry: any, index: number) => {
                          const absoluteRank = entry.rank

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
                              key={entry.athlete.id}
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
                                    {entry.athlete.fotoProfil ? (
                                      <img
                                        src={entry.athlete.fotoProfil}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User2 className="w-5 h-5 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="font-bold text-slate-800 text-sm">
                                    {entry.athlete.namaLengkap}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center flex justify-center">
                                <span
                                  className={`px-4 py-1 rounded-md text-xs font-bold border ${getBeltColor(entry.athlete.sabuk)}`}
                                >
                                  {entry.athlete.sabuk || 'Belum Diatur'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className="text-sm font-medium text-slate-700">
                                  {entry.poin || 0}{' '}
                                  <span className="text-slate-400 font-normal">poin</span>
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center text-sm font-medium text-slate-700">
                                {entry.athlete.achievements?.length || 0}{' '}
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
            <div className="flex justify-center w-full">
              <Link
                href="/leaderboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 flex gap-3 py-2.5 rounded-lg font-semibold transition-colors w-fit mt-5"
              >
                Lihat Leaderboard Lengkap
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* PENGURUS ORGANISASI SECTION */}
        <section className="py-24 px-6 bg-white w-full relative">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-12">Pengurus Organisasi</h2>

            <PengurusCarousel data={pengurus} />
          </div>
        </section>

        {/* CTA AYO BERGABUNG SECTION */}
        <section className="relative w-full py-24 flex items-center justify-center text-center px-6 mt-10">
          {/* Background Wrapper */}
          <div className="absolute inset-0 z-0">
            <Image
              width={2000}
              height={2000}
              src={'/images/ayo-bergabung.png'}
              alt="CTA Background"
              className="w-full h-full object-cover opacity-50"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#99C3FF]/60 "></div>
          </div>

          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-6 text-black">
            <h2 className="text-3xl md:text-4xl font-bold text-black">Ayo Bergabung Sekarang!</h2>
            <p className="text-lg">
              Jadilah bagian dari keluarga besar kami. Kembangkan potensi dirimu bersama UKM Karate
              INKAI UNY.
            </p>
            <Link
              href="/atlet"
              className="mt-4 bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 rounded-lg font-bold transition-all shadow-md"
            >
              Lihat Atlet Kami
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}