// src/app/(user)/prestasi/tambah/page.tsx
'use client'

import React, { useActionState } from 'react'
import Link from 'next/navigation' // Jika ingin menggunakan navigasi balik kustom
import { submitPrestasi } from '@/app/(frontend)/(user)/dashboard/prestasi/action'

export default function PengajuanPrestasiPage() {
  const [state, formAction, isPending] = useActionState(submitPrestasi, null)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a href="/dashboard/prestasi" className="hover:text-blue-600 transition-colors">
          Prestasi Saya
        </a>
        <span>/</span>
        <span className="text-slate-800 font-medium">Tambah Prestasi</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Ajukan Prestasi Baru</h2>

        {state?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-medium">
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kejuaraan</label>
            <input
              type="text"
              name="namaKejuaraan"
              required
              className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kategori (Kelas)
              </label>
              <input
                type="text"
                name="kategori"
                required
                placeholder="Cth: Kumite -60kg Putra"
                className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal Kejuaraan
              </label>
              <input
                type="date"
                name="tanggalKejuaraan"
                required
                className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Jenis Kejuaraan</label>
              <select
                name="jenisKejuaraan"
                required
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Jenis Kejuaraan...</option>
                <option value="Open">Open</option>
                <option value="Festival">Festival</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Peringkat</label>
              <select
                name="peringkat"
                required
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Peringkat...</option>
                <option value="Juara 1">Juara 1</option>
                <option value="Juara 2">Juara 2</option>
                <option value="Juara 3">Juara 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tingkat Kejuaraan
              </label>
              <select
                name="tingkatKejuaraan"
                required
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Tingkat...</option>
                <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lokasi Kejuaraan
            </label>
            <input
              type="text"
              name="lokasiKejuaraan"
              className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sertifikat (PDF/JPG/PNG)
            </label>
            <input
              type="file"
              name="sertifikat"
              accept=".pdf, image/png, image/jpeg"
              required
              className="w-full border border-slate-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors"
            >
              {isPending ? 'Mengunggah Data...' : 'Kirim Pengajuan'}
            </button>
            <a
              href="/dashboard/prestasi"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-center font-medium"
            >
              Batal
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
