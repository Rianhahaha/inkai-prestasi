import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { User2, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function ProfilPage() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()

  // Intercept the current active session directly from the server
  const { user } = await payload.auth({ headers })

  if (!user) return null

  // Reusable component for the read-only input fields
  const ReadOnlyField = ({
    label,
    value,
    type = 'text',
  }: {
    label: string
    value: string | undefined | null
    type?: string
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-500">{label}</label>
      <input
        type={type}
        disabled
        value={value || '-'}
        className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-lg text-sm text-slate-700 outline-none cursor-not-allowed"
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header Section */}
      <div>
        <h1 className="font-bold text-[28px] text-slate-800">Profil Saya</h1>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Profile Identity Top Section */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
              {/* {user.fotoProfil?.url ? (
                <img 
                  src={user.fotoProfil.url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2 className="w-10 h-10 text-slate-400" />
                )} */}
              <User2 className="w-10 h-10 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-slate-800">{user.namaLengkap}</h2>
              <span className="text-slate-500 font-medium">Sabuk {user.sabuk}</span>
            </div>
          </div>

          <Link
            href="/profil/edit" // Target route for the mutation form
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm shrink-0"
          >
            Edit Profil
            <Edit className="w-4 h-4" />
          </Link>
        </div>

        {/* Data Form Section (Read Only) */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="md:col-span-2">
              <ReadOnlyField label="Nama Lengkap" value={user.namaLengkap} />
            </div>

            <div className="col-span-1">
              <ReadOnlyField label="Tempat Lahir" value={user.tempatLahir} />
            </div>

            <div className="col-span-1">
              <ReadOnlyField
                label="Tanggal Lahir"
                value={user.tanggalLahir ? formatDate(user.tanggalLahir) : undefined}
              />
            </div>

            <div className="md:col-span-2">
              <ReadOnlyField label="Email" value={user.email} />
            </div>

            <div className="md:col-span-2">
              {/* Dummy password display to match UI mockup */}
              <ReadOnlyField label="Password" value="••••••••••••" type="password" />
            </div>

            <div className="col-span-1">
              <ReadOnlyField label="Nomor Telepon" value={user.nomorTelepon} />
            </div>

            <div className="col-span-1">
              <ReadOnlyField label="Sabuk" value={user.sabuk} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
