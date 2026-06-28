// src/components/BackToDashboard.tsx
import React from 'react'

interface BackToDashboardProps {
  user?: {
    role?: string
    [key: string]: any
  }
}

// Menggunakan export default sesuai dengan environment Anda
export default function BackToDashboard({ user }: BackToDashboardProps) {
  // Guard Clause: Sembunyikan tombol jika role adalah superadmin
  if (user?.role === 'superadmin') {
    return null
  }

  return (
    <div style={{ padding: '0 1.5rem 1rem 1.5rem' }}>
      <a
        href="/admin-dashboard/konten"
        style={{
          display: 'block',
          textAlign: 'center',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '0.6rem 1rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          border: 'none',
        }}
      >
        &larr; Kembali ke Dashboard
      </a>
    </div>
  )
}
