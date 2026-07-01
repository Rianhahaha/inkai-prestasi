import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { User2, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Key, CheckCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import Image from 'next/image'

export default async function ProfilPage() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()

  // Intercept the current active session directly from the server
  const user = await getCurrentUser()

  if (!user) return null

  console.log(user)

  const providers = user?.authProvider || ['local']
  const currentProviders =
    user?.authProvider && user.authProvider.length > 0 ? user.authProvider : ['local']
  const isGoogleLinked = currentProviders.includes('google')
  const isLocalLinked = currentProviders.includes('local')

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
              <Image
                width={100}
                height={100}
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* {user.fotoProfil?.url ? (
              ) : (
                <User2 className="w-10 h-10 text-slate-400" />
                )} */}
              {/* <User2 className="w-10 h-10 text-slate-400" /> */}
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
        <div className="p-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Autentikasi & Keamanan</h3>
            <div className="flex flex-col gap-4">
              {/* Local Auth Status */}
              <div className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isLocalLinked ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}
                  >
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Password Lokal</div>
                    <div className="text-xs text-slate-500">
                      Akses login menggunakan kombinasi email dan password.
                    </div>
                  </div>
                </div>
                <div>
                  {isLocalLinked ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" /> Aktif
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-md">
                      Tidak Aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Google Auth Status */}
              <div className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isGoogleLinked ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'}`}
                  >
                    {/* Native SVG untuk logo "G" Google agar tidak perlu library tambahan */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Google OAuth</div>
                    <div className="text-xs text-slate-500">
                      Tautkan akun Google Anda untuk login cepat (SSO).
                    </div>
                  </div>
                </div>
                <div>
                  {isGoogleLinked ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" /> Terhubung
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-md">
                      Belum Terhubung
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
