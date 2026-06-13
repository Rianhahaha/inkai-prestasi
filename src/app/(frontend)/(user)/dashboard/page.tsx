// src/app/(user)/dashboard/page.tsx
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Calendar, Clock, LocationEdit } from 'lucide-react'
import Image from 'next/image'
import { AthleteStatsGrid } from '../components/AthleteStatsGrid'

export default async function DashboardPage() {
  // 1. Initialize Local API
  const payload = await getPayload({ config })
  const headers = await getHeaders()

  // 2. Fetch authenticated user data directly from DB
  // Validasi eksistensi sesi sudah ditangani secara absolut oleh Layout security gate
  const { user } = await payload.auth({ headers })

  // 3. Prop Drilling to Presentation Layer
  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <div className="bg-blue-500 rounded-2xl p-8 text-white shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
          👩‍💼 {/* Placeholder Avatar */}
        </div>
        <div>
          <h1 className="text-xl opacity-90">Halo,</h1>
          <h2 className="text-3xl font-bold">{user?.namaLengkap || 'Atlet'}!</h2>
        </div>
      </div>

      {/* Stats Grid */}
      <AthleteStatsGrid
        totalPoin={user?.totalPoin || 0}
        totalPrestasi={0}
        sabuk={user?.sabuk || 'Putih'}
      />

      {/* Other Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[20rem]">
        {/* Jadwal Latihan */}
        <div className="card-outline">
          <div className="card-title border-b border-slate-200 pb-5">Jadwal Latihan</div>
          <div className="flex gap-5 justify-between items-center">
            <div className="size-12 flex items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
              <Calendar />
            </div>
            <div className="flex flex-col gap-2 text-sm flex-1">
              <div className="font-bold">Rabu</div>
              <div className="flex gap-2 items-start">
                <Clock className="w-5" />
                <div>15.30 - 17.30 WIB</div>
              </div>
            </div>
            <div className="bg-blue-500/20 text-blue-500 px-8 py-2 rounded-xl font-bold">
              Latihan Rutin
            </div>
          </div>
        </div>
        {/* Events */}

        <div className="card-outline">
          <div className="card-title">Events</div>
          <div className="w-full h-auto bg-blue-500/20 rounded-xl p-6 flex justify-start items-stretch gap-6">
            <div className="max-w-[12rem] max-h-[12rem] w-full rounded-xl  h-full flex items-center justify-center overflow-hidden">
              <img
                src={
                  'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U'
                }
                alt="image"
                // height={200}
                // width={200}
                className="size-full    object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="card-title">Sebelas Maret CUP XII 2026</div>
              <div className="flex flex-col justify-between h-full gap-5">
                <div className="flex flex-col ">
                  <div className="flex gap-2 items-start">
                    <Clock className="w-5" />
                    <div>15.30 - 17.30 WIB</div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <LocationEdit className="w-5" />
                    <div>GOR Universitas Sebelas Maret</div>
                  </div>
                </div>
                <button className="bg-blue-500 px-8 py-3 rounded-xl text-white font-bold order-last">
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
