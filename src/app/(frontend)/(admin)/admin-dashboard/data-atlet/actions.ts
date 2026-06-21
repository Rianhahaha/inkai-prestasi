// src/app/(frontend)/(admin)/data-atlet/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function submitAthleteAction(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const user = await getCurrentUser()

    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      return { success: false, error: 'Otorisasi ditolak.' }
    }

    // 1. [!] THE FIX: Strict Type Parsing untuk ID
    const idString = formData.get('id') as string | null
    const isEdit = Boolean(idString)

    // Jika string ID adalah angka valid, konversi ke Number untuk Postgres.
    // Jika tidak (misal UUID), biarkan sebagai string.
    const validId = isEdit && !isNaN(Number(idString)) ? Number(idString) : idString

    const submittedEmail = formData.get('email') as string

    const rawData: any = {
      namaLengkap: formData.get('namaLengkap') || null,
      tempatLahir: formData.get('tempatLahir') || null,
      tanggalLahir: formData.get('tanggalLahir') || null,
      nomorTelepon: formData.get('nomorTelepon') || null,
      sabuk: formData.get('sabuk') || 'Putih',
      role: 'athlete',
    }

    if (isEdit) {
      // Gunakan validId (Number) agar Payload tidak salah mengecualikan dokumen ini
      const currentUser = await payload.findByID({
        collection: 'users',
        id: validId as string | number,
        depth: 0,
      })

      const currentEmail = (currentUser.email || '').toLowerCase().trim()
      if (currentEmail !== submittedEmail) {
        rawData.email = submittedEmail
      }

      await payload.update({
        collection: 'users',
        id: validId as string | number, // [!] Gunakan Number ID
        data: rawData,
      })
    } else {
      rawData.email = submittedEmail.trim().toLowerCase()
      const password = formData.get('password') as string

      if (!password || password.length < 6) {
        return { success: false, error: 'Password minimal 6 karakter.' }
      }
      rawData.password = password

      await payload.create({
        collection: 'users',
        data: rawData,
      })
    }

    revalidatePath('/admin-dashboard/data-atlet')
    return {
      success: true,
      message: isEdit ? 'Data atlet diperbarui.' : 'Atlet berhasil ditambahkan.',
    }
  } catch (error: any) {
    // [!] LOG ABSOLUT: Tampilkan wujud asli error di terminal Next.js
    console.error('\n[CRASH MUTASI ATLET] ===========================')
    console.error(error)
    console.error('==============================================\n')

    const errMsg = error.message?.toLowerCase() || ''

    // Pengecekan spesifik untuk Postgres Unique Constraint
    if (errMsg.includes('duplicate key') || errMsg.includes('unique constraint')) {
      return { success: false, error: 'Email tersebut sudah terdaftar di sistem.' }
    }

    // Biarkan UI menampilkan pesan error aslinya agar kita tahu apa yang salah
    return { success: false, error: `Sistem menolak: ${error.message}` }
  }
}
