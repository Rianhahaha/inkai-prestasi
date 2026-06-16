// src/app/(user)/layout.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Sidebar } from './components/Sidebar'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  // 2. Bounce privileged roles to their designated zones
  if (user.role === 'admin') {
    redirect('/admin-dashboard')
  }

  if (user.role === 'superadmin') {
    redirect('/superadmin')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
