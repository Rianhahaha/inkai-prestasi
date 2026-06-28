import React from 'react'
import { Clock } from 'lucide-react' // Asumsi Anda menggunakan lucide-react

// --- 1. Helper Components untuk Badges ---
export const TingkatBadge = ({ tingkat }: { tingkat: string }) => {
  // Mapping warna spesifik sesuai mockup (Pink, Orange, Biru, dll)
  const styles: Record<string, string> = {
    Kecamatan: 'bg-[#ffcbf2] text-[#d91eac]',
    'Kabupaten/Kota': 'bg-[#ffe4b5] text-[#d97706]', // Orange soft
    Provinsi: 'bg-[#e0e7ff] text-[#4f46e5]', // Indigo/Purple soft
    Nasional: 'bg-[#bfdbfe] text-[#2563eb]', // Blue soft
    Internasional: 'bg-[#a5f3fc] text-[#0891b2]', // Cyan/Teal soft
  }

  const currentStyle = styles[tingkat] || 'bg-slate-100 text-slate-600'

  return (
    <span
      className={`flex justify-center px-4 py-1.5 min-w-[10rem] rounded-md text-xs font-semibold ${currentStyle}`}
    >
      {tingkat}
    </span>
  )
}

export const StatusBadge = ({ status }: { status: string }) => {
  // Karena tabel ini khusus 'pending', kita fokus ke warna kuning.
  // Bisa diperluas jika tabel ini dipakai untuk status lain.
  const isPending = status === 'pending' || status === 'Menunggu'
  const isApproved = status === 'approved'

  const styles: Record<string, string> = {
    pending: 'bg-[#fef08a] text-[#ca8a04]', // Yellow soft
    Menunggu: 'bg-[#fef08a] text-[#ca8a04]', // Fallback
    approved: 'bg-green-100 text-green-500', // Green soft
    rejected: 'bg-red-100 text-red-700', // Red soft
  }

  // 2. Pemetaan Label Visual (Translasi)
  const labels: Record<string, string> = {
    pending: 'Menunggu',
    Menunggu: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  }

  const currentStyle = styles[status] || 'bg-slate-100 text-slate-600'
  const currentLabel = labels[status] || status

  return (
    <span
      className={`flex justify-center px-4 py-1.5 min-w-[10rem] h-fit rounded-md text-xs font-semibold ${currentStyle}`}
    >
      {currentLabel}
    </span>
  )
}
