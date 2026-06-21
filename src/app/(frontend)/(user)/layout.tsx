// src/app/(user)/layout.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'
import { Sidebar } from './components/Sidebar'
import { getCurrentUser } from '@/lib/auth'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const user = await getCurrentUser()
  // 1. Native Bypass Authentication Strategy (Sama seperti di rute & action)

  // 2. Guard Gate 1: Unauthenticated
  if (!user) {
    redirect('/login')
  }

  // 3. Guard Gate 2: Privileged Role Bouncing
  if (user.role === 'admin') {
    redirect('/admin-dashboard')
  }

  if (user.role === 'superadmin') {
    redirect('/superadmin')
  }
  // Eksekusi Render
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
