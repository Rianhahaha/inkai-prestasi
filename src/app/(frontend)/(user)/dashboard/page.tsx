// src/app/(user)/dashboard/page.tsx
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Calendar, Clock, LocationEdit } from 'lucide-react'
import Image from 'next/image'
import { AthleteStatsGrid } from '../components/AthleteStatsGrid'
import { getCurrentUser } from '@/lib/auth'
import { jadwalLatihan } from '@/lib/jadwal'
import { getKontenData } from '@/app/api/getPayloadData'
import { formatDate } from '@/lib/utils'
import EventCarousel from '../components/EventCarousel'

export default async function DashboardPage() {
  // 1. Initialize Local API
  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  if (!user) return null // Guard clause tambahan

  // Eksekusi count secara paralel menggunakan Promise.all untuk mencegah waterfall
  // Kompilator akan menerjemahkan ini menjadi SELECT COUNT(*) murni di PostgreSQL
  const [approvedCount] = await Promise.all([
    payload.count({
      collection: 'achievements',
      where: {
        and: [{ atlet: { equals: user.id }, status: { equals: 'approved' } }],
      },
    }),
  ])

  let avatarUrl = '/images/placeholder-avatar.png' // Ganti dengan path icon default Anda jika ada

  if (user.fotoProfil) {
    try {
      // Ambil dokumen media berdasarkan ID
      const mediaId = typeof user.fotoProfil === 'object' ? user.fotoProfil.id : user.fotoProfil
      const media = await payload.findByID({
        collection: 'media',
        id: mediaId as number | string,
      })
      if (media?.url) avatarUrl = media.url
    } catch (e) {
      console.error('[Media Fetch Error]', e)
    }
  }

  const konten = await getKontenData({
    limit: 5,
  })

  // 3. Prop Drilling to Presentation Layer
  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <div className="bg-blue-500 rounded-2xl p-8 text-white shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 p-2 bg-white/20 rounded-full flex items-center justify-center text-3xl">
          <img
            src={avatarUrl}
            alt={user?.namaLengkap || 'User Avatar'}
            className="size-full rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl opacity-90">Halo,</h1>
          <h2 className="text-3xl font-bold">{user?.namaLengkap || 'Atlet'}!</h2>
        </div>
      </div>

      {/* Stats Grid */}
      <AthleteStatsGrid
        totalPoin={user?.totalPoin || 0}
        totalPrestasi={approvedCount.totalDocs}
        sabuk={user?.sabuk || 'Putih'}
      />

      {/* Other Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[20rem]">
        {/* Jadwal Latihan */}
        <div className="card-outline">
          <div className="card-title border-b border-slate-200 pb-5">Jadwal Latihan</div>
          {jadwalLatihan.map((items, index) => (
            <div className="flex gap-5 justify-between items-center py-2 hover:bg-slate-100">
              <div className="size-12 flex items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
                <Calendar />
              </div>
              <div className="flex flex-col gap-2 text-sm flex-1">
                <div className="font-bold">{items.hari}</div>
                <div className="flex gap-2 items-center">
                  <Clock className="w-5" />
                  <span>{items.waktu} WIB</span>
                </div>
              </div>
              {/* <div className="bg-blue-500/20 text-blue-500 px-8 py-2 rounded-xl font-bold">
                Latihan Rutin
              </div> */}
            </div>
          ))}
        </div>
        {/* Events */}

        <div className="card-outline">
          <div className="card-title mb-4">Events</div>
          {konten?.docs?.length > 0 ? (
            <EventCarousel events={konten.docs} />
          ) : (
            <p className="text-slate-500 text-sm">Tidak ada event mendatang.</p>
          )}
        </div>
      </div>
    </div>
  )
}
