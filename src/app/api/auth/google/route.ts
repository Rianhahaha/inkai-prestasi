import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { OAuth2Client } from 'google-auth-library'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'
import { randomUUID, randomBytes } from 'crypto' // [!] Import randomUUID

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { credential } = body

    if (!credential) return NextResponse.json({ error: 'Missing credential' }, { status: 400 })

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const googlePayload = ticket.getPayload()
    if (!googlePayload?.email || !googlePayload?.sub) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { email, name, sub: googleId, picture } = googlePayload
    const payload = await getPayload({ config })

    let userId: string | number
    let isProfileComplete = false

    // [!] FASE 1: RESOLUSI IDENTITAS (Selesaikan Chicken-and-Egg)
    let userQuery = await payload.find({
      collection: 'users',
      where: {
        or: [{ googleId: { equals: googleId } }, { email: { equals: email } }],
      },
      limit: 1,
    })

    let existingUser = userQuery.docs.length > 0 ? userQuery.docs[0] : null

    if (existingUser) {
      userId = existingUser.id
      isProfileComplete = Boolean(
        existingUser.sabuk && existingUser.nomorTelepon && existingUser.tanggalLahir,
      )
    } else {
      // Jika user baru, BUAT DULU agar kita punya userId untuk dijadikan Owner Media
      isProfileComplete = false
      const randomPassword = randomBytes(20).toString('hex')
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: email,
          password: randomPassword,
          namaLengkap: name || 'User',
          role: 'athlete',
          totalPoin: 0,
          googleId: googleId,
          authProvider: ['google'],
        },
      })
      userId = newUser.id
      existingUser = newUser // Fallback reference
    }

    // [!] FASE 2: RESOLUSI MEDIA DENGAN OWNER
    let uploadedMediaId: string | number | null = null

    if (picture && !existingUser.fotoProfil) {
      try {
        const imageResponse = await fetch(picture)
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
          const extension = contentType.split('/')[1] || 'jpg'

          const mediaDoc = await payload.create({
            collection: 'media',
            data: {
              alt: `Avatar ${name}`,
              // [!] KRITIKAL: Inject userId sebagai owner
              owner: userId,
            },
            file: {
              data: buffer,
              name: `avatar-${googleId}.${extension}`,
              size: buffer.length,
              mimetype: contentType,
            },
          })
          uploadedMediaId = mediaDoc.id
        }
      } catch (mediaError) {
        console.error('[OAuth Media Upload Error]', mediaError)
      }
    }

    // [!] FASE 3: INJEKSI SESI & UPDATE FINAL
    const sessionId = randomUUID()
    const newSession = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    const currentProviders = (existingUser.authProvider || ['local']) as ('local' | 'google')[]
    const updatedProviders = currentProviders.includes('google')
      ? currentProviders
      : [...currentProviders, 'google']
    const validSessions = (existingUser.sessions || []).filter(
      (s: any) => new Date(s.expiresAt) > new Date(),
    )

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        googleId: googleId,
        authProvider: updatedProviders as any,
        sessions: [...validSessions, newSession],
        ...(uploadedMediaId && { fotoProfil: uploadedMediaId }),
      },
    })

    // [!] FASE 4: SIGNATURE & PENGIRIMAN (Menggunakan sid)
    const jwtToken = jwt.sign(
      {
        id: Number(userId),
        collection: 'users',
        email: email,
        sid: sessionId,
      },
      payload.secret,
      { expiresIn: '7d' },
    )

    const targetRoute = isProfileComplete ? '/dashboard' : '/lengkapi-profil'
    const response = NextResponse.json({ success: true, redirectUrl: targetRoute })

    response.cookies.set('payload-token', jwtToken, {
      httpOnly: true,
      secure: false, // Set 'true' jika sudah di production (HTTPS)
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('[Google OAuth Error]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
