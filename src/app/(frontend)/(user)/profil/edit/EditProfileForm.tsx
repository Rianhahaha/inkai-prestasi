// src/app/(user)/profil/edit/EditProfileForm.tsx
'use client'

import React, { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from './action'
import { Save, ArrowLeft } from 'lucide-react'

export default function EditProfileForm({ user }: { user: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFeedback(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updateProfileAction(null, formData)

      if (res.success) {
        setFeedback({ type: 'success', msg: res.message! })
        // Beri jeda visual sedikit sebelum redirect kembali ke profil
        setTimeout(() => router.push('/profil'), 1500)
      } else {
        setFeedback({ type: 'error', msg: res.error! })
      }
    })
  }

  // Helper untuk form field yang konsisten
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

  const DisabledField = ({ label, value, note }: any) => (
    <div className="flex flex-col gap-2 opacity-70">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-500">{label}</label>
        {note && (
          <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
            {note}
          </span>
        )}
      </div>
      <input
        type="text"
        disabled
        value={value || '-'}
        className="w-full border border-slate-200 bg-slate-100 p-3 rounded-lg text-sm text-slate-500 cursor-not-allowed"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-bold ${
            feedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}
        >
          {feedback.msg}
        </div>
      )}

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
          {/* Input date Native yang ditranslasi ke ISO string saat disubmit */}
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
          <DisabledField label="Sabuk" value={user.sabuk} note="Hanya Admin" />
        </div>

        <div className="md:col-span-2">
          <DisabledField label="Email" value={user.email} note="Hubungi Admin untuk ubah" />
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
