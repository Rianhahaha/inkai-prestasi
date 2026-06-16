// src/components/VerificationModal.tsx
'use client'

import React, { useState, useTransition } from 'react'
import { User2, FileText, Award, CheckCircle, CircleX, AlertTriangle } from 'lucide-react'

interface VerificationModalProps {
  doc: any
  status: string
  onClose: () => void
  onApprove: (id: string) => Promise<{ success: boolean; error?: string }>
  onReject: (id: string, reason: string) => Promise<{ success: boolean; error?: string }>
}

// 1. Point Reference Dictionary matching business rules
const pointMatrix: Record<string, Record<string, number>> = {
  Kecamatan: { 'Juara 1': 10, 'Juara 2': 8, 'Juara 3': 5 },
  'Kabupaten/Kota': { 'Juara 1': 20, 'Juara 2': 15, 'Juara 3': 10 },
  Provinsi: { 'Juara 1': 40, 'Juara 2': 30, 'Juara 3': 20 },
  Nasional: { 'Juara 1': 80, 'Juara 2': 60, 'Juara 3': 40 },
  Internasional: { 'Juara 1': 160, 'Juara 2': 120, 'Juara 3': 80 },
}

// Mapping for visual presentation to match the mockup design
const rankVisuals: Record<string, { label: string; color: string }> = {
  'Juara 1': { label: 'Emas', color: 'text-yellow-500' },
  'Juara 2': { label: 'Perak', color: 'text-slate-400' },
  'Juara 3': { label: 'Perunggu', color: 'text-orange-500' },
}

export default function DetailModal({ doc, onClose, onApprove, onReject }: VerificationModalProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Derive points based on current document configuration
  const currentTingkat = doc?.tingkatKejuaraan || 'Kecamatan'
  const calculatedPoints = pointMatrix[currentTingkat]?.[doc?.peringkat] || 0
  const currentTingkatMatrix = pointMatrix[currentTingkat] || {}

  const handleApprove = () => {
    setErrorMessage(null)
    startTransition(async () => {
      // Execute the approval Server Action mutation
      const res = await onApprove(doc.id)
      if (res.success) {
        onClose()
      } else {
        setErrorMessage(res.error || 'Failed to approve achievement.')
      }
    })
  }

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectReason.trim()) return

    setErrorMessage(null)
    startTransition(async () => {
      // Execute the rejection Server Action mutation with input rationale
      const res = await onReject(doc.id, rejectReason)
      if (res.success) {
        onClose()
      } else {
        setErrorMessage(res.error || 'Failed to reject achievement.')
      }
    })
  }

  console.log(doc)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-slate-800">Detail Pengajuan Prestasi</h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex flex-col gap-5 overflow-y-auto">
          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl">
              {errorMessage}
            </div>
          )}
          {/* Athlete Profile Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
              {doc.atlet?.fotoProfil?.url ? (
                <img
                  src={doc.atlet.fotoProfil.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2 className="w-7 h-7" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-lg text-slate-800">
                {doc.atlet?.namaLengkap || 'Nama Atlet'}
              </h4>
              <span
                className={`px-3 py-1 
               
              ${
                doc?.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : doc.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }

              text-xs font-semibold rounded-md w-fit`}
              >
                {doc?.status === 'approved'
                  ? 'Disetujui'
                  : doc.status === 'pending'
                    ? 'Menunggu'
                    : 'Ditolak'}
              </span>
            </div>
          </div>
          {/* Form Fields Stack */}
          <div className="flex flex-col gap-4">
            <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nama Kejuaraan
              </label>
              <div className="font-bold text-slate-800 text-sm leading-relaxed">
                {doc.namaKejuaraan}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kategori</label>
                <div className="font-bold text-slate-800 text-sm">{doc.kategori}</div>
              </div>
              <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Peringkat</label>
                <div className="font-bold text-slate-800 text-sm">
                  {doc.peringkat} / {rankVisuals[doc.peringkat]?.label}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tingkat Kejuaraan
                </label>
                <div className="font-bold text-slate-800 text-sm">{doc.tingkatKejuaraan}</div>
              </div>
              <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tanggal Kejuaraan
                </label>
                <div className="font-bold text-slate-800 text-sm">
                  {doc.tanggalFormatted || doc.tanggalKejuaraan}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Lokasi Kejuaraan
              </label>
              <div className="font-bold text-slate-800 text-sm leading-relaxed">
                {doc.lokasiKejuaraan || '-'}
              </div>
            </div>
          </div>
          {/* Document Section */}
          <div className="border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm text-slate-800 truncate max-w-[320px]">
                  {doc.sertifikat?.filename || 'sertifikat_prestasi.pdf'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Sertifikat Prestasi - PDF / Image
                </div>
              </div>
            </div>
            {doc.sertifikat?.url && (
              <a
                href={doc.sertifikat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blue-200 text-blue-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0"
              >
                Unduh
              </a>
            )}
          </div>
          {/* Point Computation Section */}
          <div className="border border-slate-200 rounded-xl">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Award className="w-4 h-4 text-orange-500" />
              Sistem Poin
            </div>
            <div className="p-5 bg-white text-sm grid grid-cols-2 gap-6">
              <div>
                <div className="text-slate-400 font-medium mb-1">Poin Prestasi</div>
                <div
                  className={`font-bold
                    
                  ${doc?.status === 'approved' ? 'text-blue-500' : 'text-slate-800'}

                   text-lg`}
                >
                  {doc?.status === 'approved' ? `+${calculatedPoints} Poin` : 'Belum dihitung'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {doc.tingkatKejuaraan} -{' '}
                  <span className="font-semibold">
                    {rankVisuals[doc.peringkat]?.label || doc.peringkat}
                  </span>
                </div>
              </div>

              <div className="border-l border-slate-100 pl-6">
                <div className="text-slate-400 font-medium mb-1">Referensi Poin</div>

                <div className="text-blue-500 font-medium text-xs mb-2">
                  Tingkat: {currentTingkat}
                </div>
                <div className="flex flex-col gap-1 text-xs font-normal text-slate-500">
                  {Object.entries(currentTingkatMatrix).map(([rank, val]) => {
                    const visual = rankVisuals[rank] || { label: rank, color: 'text-slate-800' }
                    return (
                      <div
                        key={rank}
                        className={`${visual.color} flex justify-between max-w-[220px]`}
                      >
                        <span>{visual.label}</span>
                        <span>{val} poin</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              {doc?.status === 'pending' && (
                <div className="col-span-2 border-t border-slate-100 pt-3 text-xs text-amber-600 font-medium flex items-center gap-1.5">
                  ⚠️ Poin akan otomatis ditambahkan setelah pengajuan disetujui.
                </div>
              )}
              {doc?.status === 'rejected' && (
                <div className="text-red-500 font-semibold gap-2 items-center flex col-span-2 text-sm">
                  <CircleX />
                  Pengajuan ditolak, poin tidak diberikan untuk prestasi ini..
                </div>
              )}
            </div>
          </div>
          {doc?.status === 'approved' && (
            <div className="card-outline text-green-500 bg-green-50 font-bold flex gap-2 text-sm">
              <CheckCircle />
              Prestasi ini telah diverifikasi dan disetujui oleh admin.
            </div>
          )}
          {doc?.status === 'rejected' && (
            <div className="card-outline text-red-500 bg-red-100/70 font-bold flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <AlertTriangle />
                Catatan Admin - Alasan Penolakan.
              </div>
              <p className="font-normal text-sm text-wrap">{doc?.catatanPenolakan || '-'}</p>
            </div>
          )}
          {/* Conditional Rejection Form */}
          {showRejectForm && (
            <form
              onSubmit={handleRejectSubmit}
              className="mt-2 border-t border-slate-100 pt-4 animate-in slide-in-from-top-2 duration-200"
            >
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Alasan Penolakan
              </label>
              <textarea
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tulis alasan penolakan sertifikat secara mendetail..."
                className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
              />
              <div className="flex gap-2 justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Memproses...' : 'Konfirmasi Tolak'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Actions */}
        {!showRejectForm && (
          <div
            className={`p-6 bg-slate-50 border-t border-slate-100 flex ${doc?.status === 'pending' ? '' : 'flex-row-reverse'}  gap-4 shrink-0`}
          >
            {doc?.status === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="flex-1 bg-[#4ade80] hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Memproses...' : 'Setujui Prestasi'}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isPending}
                  className="flex-1 bg-[#f43f5e] hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                  Tolak Prestasi
                </button>
              </>
            )}

            <button
              onClick={onClose}
              disabled={isPending}
              className="px-8 bg-slate-200/70 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-300 transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
