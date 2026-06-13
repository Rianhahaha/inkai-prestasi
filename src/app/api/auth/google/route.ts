// src/app/api/auth/google/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { OAuth2Client } from 'google-auth-library'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { credential } = body // The ID Token from Google

    if (!credential) {
      return NextResponse.json({ error: 'Missing Google credential' }, { status: 400 })
    }

    // 1. Verify the Google ID Token signature
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const googlePayload = ticket.getPayload()
    if (!googlePayload || !googlePayload.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 })
    }

    const { email, name } = googlePayload

    // Initialize Payload local API
    const payload = await getPayload({ config })

    // 2. Query existing user
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    let userId: string | number

    if (existingUsers.docs.length > 0) {
      // User exists, retrieve their ID
      userId = existingUsers.docs[0].id
      payload.logger.info(`Google OAuth: Authenticated existing user ${email}`)
    } else {
      // 3. Shadow Account Provisioning for new users
      const randomPassword = crypto.randomBytes(20).toString('hex')

      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: email,
          password: randomPassword, // Required by Payload local auth
          namaLengkap: name || 'User',
          role: 'athlete',
          totalPoin: 0,
        },
      })

      userId = newUser.id
      payload.logger.info(`Google OAuth: Provisioned new shadow account for ${email}`)
    }

    // 4. Payload Session Issuance
    // Construct the JWT payload strictly following PayloadCMS specification
    const jwtToken = jwt.sign(
      {
        email: email,
        id: userId,
        collection: 'users',
      },
      process.env.PAYLOAD_SECRET as string,
      { expiresIn: '7d' }, // Session lifetime
    )

    // 5. Set HTTP-Only Cookie
    const cookieStore = await cookies()
    cookieStore.set('payload-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, redirectUrl: '/dashboard' })
  } catch (error) {
    console.error('[Google OAuth Error]', error)
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 },
    )
  }
}
