// // src/app/api/seed-prestasi/route.ts
// import { NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { fakerID_ID as faker } from '@faker-js/faker'

// export async function GET() {
//   const payload = await getPayload({ config })

//   // [!] GANTI DENGAN ID MEDIA YANG ANDA UNGGAH DI LANGKAH 1
//   // Jika ID Anda berupa UUID string, ubah menjadi string (misal: 'abc-123')
//   const DUMMY_MEDIA_ID = 9

//   // Matrix Constants
//   const TINGKAT_OPTIONS = ['Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional']
//   const PERINGKAT_OPTIONS = ['Juara 1', 'Juara 2', 'Juara 3']
//   const STATUS_OPTIONS = ['pending', 'approved', 'rejected']
//   const KATEGORI_OPTIONS = [
//     'Kumite Perorangan Putra',
//     'Kumite Perorangan Putri',
//     'Kata Perorangan Putra',
//     'Kata Perorangan Putri',
//   ]

//   let successCount = 0
//   let failCount = 0

//   try {
//     // 1. Ambil sampel 50 atlet dari database untuk dihubungkan
//     console.log('[SEEDER] Fetching athletes...')
//     const athletes = await payload.find({
//       collection: 'users',
//       where: { role: { equals: 'athlete' } },
//       limit: 50,
//       depth: 0,
//     })

//     if (athletes.totalDocs === 0) {
//       return NextResponse.json(
//         { error: 'Tidak ada atlet ditemukan. Jalankan seed-atlet terlebih dahulu.' },
//         { status: 400 },
//       )
//     }

//     const TARGET_COUNT = 100 // Kita buat 100 prestasi yang disebar acak ke 50 atlet

//     console.log(`[SEEDER] Generating ${TARGET_COUNT} achievements...`)

//     for (let i = 0; i < TARGET_COUNT; i++) {
//       const randomAthlete = athletes.docs[Math.floor(Math.random() * athletes.docs.length)]
//       const randomTingkat = TINGKAT_OPTIONS[Math.floor(Math.random() * TINGKAT_OPTIONS.length)]
//       const randomPeringkat =
//         PERINGKAT_OPTIONS[Math.floor(Math.random() * PERINGKAT_OPTIONS.length)]
//       const randomStatus = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)]
//       const randomKategori = KATEGORI_OPTIONS[Math.floor(Math.random() * KATEGORI_OPTIONS.length)]

//       const randomDate = faker.date.past({ years: 2 })

//       try {
//         await payload.create({
//           collection: 'achievements',
//           data: {
//             atlet: randomAthlete.id,
//             namaKejuaraan: `Kejuaraan Karate ${faker.location.city()} ${randomDate.getFullYear()}`,
//             kategori: randomKategori,
//             peringkat: randomPeringkat as any,
//             tingkatKejuaraan: randomTingkat as any,
//             tanggalKejuaraan: randomDate.toISOString(),
//             lokasiKejuaraan: `GOR ${faker.location.city()}`,
//             sertifikat: DUMMY_MEDIA_ID,
//             status: randomStatus as any,
//             catatanPenolakan:
//               randomStatus === 'rejected' ? 'Dokumen tidak dapat dibaca / buram.' : undefined,
//           },
//         })
//         successCount++
//       } catch (err) {
//         console.error(`[SEEDER] Failed on iteration ${i}`, err)
//         failCount++
//       }
//     }

//     return NextResponse.json({
//       status: 'Execution Terminated',
//       report: {
//         target: TARGET_COUNT,
//         success: successCount,
//         failed: failCount,
//       },
//     })
//   } catch (error) {
//     return NextResponse.json({ error: 'Fatal error during seeding execution' }, { status: 500 })
//   }
// }
