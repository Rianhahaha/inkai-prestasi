// src/app/(admin)/admin-dashboard/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function verifyAchievement(
  achievementId: string | number,
  status: 'approved' | 'rejected',
  catatanPenolakan?: string,
) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const user = await getCurrentUser()

  // 1. Otorisasi Ketat: Hanya admin/superadmin yang berhak mengeksekusi ini
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return { success: false, error: 'Unauthorized action.' }
  }

  try {
    // 2. Eksekusi Mutasi Status
    await payload.update({
      collection: 'achievements',
      id: achievementId,
      data: {
        status: status,
        ...(status === 'rejected' && catatanPenolakan ? { catatanPenolakan } : {}),
      },
    })

    // Catatan: Jika status 'approved', hook `afterChange` di Payload
    // akan secara otomatis mengkalkulasi dan menambahkan poin ke Atlet.

    // 3. Invalidasi Cache
    revalidatePath('/admin-dashboard')

    return { success: true, message: `Prestasi berhasil di-${status}.` }
  } catch (error: any) {
    payload.logger.error(
      `[Verification Error] Admin ${user.id} failed to verify achievement ${achievementId}: ${error.message}`,
    )
    return { success: false, error: 'Gagal memproses verifikasi.' }
  }
}
