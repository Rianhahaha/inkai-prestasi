// src/app/(user)/prestasi/page.tsx
import React from 'react'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'

// Import Presenter Component
import AchievementTableClient from './AchievementTableClient'
import { AthleteStatsGrid } from '../../components/AthleteStatsGrid'
type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function PrestasiSayaPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 10
  const searchTerm = resolvedParams.search || ''

  const queryWhere: any = {
    and: [{ role: { equals: 'athlete' } }],
  }

  if (searchTerm) {
    queryWhere.or = [{ namaLengkap: { contains: searchTerm } }, { email: { contains: searchTerm } }]
  }

  if (!user) return null

  // 1. Fetching securely at Server Level
  const myAchievements = await payload.find({
    collection: 'achievements',
    where: {
      atlet: { equals: user.id },
    },
    sort: '-createdAt',
    depth: 0,
  })

  const [approvedCount] = await Promise.all([
    payload.count({
      collection: 'achievements',
      where: {
        and: [{ atlet: { equals: user.id }, status: { equals: 'approved' } }],
      },
    }),
  ])

  const serializedDocs = myAchievements.docs.map((doc: any) => ({
    ...doc,
    tanggalFormatted: new Date(doc.tanggalKejuaraan).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta', // Paksa Node.js menggunakan zona waktu WIB
    }),
  }))

  return (
    <div className="flex flex-col gap-6 card-outline bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Prestasi Saya</h1>
        </div>
        <Link
          href="/dashboard/prestasi/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
        >
          <span>+</span> Ajukan Prestasi
        </Link>
      </div>
      <AthleteStatsGrid
        totalPoin={user?.totalPoin || 0}
        totalPrestasi={approvedCount.totalDocs || 0}
        sabuk={user?.sabuk || 'Putih'}
      />

      {/* 2. Inject Data to Client Component */}
      <AchievementTableClient initialData={serializedDocs} />
    </div>
  )
}
