// src/app/(admin)/admin-dashboard/VerificationActions.tsx
'use client'

import React, { useState } from 'react'
import { verifyAchievement } from '@/app/(frontend)/(admin)/admin-dashboard/action'

export default function VerificationActions({ achievementId }: { achievementId: string | number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectNote, setRejectNote] = useState('')

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !rejectNote.trim()) {
      alert('Catatan penolakan wajib diisi agar atlet tahu alasannya.')
      return
    }

    setIsLoading(true)

    // Execute the Server Action
    const res = await verifyAchievement(achievementId, status, rejectNote)

    setIsLoading(false)

    if (!res.success) {
      alert(res.error)
    } else {
      // Reset state on success.
      // Note: The row will disappear automatically because Server Action calls revalidatePath
      setIsRejecting(false)
      setRejectNote('')
    }
  }

  // Render modal/inline input for rejection
  if (isRejecting) {
    return (
      <div className="flex flex-col gap-2 w-48">
        <textarea
          placeholder="Alasan tolak..."
          className="border border-red-200 p-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          rows={2}
        />
        <div className="flex gap-2">
          <button
            disabled={isLoading}
            onClick={() => handleAction('rejected')}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
          >
            {isLoading ? '...' : 'Konfirmasi Tolak'}
          </button>
          <button
            disabled={isLoading}
            onClick={() => setIsRejecting(false)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            Batal
          </button>
        </div>
      </div>
    )
  }

  // Render default action buttons
  return (
    <div className="flex gap-2 text-sm">
      <button
        disabled={isLoading}
        onClick={() => handleAction('approved')}
        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Memproses...' : 'Setujui'}
      </button>
      <button
        disabled={isLoading}
        onClick={() => setIsRejecting(true)}
        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        Tolak
      </button>
    </div>
  )
}
