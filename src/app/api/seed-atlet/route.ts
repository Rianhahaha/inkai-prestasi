// src/app/api/seed-atlet/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { fakerID_ID as faker } from '@faker-js/faker'

export async function GET() {
  const payload = await getPayload({ config })

  const SABUK_OPTIONS = [
    'Putih',
    'Kuning',
    'Hijau',
    'Biru',
    'Coklat Kyu 1',
    'Coklat Kyu 2',
    'Coklat Kyu 3',
    'Hitam Dan 1',
    'Hitam Dan 2',
    'Hitam Dan 3',
    'Hitam Dan 4',
    'Hitam Dan 5',
  ]

  const TARGET_COUNT = 100
  let successCount = 0
  let failCount = 0

  console.log(`[SEEDER] Initiating generation of ${TARGET_COUNT} athlete entities...`)

  // We use sequential loop instead of Promise.all to prevent database connection pool exhaustion
  for (let i = 0; i < TARGET_COUNT; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = faker.internet.email({ firstName, lastName }).toLowerCase()

    // Select random belt from the array
    const randomSabuk = SABUK_OPTIONS[Math.floor(Math.random() * SABUK_OPTIONS.length)]

    try {
      await payload.create({
        collection: 'users',
        data: {
          email: email,
          password: 'password123', // Universal static password for testing
          namaLengkap: `${firstName} ${lastName}`,
          role: 'athlete', // Explicit casting to bypass TypeScript strict enum
          sabuk: randomSabuk as any, // Bypass strict type mapping for seeder
        },
      })
      successCount++
    } catch (error) {
      console.error(`[SEEDER] Failed to inject user: ${email}`, error)
      failCount++
    }
  }

  console.log(`[SEEDER] Execution complete. Success: ${successCount}, Failed: ${failCount}`)

  return NextResponse.json({
    status: 'Execution Terminated',
    report: {
      target: TARGET_COUNT,
      success: successCount,
      failed: failCount,
      defaultPassword: 'password123',
    },
  })
}
