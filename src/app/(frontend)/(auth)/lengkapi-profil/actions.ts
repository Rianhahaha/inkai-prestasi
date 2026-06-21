// src/app/lengkapi-profil/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth' // [!] Gunakan utilitas satu pintu

export async function completeProfileAction(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })

    // 1. Native Bypass Authentication Strategy (DRY Principle)
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.',
      }
    }

    const userId = user.id as number
    const userProviders = (user.authProvider || []) as ('local' | 'google')[]

    // 2. Sanitasi data dasar onboarding
    const rawData: any = {
      tempatLahir: formData.get('tempatLahir') as string,
      tanggalLahir: formData.get('tanggalLahir') || null,
      nomorTelepon: formData.get('nomorTelepon') as string,
      jenisKelamin: formData.get('jenisKelamin') as string,
      sabuk: formData.get('sabuk') as string,
    }

    // 3. INTERSEPTOR MEDIA UPLOAD
    const profileFile = formData.get('fotoProfilFile') as File | null
    if (profileFile && profileFile.size > 0) {
      try {
        const arrayBuffer = await profileFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `Avatar Manual ${user.namaLengkap}`, // [!] Variabel user sekarang valid dan utuh
            owner: userId,
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

    // 4. Akses Pintu Kedua (Optional Password Setup)
    const passwordInput = formData.get('password') as string
    if (passwordInput && passwordInput.trim() !== '') {
      if (passwordInput.length < 6) {
        return { success: false, error: 'Password lokal minimal 6 karakter.' }
      }
      rawData.password = passwordInput

      if (!userProviders.includes('local')) {
        rawData.authProvider = [...userProviders, 'local']
      }
    }

    // 5. Mutasi data absolut
    await payload.update({
      collection: 'users',
      id: userId,
      data: rawData,
    })

    // Runtuhkan cache rute utama
    revalidatePath('/dashboard')
    revalidatePath('/profil')

    return { success: true, message: 'Profil berhasil dilengkapi.' }
  } catch (error: any) {
    console.error('[ACTION DB CRASH]', error)
    return { success: false, error: error.message || 'Gagal menyimpan data onboarding.' }
  }
}
