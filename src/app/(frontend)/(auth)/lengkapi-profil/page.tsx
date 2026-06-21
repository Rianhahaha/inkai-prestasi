// src/app/lengkapi-profil/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import CompleteProfileForm from './CompleteProfileForm'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function LengkapiProfilPage() {
  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const isProfileComplete = Boolean(user.sabuk && user.nomorTelepon && user.tanggalLahir)

  if (isProfileComplete) {
    redirect('/dashboard')
  }

  // Resolusi Media URL secara efisien
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white w-full max-w-xl overflow-hidden px-1">
        <h1 className="font-bold text-xl">Lengkapi Profil Atlet</h1>
        <p className="text-slate-400 text-xs my-2 mb-6">
          Satu langkah lagi sebelum mengaktifkan akun Anda.
        </p>

        {/* Pass URL ke komponen form */}
        <CompleteProfileForm initialAvatarUrl={avatarUrl} />
      </div>
    </div>
  )
}
