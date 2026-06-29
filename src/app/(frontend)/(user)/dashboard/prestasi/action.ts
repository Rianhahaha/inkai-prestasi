// src/app/(user)/prestasi/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function submitPrestasi(prevState: any, formData: FormData) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const user = await getCurrentUser()

  // 1. Security Barrier
  if (!user) {
    return { success: false, error: 'Unauthorized payload mutation.' }
  }

  const file = formData.get('sertifikat') as File
  if (!file || file.size === 0) {
    return { success: false, error: 'Sertifikat wajib diunggah.' }
  }

  // Next.js File parsing for Payload Local API compatibility
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    // 2. Media Upload Operation
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        owner: user.id, // Set the RBAC owner dynamically
        alt: `Sertifikat ${formData.get('namaKejuaraan')}`,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
    })

    // 3. Metadata Linking Operation
    await payload.create({
      collection: 'achievements',
      data: {
        atlet: user.id,
        namaKejuaraan: formData.get('namaKejuaraan') as string,
        kategori: formData.get('kategori') as string,
        peringkat: (formData.get('peringkat') as 'Juara 1' | 'Juara 2' | 'Juara 3') || 'Juara 1',
        jenisKejuaraan: (formData.get('jenisKejuaraan') as 'Open' | 'Festival') || 'Open',
        tingkatKejuaraan:
          (formData.get('tingkatKejuaraan') as
            | 'Kecamatan'
            | 'Kabupaten/Kota'
            | 'Provinsi'
            | 'Nasional'
            | 'Internasional') || 'Kabupaten/Kota',
        tanggalKejuaraan: formData.get('tanggalKejuaraan') as string,
        lokasiKejuaraan: formData.get('lokasiKejuaraan') as string,
        sertifikat: mediaDoc.id,
        status: 'pending',
      },
    }) // <-- Casting seluruh objek argumen

    // 4. Cache Invalidation
    // Clears the Next.js cache so the dashboard reflects the new pending state instantly
    revalidatePath('/dashboard')
    revalidatePath('/prestasi')

    return { success: true, message: 'Prestasi berhasil diajukan untuk verifikasi.' }
  } catch (error: any) {
    payload.logger.error(
      `[Mutation Error] User ${user.id} failed to submit achievement: ${error.message}`,
    )
    return { success: false, error: 'Terjadi kesalahan internal server saat memproses data.' }
  }
}
