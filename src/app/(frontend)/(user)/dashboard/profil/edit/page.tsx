// src/app/(user)/profil/edit/page.tsx
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import EditProfileForm from './EditProfileForm'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function EditProfilPage() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()

  // 1. Dapatkan Sesi
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Ambil data paling mutakhir langsung dari Database (bukan dari cache session)
  // Ini mencegah bug form kosong jika session token kadaluarsa secara parsial
  const latestUserData = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 0,
  })
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

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="font-bold text-[28px] text-slate-800">Edit Profil</h1>
        <p className="text-slate-500 mt-1">Perbarui informasi personal Anda.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Injeksi data server ke komponen klien */}
        <EditProfileForm user={latestUserData} initialAvatarUrl={avatarUrl} />
      </div>
    </div>
  )
}
