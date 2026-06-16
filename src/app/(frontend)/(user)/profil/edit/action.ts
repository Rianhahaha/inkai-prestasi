// src/app/(user)/profil/edit/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return { success: false, error: 'Otorisasi ditolak. Sesi tidak valid.' }
    }

    // Ekstrak data yang diizinkan untuk diubah
    const rawData = {
      namaLengkap: formData.get('namaLengkap') as string,
      tempatLahir: formData.get('tempatLahir') as string,
      tanggalLahir: formData.get('tanggalLahir') as string,
      nomorTelepon: formData.get('nomorTelepon') as string,
    }

    // Eksekusi mutasi absolut
    await payload.update({
      collection: 'users',
      id: user.id,
      data: rawData,
    })

    // Runtuhkan cache halaman profil agar data baru langsung tampil
    revalidatePath('/profil')
    revalidatePath('/profil/edit')

    return { success: true, message: 'Profil berhasil diperbarui.' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal memperbarui profil.' }
  }
}
