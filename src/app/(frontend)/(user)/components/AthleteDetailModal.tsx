// src/app/(user)/prestasi/AthleteDetailModal.tsx
'use client'

import React, { useState, useActionState, useEffect } from 'react'
import {
  FileText,
  Award,
  CheckCircle,
  CircleX,
  AlertTriangle,
  Calendar,
  MapPin,
} from 'lucide-react'
import { calculatePoints, POINT_MATRIX } from '@/lib/points'
import { submitPrestasi } from '../dashboard/prestasi/action'

interface AthleteDetailModalProps {
  doc: any
  onClose: () => void
}

const rankVisuals: Record<string, { label: string; color: string }> = {
  'Juara 1': { label: 'Emas', color: 'text-yellow-500' },
  'Juara 2': { label: 'Perak', color: 'text-slate-400' },
  'Juara 3': { label: 'Perunggu', color: 'text-orange-500' },
}

export default function AthleteDetailModal({ doc, onClose }: AthleteDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [state, formAction, isPending] = useActionState(submitPrestasi, null)

  // Auto-close atau balik ke mode view kalau sukses
  useEffect(() => {
    if (state?.success) {
      setIsEditing(false)
      onClose() // Tutup modal biar data refresh otomatis (karena revalidatePath)
    }
  }, [state, onClose])
  if (!doc) return null

  // Derive points menggunakan Shared Utility
  const currentJenis = doc?.jenisKejuaraan?.toLowerCase() || 'open'
  const currentTingkat = doc?.tingkatKejuaraan || 'Kecamatan'
  const calculatedPoints = calculatePoints(currentJenis, currentTingkat, doc?.peringkat)
  const currentTingkatMatrix = POINT_MATRIX[currentJenis]?.[currentTingkat] || {}
  const defaultDateValue = doc?.tanggalKejuaraan
    ? new Date(doc.tanggalKejuaraan).toISOString().split('T')[0]
    : ''
  // console.log('sertifikat :', doc)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Perbaiki Data Prestasi' : 'Detail Prestasi'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        {/* Notifikasi Error/Success dari Action */}
        {state?.error && (
          <div className="mx-8 mt-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg">
            {state.error}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-8 flex flex-col gap-5 overflow-y-auto">
          {/* Banner Status Final - PENOLAKAN */}
          {doc?.status === 'rejected' && (
            <div className="card-outline border border-red-200 text-red-600 bg-red-50 p-4 rounded-xl font-bold flex flex-col gap-2 text-sm">
              <div className="flex gap-2 items-center">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                Pengajuan ditolak oleh Admin.
              </div>
              <p className="font-normal text-sm text-wrap text-slate-700 bg-white/60 p-3 rounded-lg border border-red-100">
                <span className="font-semibold text-slate-800 block mb-1">Catatan Admin:</span>
                {doc?.catatanPenolakan || 'Tidak ada catatan spesifik.'}
              </p>

              {/* TOMBOL TRIGGER EDIT MODE */}
            </div>
          )}
          {isEditing ? (
            // ==========================================
            // FORM EDIT MODE
            // ==========================================
            <form action={formAction} id="resubmit-form" className="flex flex-col gap-4">
              {/* HIDDEN ID BUAT TRIGGER UPDATE MODE DI SERVER */}
              <input type="hidden" name="achievementId" value={doc.id} />
              {/* <input type="hidden" name="namaKejuaraan" value={doc.namaKejuaraan} />
              <input type="hidden" name="kategori" value={doc.kategori} />
              <input type="hidden" name="tanggalKejuaraan" value={doc?.tanggalKejuaraan} />
              <input type="hidden" name="jenisKejuaraan" value={doc.jenisKejuaraan} />
              <input type="hidden" name="peringkat" value={doc.peringkat} />
              <input type="hidden" name="tingkatKejuaraan" value={doc.tingkatKejuaraan} />
              <input type="hidden" name="lokasiKejuaraan" value={doc.lokasiKejuaraan} />
              <input type="hidden" name="sertifikat" value={doc.sertifikat} />
              <input type="hidden" name="namaKejuaraan" value={doc.namaKejuaraan} /> */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Kejuaraan
                </label>
                <input
                  defaultValue={doc.namaKejuaraan}
                  type="text"
                  name="namaKejuaraan"
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kategori (Kelas)
                  </label>
                  <input
                    defaultValue={doc.kategori}
                    type="text"
                    name="kategori"
                    placeholder="Cth: Kumite -60kg Putra"
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tanggal Kejuaraan
                  </label>
                  <input
                    defaultValue={defaultDateValue}
                    type="date"
                    name="tanggalKejuaraan"
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Jenis Kejuaraan</label>
                  <select
                    defaultValue={doc.jenisKejuaraan}
                    name="jenisKejuaraan"
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
                    defaultValue={doc.peringkat}
                    name="peringkat"
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
                    defaultValue={doc.tingkatKejuaraan}
                    name="tingkatKejuaraan"
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
                  defaultValue={doc.lokasiKejuaraan}
                  type="text"
                  name="lokasiKejuaraan"
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-sm text-slate-800 truncate max-w-[320px]">
                      {doc.sertifikat?.filename || 'sertifikat_prestasi.pdf'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Dokumen Saat ini</div>
                  </div>
                </div>
                {doc.sertifikat?.url && (
                  <a
                    href={doc.sertifikat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-blue-200 text-blue-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0"
                  >
                    Lihat File
                  </a>
                )}
              </div>

              {/* ... TARUH INPUT LAINNYA DI SINI (kategori, peringkat, jenis, tingkat, tanggal, lokasi) ... */}
              {/* Jangan lupa pakai defaultValue={doc.fieldNama} */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Upload Sertifikat Baru (Opsional)
                </label>
                <input
                  type="file"
                  name="sertifikat"
                  accept=".pdf,image/*"
                  className="w-full border border-slate-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Abaikan jika tidak ingin mengubah sertifikat.
                </p>
              </div>
            </form>
          ) : (
            // ==========================================
            // READ-ONLY MODE (Kode asli lo)
            // ==========================================
            <>
              {/* Header Status Ringkas */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-lg text-slate-800">{doc.namaKejuaraan}</h4>
                <span
                  className={`px-3 py-1 ${
                    doc?.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : doc.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  } text-xs font-semibold rounded-md w-fit mt-1`}
                >
                  {doc?.status === 'approved'
                    ? 'Disetujui'
                    : doc.status === 'pending'
                      ? 'Menunggu Verifikasi'
                      : 'Ditolak'}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Kategori
                    </label>
                    <div className="font-bold text-slate-800 text-sm">{doc.kategori}</div>
                  </div>
                  <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Peringkat
                    </label>
                    <div className="font-bold text-slate-800 text-sm">
                      {doc.peringkat} / {rankVisuals[doc.peringkat]?.label}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Jenis Kejuaraan
                    </label>
                    <div className="font-bold text-slate-800 text-sm">
                      {doc.jenisKejuaraan || 'Open'}
                    </div>
                  </div>
                  <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Tingkat Kejuaraan
                    </label>
                    <div className="font-bold text-slate-800 text-sm">{doc.tingkatKejuaraan}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Tanggal Kejuaraan
                    </label>
                    <div className="font-bold text-slate-800 text-sm">
                      {doc.tanggalFormatted || doc.tanggalKejuaraan}
                    </div>
                  </div>
                  <div className="border border-slate-200 bg-slate-50/30 p-4 rounded-xl">
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5" /> Lokasi Kejuaraan
                    </label>
                    <div className="font-bold text-slate-800 text-sm truncate">
                      {doc.lokasiKejuaraan || '-'}
                    </div>
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
                    <div className="text-xs text-slate-400 mt-0.5">Dokumen Terlampir</div>
                  </div>
                </div>
                {doc.sertifikat?.url && (
                  <a
                    href={doc.sertifikat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-blue-200 text-blue-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0"
                  >
                    Lihat File
                  </a>
                )}
              </div>

              {/* ... BLOCK FIELD READ-ONLY LO YG SEBELUMNYA ... */}
            </>
          )}
          {/* <div className="flex flex-col gap-1">
            <h4 className="font-bold text-lg text-slate-800">{doc.namaKejuaraan}</h4>
            <span
              className={`px-3 py-1 ${
                doc?.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : doc.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              } text-xs font-semibold rounded-md w-fit mt-1`}
            >
              {doc?.status === 'approved'
                ? 'Disetujui'
                : doc.status === 'pending'
                  ? 'Menunggu Verifikasi'
                  : 'Ditolak'}
            </span>
          </div> */}

          {/* Point Computation Section */}
          <div className="border border-slate-200 rounded-xl">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Award className="w-4 h-4 text-orange-500" />
              Sistem Poin
            </div>
            <div className="p-5 bg-white text-sm grid grid-cols-2 gap-6">
              <div>
                <div className="text-slate-400 font-medium mb-1">Status Poin</div>
                <div
                  className={`font-bold ${doc?.status === 'approved' ? 'text-blue-500' : 'text-slate-800'} text-lg`}
                >
                  {doc?.status === 'approved' ? `+${calculatedPoints} Poin` : 'Menunggu'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Potensi poin untuk{' '}
                  <span className="font-semibold">
                    {rankVisuals[doc.peringkat]?.label || doc.peringkat}
                  </span>
                </div>
              </div>

              <div className="border-l border-slate-100 pl-6">
                <div className="text-slate-400 font-medium mb-1">Referensi Skala</div>
                <div className="text-blue-500 font-medium text-xs mb-2">
                  Tingkat {currentTingkat} ({doc.jenisKejuaraan || 'Open'})
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
                        <span>{String(val)} poin</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Status Final */}
          {doc?.status === 'approved' && (
            <div className="card-outline border border-green-200 text-green-600 bg-green-50 p-4 rounded-xl font-bold flex gap-2 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Selamat! Prestasi Anda telah diverifikasi dan poin telah ditambahkan ke profil Anda.
            </div>
          )}
        </div>

        {/* Modal Footer (Read Only) */}
        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0 gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="cursor-pointer px-6 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Batal
              </button>
              {/* Trigger Submit ke form */}
              <button
                form="resubmit-form"
                type="submit"
                disabled={isPending}
                className="cursor-pointer px-6 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-sm"
              >
                {isPending ? 'Menyimpan...' : 'Simpan & Ajukan Ulang'}
              </button>
            </>
          ) : (
            <>
              {doc?.status === 'rejected' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 bg-red-500 text-white hover:text-red-500 font-bold py-2.5 rounded-xl hover:bg-white border border-red-500 transition-colors text-sm cursor-pointer"
                >
                  Perbaiki & Ajukan Ulang
                </button>
              )}
              <button
                onClick={onClose}
                className="px-8 bg-slate-200/70 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-300 transition-colors text-sm cursor-pointer"
              >
                Tutup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
