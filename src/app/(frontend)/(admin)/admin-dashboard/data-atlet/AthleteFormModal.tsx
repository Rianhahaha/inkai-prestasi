// src/app/(frontend)/(admin)/data-atlet/AthleteFormModal.tsx
'use client'

import React, { useTransition, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { submitAthleteAction } from './actions'
import { Save, X } from 'lucide-react'
import { sabukOptions } from '@/lib/utils'

export default function AthleteFormModal({ initialData }: { initialData?: any | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isEdit = Boolean(initialData)

  const closeModal = () => {
    // Hapus parameter modal dari URL tanpa mengubah filter/halaman saat ini
    const params = new URLSearchParams(searchParams.toString())
    params.delete('action')
    params.delete('id')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await submitAthleteAction(null, formData)
      if (res.success) {
        closeModal()
      } else {
        // setErrorMsg(res.error)
      }
    })
  }

  // Format default date untuk input type="date"
  const defaultDate = initialData?.tanggalLahir
    ? new Date(initialData.tanggalLahir).toISOString().split('T')[0]
    : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Edit Data Atlet' : 'Tambah Atlet Baru'}
          </h3>
          <button
            onClick={closeModal}
            disabled={isPending}
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 overflow-y-auto">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Hidden ID Field untuk mode edit */}
          {isEdit && <input type="hidden" name="id" value={initialData.id} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="namaLengkap"
                required
                defaultValue={initialData?.namaLengkap}
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                defaultValue={initialData?.email}
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password{' '}
                {isEdit && (
                  <span className="text-xs text-slate-400 font-normal">
                    (Abaikan jika tidak diubah)
                  </span>
                )}
              </label>
              <input
                type="password"
                name="password"
                required={!isEdit}
                disabled={isEdit}
                placeholder={isEdit ? '********' : 'Minimal 6 karakter'}
                className={`w-full border p-3 rounded-lg text-sm outline-none ${isEdit ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                name="tempatLahir"
                defaultValue={initialData?.tempatLahir}
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                defaultValue={defaultDate}
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                name="nomorTelepon"
                defaultValue={initialData?.nomorTelepon}
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sabuk (Tingkatan)
              </label>
              <select
                name="sabuk"
                required
                defaultValue={initialData?.sabuk || ''}
                className="w-full border border-slate-300 bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              disabled={isPending}
              className="cursor-pointer px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold transition-colors text-sm disabled:opacity-50"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Data'}
              <Save className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
