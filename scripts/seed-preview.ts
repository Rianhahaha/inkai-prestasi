#!/usr/bin/env tsx
/**
 * Preview Seed Script for inkai-prestasi
 * Populates all collections with realistic dummy data for preview deployments
 * 
 * Usage:
 *   pnpm run seed:preview           # Normal run (skips if data exists)
 *   FORCE_SEED=true pnpm run seed:preview  # Force re-seed
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { faker } from '@faker-js/faker'
import { calculatePoints } from '../src/lib/points.js'
import fs from 'fs'
import path from 'path'

// Set Indonesian locale for faker
// faker.setLocale('id_ID') // Not available in this version

// ============================================
// CONFIGURATION
// ============================================

const FORCE_SEED = process.env.FORCE_SEED === 'true'
const PREVIEW_EMAIL_DOMAIN = '@preview.local'

// Password for all preview accounts (hashed by Payload on create)
const PREVIEW_PASSWORD = 'preview123'

// Number of athletes to create
const NUM_ATHLETES = 15

// ============================================
// HELPER FUNCTIONS
// ============================================

async function findOrCreateUser(payload: any, email: string, data: any) {
  // Check if user already exists
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    if (FORCE_SEED) {
      console.log(`  🔄 Updating existing user: ${email}`)
      return await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data,
      })
    }
    console.log(`  ⏭️  Skipping existing user: ${email}`)
    return existing.docs[0]
  }

  console.log(`  ✨ Creating user: ${email}`)
  return await payload.create({
    collection: 'users',
    data: { ...data, password: PREVIEW_PASSWORD },
  })
}

async function findOrCreateMedia(payload: any, alt: string, filename: string) {
  // Check if media already exists by filename
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    if (FORCE_SEED) {
      console.log(`  🔄 Updating existing media: ${filename}`)
      return await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt },
      })
    }
    return existing.docs[0]
  }

  // Use local placeholder images
  const publicImagesDir = path.join(process.cwd(), 'public', 'images')
  const placeholderPath = path.join(publicImagesDir, filename)
  
  if (!fs.existsSync(placeholderPath)) {
    console.log(`  ⚠️  Placeholder not found: ${filename}, using user-placeholder.png`)
    return await findOrCreateMedia(payload, alt, 'user-placeholder.png')
  }

  console.log(`  ✨ Creating media: ${filename}`)
  
  // Create media via Payload's upload - we'll use the file directly
  const fileBuffer = fs.readFileSync(placeholderPath)
  const blob = new Blob([fileBuffer], { type: 'image/png' })
  const file = new File([blob], filename, { type: 'image/png' })

  return await payload.create({
    collection: 'media',
    data: { alt },
    file,
  })
}

async function findOrCreateKonten(payload: any, slug: string, data: any) {
  const existing = await payload.find({
    collection: 'konten',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    if (FORCE_SEED) {
      console.log(`  🔄 Updating existing konten: ${slug}`)
      return await payload.update({
        collection: 'konten',
        id: existing.docs[0].id,
        data,
      })
    }
    return existing.docs[0]
  }

  console.log(`  ✨ Creating konten: ${slug}`)
  return await payload.create({
    collection: 'konten',
    data,
  })
}

async function findOrCreatePengurus(payload: any, nama: string, data: any) {
  const existing = await payload.find({
    collection: 'pengurus',
    where: { nama: { equals: nama } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    if (FORCE_SEED) {
      console.log(`  🔄 Updating existing pengurus: ${nama}`)
      return await payload.update({
        collection: 'pengurus',
        id: existing.docs[0].id,
        data,
      })
    }
    return existing.docs[0]
  }

  console.log(`  ✨ Creating pengurus: ${nama}`)
  return await payload.create({
    collection: 'pengurus',
    data,
  })
}

async function findOrCreateAchievement(payload: any, namaKejuaraan: string, atletId: number, data: any) {
  const existing = await payload.find({
    collection: 'achievements',
    where: {
      and: [
        { namaKejuaraan: { equals: namaKejuaraan } },
        { atlet: { equals: atletId } },
      ],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    if (FORCE_SEED) {
      console.log(`  🔄 Updating existing achievement: ${namaKejuaraan} for atlet ${atletId}`)
      return await payload.update({
        collection: 'achievements',
        id: existing.docs[0].id,
        data,
      })
    }
    return existing.docs[0]
  }

  console.log(`  ✨ Creating achievement: ${namaKejuaraan}`)
  return await payload.create({
    collection: 'achievements',
    data: { ...data, atlet: atletId },
  })
}

// ============================================
// DATA GENERATORS
// ============================================

function generateAthleteProfile(index: number) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const namaLengkap = `${firstName} ${lastName}`
  const email = `atlet${index + 1}${PREVIEW_EMAIL_DOMAIN}`
  
  // Weighted belt distribution (more lower belts)
  const sabukWeights = [
    { value: 'Putih', weight: 30 },
    { value: 'Kuning', weight: 20 },
    { value: 'Hijau', weight: 15 },
    { value: 'Biru', weight: 12 },
    { value: 'Coklat Kyu 3', weight: 8 },
    { value: 'Coklat Kyu 2', weight: 6 },
    { value: 'Coklat Kyu 1', weight: 4 },
    { value: 'Hitam Dan 1', weight: 3 },
    { value: 'Hitam Dan 2', weight: 1.5 },
    { value: 'Hitam Dan 3', weight: 0.5 },
  ]
  
  const sabuk = faker.helpers.weightedArrayElement(sabukWeights) as string
  const jenisKelamin = faker.helpers.arrayElement(['Laki-laki', 'Perempuan'])
  
  return {
    email,
    namaLengkap,
    role: 'athlete' as const,
    sabuk,
    jenisKelamin,
    tempatLahir: faker.location.city(),
    tanggalLahir: faker.date.birthdate({ min: 15, max: 35, mode: 'age' }).toISOString().split('T')[0],
    nomorTelepon: `08${faker.string.numeric(9)}`,
    authProvider: ['local'] as const,
  }
}

function generateAchievement(atletId: number, index: number) {
  const jenisKejuaraan = faker.helpers.arrayElement(['Open', 'Festival'])
  const tingkatKejuaraan = faker.helpers.arrayElement([
    'Kecamatan',
    'Kabupaten/Kota',
    'Provinsi',
    'Nasional',
    'Internasional',
  ])
  const peringkat = faker.helpers.arrayElement(['Juara 1', 'Juara 2', 'Juara 3'])
  
  // Weighted status (more approved for leaderboard)
  const status = faker.helpers.weightedArrayElement([
    { value: 'approved', weight: 60 },
    { value: 'pending', weight: 30 },
    { value: 'rejected', weight: 10 },
  ])
  
  const namaKejuaraan = `${faker.helpers.arrayElement([
    'Kejuaraan', 'Piala', 'Turnamen', 'Festival', 'Open', 'Championship'
  ])} ${faker.helpers.arrayElement([
    'INKA', 'Provinsi', 'Nasional', 'Internasional', 'Regional', 'Kabupaten', 'Kecamatan'
  ])} ${faker.number.int({ min: 1, max: 20 })}`
  
  const kategori = faker.helpers.arrayElement([
    'Poomsae Individual', 'Poomsae Team', 'Kyorugi', 'Demo Team', 'Freestyle Poomsae'
  ])
  
  // Generate date within last 2 years
  const tanggalKejuaraan = faker.date.between({ 
    from: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), 
    to: new Date() 
  }).toISOString().split('T')[0]
  
  const lokasiKejuaraan = faker.helpers.arrayElement([
    'GOR Amongrogo', 'GOR Universitas Negeri', 'GOR Pusdikpom', 'GOR TNI', 'GOR POLRI',
    'Gelanggang Merdeka', 'GOR Sritex', 'GOR Bung Karno', 'GOR C-Tra', 'GOR Popki'
  ])
  
  return {
    namaKejuaraan,
    kategori,
    jenisKejuaraan,
    peringkat,
    tingkatKejuaraan,
    tanggalKejuaraan,
    lokasiKejuaraan,
    status,
    catatanPenolakan: status === 'rejected' ? 'Sertifikat tidak jelas / tidak sesuai format' : undefined,
  }
}

function generateKonten(index: number) {
  const categories = [
    'Kegiatan', 'Kejuaraan', 'Ujian', 'Pelatihan', 'Pengumuman', 'Berita', 'Lainnya'
  ] as const
  
  const category = faker.helpers.arrayElement(categories)
  const judul = `${faker.helpers.arrayElement([
    'Pelaksanaan', 'Pembukaan', 'Penutupan', 'Hasil', 'Jadwal', 'Pengumuman', 'Undangan'
  ])} ${category} ${faker.helpers.arrayElement([
    'Tahunan', 'Bulanan', 'Regional', 'Nasional', 'Internasional', 'Kabupaten', 'Provinsi'
  ])} ${faker.number.int({ min: 2023, max: 2026 })}`
  
  const slug = judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 100)
  
  const tanggalMulai = faker.date.between({ 
    from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), 
    to: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) 
  })
  
  const hasEndDate = faker.datatype.boolean({ probability: 0.4 })
  const tanggalSelesai = hasEndDate 
    ? faker.date.between({ from: tanggalMulai, to: new Date(tanggalMulai.getTime() + 7 * 24 * 60 * 60 * 1000) })
    : null
  
  return {
    judul,
    slug,
    ringkasan: faker.lorem.paragraph({ min: 2, max: 4 }),
    kategori: category,
    tanggalMulai: tanggalMulai.toISOString().split('T')[0],
    tanggalSelesai: tanggalSelesai?.toISOString().split('T')[0] || null,
    publishedAt: new Date(Date.now() - faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 * 1000 })).toISOString(),
    lokasi: faker.helpers.arrayElement([
      'GOR Amongrogo', 'Aula Universitas', 'GOR Pusdikpom', 'Hotel Grand', 'Online (Zoom)',
      'GOR TNI', 'Gelanggang Merdeka', 'Kantor INKA Pusat'
    ]),
    status: 'published' as const,
    // Rich text content (Lexical format)
    isiKonten: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', version: 1, text: faker.lorem.paragraph({ min: 3, max: 6 }) }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', version: 1, text: faker.lorem.paragraph({ min: 3, max: 6 }) }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', version: 1, text: 'Untuk informasi lebih lanjut, silakan hubungi pengurus INKA.' }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  }
}

function generatePengurus(atletUsers: any[], index: number) {
  const divisiOptions = ['Pengurus Inti', 'Divisi Latihan', 'Divisi Humas', 'Divisi KRT/UU']
  const jabatanOptions = ['Ketua', 'Wakil Ketua', 'Sekretaris 1', 'Sekretaris 2', 'Bendahara 1', 'Bendahara 2', 'Bendahara 3', 'Koor', 'Staf']
  
  const divisi = faker.helpers.arrayElement(divisiOptions)
  const jabatan = faker.helpers.arrayElement(jabatanOptions)
  
  // 70% chance to link to an athlete
  const useAthlete = faker.datatype.boolean({ probability: 0.7 }) && atletUsers.length > 0
  
  if (useAthlete) {
    const atlet = faker.helpers.arrayElement(atletUsers)
    return {
      atlet: atlet.id,
      divisi,
      jabatan,
      jurusan: faker.helpers.arrayElement([
        'Teknik Informatika', 'Sistem Informasi', 'Teknik Komputer', 'Manajemen Informatika',
        'Teknik Elektro', 'Teknik Mesin', 'Teknik Sipil', 'Administrasi Bisnis'
      ]),
      // nama and foto will be auto-populated from athlete
    }
  }
  
  // Custom pengurus (non-athlete)
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const nama = `${firstName} ${lastName}`
  
  return {
    nama,
    divisi,
    jabatan,
    jurusan: faker.helpers.arrayElement([
      'Teknik Informatika', 'Sistem Informasi', 'Teknik Komputer', 'Manajemen Informatika',
      'Teknik Elektro', 'Teknik Mesin', 'Teknik Sipil', 'Administrasi Bisnis'
    ]),
  }
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log('🌱 Starting preview seed...')
  console.log(`   Force mode: ${FORCE_SEED}`)
  console.log(`   Athletes to create: ${NUM_ATHLETES}`)
  console.log('')

  const payload = await getPayload({ config })

  // --------------------------------------------
  // 1. CREATE SUPERADMIN
  // --------------------------------------------
  console.log('👤 Creating admin users...')
  
  const superadmin = await findOrCreateUser(payload, `superadmin${PREVIEW_EMAIL_DOMAIN}`, {
    email: `superadmin${PREVIEW_EMAIL_DOMAIN}`,
    namaLengkap: 'Super Admin Preview',
    role: 'superadmin',
    sabuk: 'Hitam Dan 5',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1990-01-01',
    nomorTelepon: '081234567890',
    authProvider: ['local'],
  })

  // Admin users
  const admin1 = await findOrCreateUser(payload, `admin1${PREVIEW_EMAIL_DOMAIN}`, {
    email: `admin1${PREVIEW_EMAIL_DOMAIN}`,
    namaLengkap: 'Admin Satu Preview',
    role: 'admin',
    sabuk: 'Hitam Dan 2',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Bandung',
    tanggalLahir: '1992-05-15',
    nomorTelepon: '081234567891',
    authProvider: ['local'],
  })

  const admin2 = await findOrCreateUser(payload, `admin2${PREVIEW_EMAIL_DOMAIN}`, {
    email: `admin2${PREVIEW_EMAIL_DOMAIN}`,
    namaLengkap: 'Admin Dua Preview',
    role: 'admin',
    sabuk: 'Hitam Dan 1',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1993-08-20',
    nomorTelepon: '081234567892',
    authProvider: ['local'],
  })

  // --------------------------------------------
  // 2. CREATE MEDIA (Placeholder images)
  // --------------------------------------------
  console.log('')
  console.log('🖼️  Creating media...')

  // Profile photos for athletes
  const athletePhotos: any[] = []
  for (let i = 1; i <= NUM_ATHLETES; i++) {
    const photo = await findOrCreateMedia(payload, `Foto profil atlet ${i}`, `user-placeholder.png`)
    athletePhotos.push(photo)
  }

  // Thumbnail images for konten
  const kontenThumbnails: any[] = []
  const thumbnailFiles = ['hero.png', 'tentang-1.png', 'tentang-2.png', 'ayo-bergabung.png', 'pengurus.png', 'user-placeholder.png']
  for (const file of thumbnailFiles) {
    const thumb = await findOrCreateMedia(payload, `Thumbnail ${file}`, file)
    kontenThumbnails.push(thumb)
  }

  // Certificate placeholder
  const certPlaceholder = await findOrCreateMedia(payload, 'Sertifikat placeholder', 'user-placeholder.png')

  // --------------------------------------------
  // 3. CREATE ATHLETES
  // --------------------------------------------
  console.log('')
  console.log('🥋 Creating athletes...')

  const athletes: any[] = []
  for (let i = 0; i < NUM_ATHLETES; i++) {
    const profile = generateAthleteProfile(i)
    const user = await findOrCreateUser(payload, profile.email, {
      ...profile,
      fotoProfil: athletePhotos[i % athletePhotos.length].id,
    })
    athletes.push(user)
  }

  // --------------------------------------------
  // 4. CREATE ACHIEVEMENTS
  // --------------------------------------------
  console.log('')
  console.log('🏆 Creating achievements...')

  // Create 2-4 achievements per athlete
  for (const athlete of athletes) {
    const numAchievements = faker.number.int({ min: 2, max: 4 })
    for (let j = 0; j < numAchievements; j++) {
      const achievementData = generateAchievement(athlete.id, j)
      
      // Calculate points for approved achievements
      let totalPoin = 0
      if (achievementData.status === 'approved') {
        totalPoin = calculatePoints(
          achievementData.jenisKejuaraan,
          achievementData.tingkatKejuaraan,
          achievementData.peringkat
        )
      }

      await findOrCreateAchievement(payload, achievementData.namaKejuaraan, athlete.id, {
        ...achievementData,
        sertifikat: certPlaceholder.id,
        // Points are auto-calculated via hooks, but we can verify
      })
    }
  }

  // Trigger point recalculation for all athletes
  console.log('  🔄 Recalculating athlete points...')
  for (const athlete of athletes) {
    const approvedAchievements = await payload.find({
      collection: 'achievements',
      where: {
        and: [
          { atlet: { equals: athlete.id } },
          { status: { equals: 'approved' } },
        ],
      },
      depth: 0,
      pagination: false,
    })

    const absoluteTotalPoints = approvedAchievements.docs.reduce((sum: number, doc: any) => {
      return sum + calculatePoints(doc.jenisKejuaraan, doc.tingkatKejuaraan, doc.peringkat)
    }, 0)

    await payload.update({
      collection: 'users',
      id: athlete.id,
      data: { totalPoin: absoluteTotalPoints },
    })
    console.log(`    ${athlete.namaLengkap}: ${absoluteTotalPoints} poin`)
  }

  // --------------------------------------------
  // 5. CREATE KONTEN
  // --------------------------------------------
  console.log('')
  console.log('📝 Creating konten...')

  const numKonten = 12
  for (let i = 0; i < numKonten; i++) {
    const kontenData = generateKonten(i)
    await findOrCreateKonten(payload, kontenData.slug, {
      ...kontenData,
      thumbnail: faker.helpers.arrayElement(kontenThumbnails).id,
    })
  }

  // --------------------------------------------
  // 6. CREATE PENGURUS
  // --------------------------------------------
  console.log('')
  console.log('👥 Creating pengurus...')

  const numPengurus = 10
  for (let i = 0; i < numPengurus; i++) {
    const pengurusData = generatePengurus(athletes, i)
    await findOrCreatePengurus(payload, pengurusData.nama || `Pengurus ${i + 1}`, pengurusData)
  }

  // --------------------------------------------
  // SUMMARY
  // --------------------------------------------
  console.log('')
  console.log('✅ Preview seed completed successfully!')
  console.log('')
  console.log('📋 Summary:')
  console.log(`   • 1 Superadmin: superadmin${PREVIEW_EMAIL_DOMAIN}`)
  console.log(`   • 2 Admins: admin1${PREVIEW_EMAIL_DOMAIN}, admin2${PREVIEW_EMAIL_DOMAIN}`)
  console.log(`   • ${athletes.length} Athletes: atlet1-${athletes.length}${PREVIEW_EMAIL_DOMAIN}`)
  console.log(`   • ~${athletes.length * 3} Achievements (mixed statuses)`)
  console.log(`   • ${numKonten} Published konten`)
  console.log(`   • ${numPengurus} Pengurus`)
  console.log('')
  console.log('🔐 All preview accounts use password: preview123')
  console.log('🌐 Ready for Vercel preview deployment!')
}

// Run the seed
main()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })