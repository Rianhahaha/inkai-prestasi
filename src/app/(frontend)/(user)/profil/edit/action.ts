// src/app/(user)/profil/edit/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: 'Otorisasi ditolak. Sesi tidak valid.' }
    }

    // 1. Extract mutable profile fields.
    // strictly omitting 'totalPoin' and 'role' to prevent data manipulation.
    const rawData: any = {
      namaLengkap: formData.get('namaLengkap') as string,
      tempatLahir: formData.get('tempatLahir') as string,
      tanggalLahir: formData.get('tanggalLahir') || null, // Failsafe for empty strings
      nomorTelepon: formData.get('nomorTelepon') as string,
      sabuk: formData.get('sabuk') as string,
    }

    // 2. Email Dirty Checking Logic
    const submittedEmail = ((formData.get('email') as string) || '').toLowerCase().trim()
    const currentEmail = (user.email || '').toLowerCase().trim()

    if (currentEmail !== submittedEmail) {
      rawData.email = submittedEmail
    }

    // 3. Conditional Password Override
    const passwordInput = formData.get('password') as string
    if (passwordInput && passwordInput.trim() !== '') {
      if (passwordInput.length < 6) {
        return { success: false, error: 'Password baru minimal 6 karakter.' }
      }
      rawData.password = passwordInput
    }

    const profileFile = formData.get('fotoProfilFile') as File | null
    if (profileFile && profileFile.size > 0) {
      try {
        const arrayBuffer = await profileFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `Avatar Manual ${user.namaLengkap}`, // [!] Variabel user sekarang valid dan utuh
            owner: user.id,
          },
          file: {
            data: buffer,
            name: profileFile.name,
            size: profileFile.size,
            mimetype: profileFile.type,
          },
        })

        // Timpa fotoProfil dengan ID Media yang baru
        rawData.fotoProfil = mediaDoc.id
      } catch (uploadError) {
        console.error('[Upload Custom Avatar Error]', uploadError)
        return { success: false, error: 'Gagal mengunggah foto profil baru.' }
      }
    }

    // 4. Execute absolute mutation
    await payload.update({
      collection: 'users',
      id: user.id,
      data: rawData,
    })

    revalidatePath('/profil')
    revalidatePath('/profil/edit')

    return { success: true, message: 'Profil berhasil diperbarui.' }
  } catch (error: any) {
    const errMsg = error.message?.toLowerCase() || ''

    // Intercept PostgreSQL unique constraint violations for emails
    if (
      errMsg.includes('duplicate key') ||
      errMsg.includes('unique constraint') ||
      errMsg.includes('email')
    ) {
      return { success: false, error: 'Email tersebut sudah digunakan oleh akun lain.' }
    }

    return { success: false, error: error.message || 'Gagal memperbarui profil.' }
  }
}
