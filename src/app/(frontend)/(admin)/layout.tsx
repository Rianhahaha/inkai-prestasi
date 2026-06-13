// src/app/(admin)/layout.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Sidebar } from './components/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  // Evaluasi Array untuk Multi-Role Authentication
  const hasAdminPrivilege = ['admin', 'superadmin'].includes(user.role)

  if (!hasAdminPrivilege) {
    payload.logger.warn(`[Security] Unauthorized admin access attempt by user ${user.id}`)
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
