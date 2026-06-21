// src/lib/auth.ts
import { cache } from 'react'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'

export const getCurrentUser = cache(async () => {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) return null

    // 1. Dekripsi Token
    const decoded = jwt.verify(token, payload.secret) as any

    const dbUser = await payload.findByID({
      collection: 'users',
      id: decoded.id,
      depth: 0,
    })

    if (!dbUser) return null

    // 2. Normalisasi Kunci Sesi (Hybrid Acceptance)
    // Baca 'sid' (Native Payload) atau 'session' (Custom Google)
    const activeSessionId = decoded.sid || decoded.session

    if (activeSessionId) {
      // 3. Strict Two-Way Binding
      const isSessionValid = dbUser.sessions?.some(
        (s: any) => s.id === activeSessionId && new Date(s.expiresAt) > new Date(),
      )

      if (!isSessionValid) {
        console.warn('[AUTH REJECTED] Sesi kadaluarsa atau tidak ada di DB.')
        return null
      }
    } else {
      // Failsafe jika Payload di masa depan menghapus session dari JWT
      console.warn(
        '[AUTH WARNING] Token tidak memiliki sid/session. Mengandalkan validasi User ID saja.',
      )
    }

    return dbUser
  } catch (error) {
    console.error('[AUTH Utility Error]:', error)
    return null
  }
})
