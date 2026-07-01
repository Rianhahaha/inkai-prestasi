// src/app/(user)/profil/edit/EditProfileForm.tsx
'use client'

import React, { useTransition, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '@/app/(frontend)/(user)/dashboard/profil/edit/action' // Pastikan nama import sesuai
import { Camera, Save } from 'lucide-react'
import { sabukOptions } from '@/lib/utils'
import Image from 'next/image'

export default function EditProfileForm({
  user,
  initialAvatarUrl,
}: {
  user: any
  initialAvatarUrl: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(initialAvatarUrl)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFeedback(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updateProfileAction(null, formData)

      if (res.success) {
        setFeedback({ type: 'success', msg: res.message! })
        setTimeout(() => router.push('/dashboard/profil'), 1500)
      } else {
        setFeedback({ type: 'error', msg: res.error! })
      }
    })
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran standar (opsional, misal max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB')
        return
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Reusable input component
  const InputField = ({ label, name, defaultValue, type = 'text', required = false }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue || ''}
        required={required}
        className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-xl">
          {error}
        </div>
      )}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-bold ${
            feedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}
        >
          {feedback.msg}
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        <div
          className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden group cursor-pointer bg-slate-100"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            width={100}
            height={100}
            src={previewUrl}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white w-6 h-6" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">Foto Profil</p>
          <p className="text-xs text-slate-400">Klik gambar untuk mengubah (Opsional)</p>
        </div>

        {/* Hidden Input File */}
        <input
          type="file"
          name="fotoProfilFile"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <InputField
            label="Nama Lengkap"
            name="namaLengkap"
            defaultValue={user.namaLengkap}
            required
          />
        </div>

        <div className="col-span-1">
          <InputField label="Tempat Lahir" name="tempatLahir" defaultValue={user.tempatLahir} />
        </div>

        <div className="col-span-1">
          <InputField
            label="Tanggal Lahir"
            name="tanggalLahir"
            type="date"
            defaultValue={
              user.tanggalLahir ? new Date(user.tanggalLahir).toISOString().split('T')[0] : ''
            }
          />
        </div>

        <div className="col-span-1">
          <InputField
            label="Nomor Telepon"
            name="nomorTelepon"
            type="tel"
            defaultValue={user.nomorTelepon}
          />
        </div>

        <div className="col-span-1">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Sabuk (Tingkatan)</label>
            <select
              name="sabuk"
              required
              defaultValue={user.sabuk || ''}
              className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="" disabled>
                Pilih Sabuk...
              </option>
              {sabukOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <InputField label="Email" name="email" type="email" defaultValue={user.email} required />
        </div>

        <div className="col-span-1">
          {/* Password is intentionally not required to allow selective patching */}
          <InputField
            label="Password Baru (Abaikan jika tidak diubah)"
            name="password"
            type="password"
            required={false}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold transition-colors text-sm disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          <Save className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}
