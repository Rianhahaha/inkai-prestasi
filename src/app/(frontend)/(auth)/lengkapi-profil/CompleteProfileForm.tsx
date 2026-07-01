// src/app/lengkapi-profil/CompleteProfileForm.tsx
'use client'

import React, { useTransition, useState, useRef } from 'react'
import { completeProfileAction } from './actions'
import { UserCheck, ShieldAlert, Camera } from 'lucide-react'
import { sabukOptions } from '@/lib/utils'
import Image from 'next/image'

export default function CompleteProfileForm({ initialAvatarUrl }: { initialAvatarUrl: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // State untuk Preview Gambar Lokal
  const [previewUrl, setPreviewUrl] = useState<string>(initialAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await completeProfileAction(null, formData)
      if (res.success) {
        window.location.href = '/dashboard'
      } else {
        setError(res.error || 'Terjadi kesalahan.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-xl">
          {error}
        </div>
      )}

      {/* Komponen Preview & Upload Avatar */}
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

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
        <p>
          Selamat datang! Akun Google Anda berhasil terverifikasi. Silakan lengkapi data atlet Anda
          di bawah ini untuk mengaktifkan fitur pengajuan prestasi.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
          <input
            type="text"
            name="tempatLahir"
            required
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            required
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
          <input
            type="tel"
            name="nomorTelepon"
            required
            placeholder="08xxxxxxxxxx"
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Sabuk (Tingkatan)</label>
          <select
            name="sabuk"
            required
            defaultValue=""
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="jenisKelamin"
              value="Laki-laki"
              required
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            Laki-laki
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="jenisKelamin"
              value="Perempuan"
              required
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            Perempuan
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-2">
        <label className="block text-sm font-bold text-slate-800 mb-1">
          Buat Password Lokal (Opsional)
        </label>
        <p className="text-xs text-slate-400 mb-3">
          Isi jika Anda ingin mengaktifkan login konvensional sebagai jalur cadangan selain Google.
        </p>
        <input
          type="password"
          name="password"
          placeholder="Minimal 6 karakter"
          className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? 'Menyimpan...' : 'Simpan & Masuk ke Dashboard'}
        <UserCheck className="w-4 h-4" />
      </button>
    </form>
  )
}
