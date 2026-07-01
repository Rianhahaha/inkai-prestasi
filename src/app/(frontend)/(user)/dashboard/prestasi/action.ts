// src/app/(user)/prestasi/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function submitPrestasi(prevState: any, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  // 1. Security Barrier
  if (!user) {
    return { success: false, error: 'Unauthorized payload mutation.' }
  }

  const achievementId = formData.get('achievementId') as string | null
  const file = formData.get('sertifikat') as File | null
  const hasNewFile = file && file.size > 0

  try {
    let mediaId = null

    if (achievementId) {
      // ==========================================
      // UPDATE MODE (RESUBMIT)
      // ==========================================
      const existingDoc = await payload.findByID({
        collection: 'achievements',
        id: achievementId,
        depth: 0,
      })

      // Ownership Authorization Guard
      const docOwner =
        typeof existingDoc.atlet === 'object' ? existingDoc.atlet.id : existingDoc.atlet
      if (docOwner !== user.id) {
        return { success: false, error: 'Akses ditolak.' }
      }

      if (hasNewFile) {
        // A. Handle file baru
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const newMediaDoc = await payload.create({
          collection: 'media',
          data: { owner: user.id, alt: `Revisi Sertifikat ${formData.get('namaKejuaraan')}` },
          file: { data: buffer, name: file.name, mimetype: file.type, size: file.size },
        })
        mediaId = newMediaDoc.id

        // B. Cleanup storage (Hapus file lama)
        const oldMediaId =
          typeof existingDoc.sertifikat === 'object'
            ? existingDoc.sertifikat?.id
            : existingDoc.sertifikat
        if (oldMediaId) {
          await payload
            .delete({ collection: 'media', id: oldMediaId })
            .catch((err) => payload.logger.error(`[Cleanup Error] Gagal hapus media lama: ${err}`))
        }
      } else {
        // C. Pakai file lama kalau user nggak upload file baru
        mediaId =
          typeof existingDoc.sertifikat === 'object'
            ? existingDoc.sertifikat?.id
            : existingDoc.sertifikat
      }

      await payload.update({
        collection: 'achievements',
        id: achievementId,
        data: {
          namaKejuaraan: formData.get('namaKejuaraan') as string,
          kategori: formData.get('kategori') as string,
          peringkat: (formData.get('peringkat') as any) || 'Juara 1',
          jenisKejuaraan: (formData.get('jenisKejuaraan') as any) || 'Open',
          tingkatKejuaraan: (formData.get('tingkatKejuaraan') as any) || 'Kabupaten/Kota',
          tanggalKejuaraan: formData.get('tanggalKejuaraan') as string,
          lokasiKejuaraan: formData.get('lokasiKejuaraan') as string,
          sertifikat: mediaId,
          status: 'pending', // Reset status
          catatanPenolakan: null, // Reset catatan admin
        },
      })

      revalidatePath('/dashboard')
      revalidatePath('/prestasi')
      return { success: true, message: 'Data berhasil diperbaiki dan diajukan ulang.' }
    } else {
      // ==========================================
      // CREATE MODE (NEW SUBMISSION)
      // ==========================================
      if (!hasNewFile) return { success: false, error: 'Sertifikat wajib diunggah.' }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const mediaDoc = await payload.create({
        collection: 'media',
        data: { owner: user.id, alt: `Sertifikat ${formData.get('namaKejuaraan')}` },
        file: { data: buffer, name: file.name, mimetype: file.type, size: file.size },
      })

      await payload.create({
        collection: 'achievements',
        data: {
          atlet: user.id,
          namaKejuaraan: formData.get('namaKejuaraan') as string,
          kategori: formData.get('kategori') as string,
          peringkat: (formData.get('peringkat') as any) || 'Juara 1',
          jenisKejuaraan: (formData.get('jenisKejuaraan') as any) || 'Open',
          tingkatKejuaraan: (formData.get('tingkatKejuaraan') as any) || 'Kabupaten/Kota',
          tanggalKejuaraan: formData.get('tanggalKejuaraan') as string,
          lokasiKejuaraan: formData.get('lokasiKejuaraan') as string,
          sertifikat: mediaDoc.id,
          status: 'pending',
        },
      })

      revalidatePath('/dashboard')
      revalidatePath('/prestasi')
      return { success: true, message: 'Prestasi berhasil diajukan untuk verifikasi.' }
    }
  } catch (error: any) {
    payload.logger.error(`[Mutation Error] User ${user.id} failed: ${error.message}`)
    return { success: false, error: 'Terjadi kesalahan internal server saat memproses data.' }
  }
}
