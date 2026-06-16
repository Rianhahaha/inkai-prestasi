// src/app/(frontend)/(admin)/admin-dashboard/VerificationActions.tsx
'use client'

import React, { useState } from 'react'
import { verifyAchievement } from '@/app/(frontend)/(admin)/admin-dashboard/action'
import DetailModal from '@/app/(frontend)/(admin)/components/DetailModal' // Sesuaikan path lokasi file modal Anda

interface VerificationActionsProps {
  doc: any // Menerima full document object dari baris tabel
  status?: string
}

export default function VerificationActions({ doc }: VerificationActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Adapter untuk fungsi penyetujuan (Approve)
  const handleApprove = async (id: string) => {
    const res = await verifyAchievement(id, 'approved', '')
    return {
      success: res.success,
      error: res.error,
    }
  }

  // Adapter untuk fungsi penolakan (Reject) beserta alasan
  const handleReject = async (id: string, reason: string) => {
    const res = await verifyAchievement(id, 'rejected', reason)
    return {
      success: res.success,
      error: res.error,
    }
  }

  return (
    <>
      {/* Tombol pemicu berbentuk Pill sesuai mockup gambar */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer border border-blue-400 text-blue-500 px-6 py-1.5 rounded-full text-xs font-semibold hover:bg-blue-500 hover:text-white transition-colors"
      >
        Detail
      </button>

      {/* Render overlay modal secara kondisional berdasarkan baris terkait */}
      {isModalOpen && (
        <DetailModal
          status={status}
          doc={doc}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  )
}
