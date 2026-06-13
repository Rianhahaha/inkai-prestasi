// src/collections/Achievements.ts
import { CollectionConfig, CollectionAfterChangeHook } from 'payload'

const calculatePoints = (peringkat: string, tingkat: string): number => {
  const basePoints: Record<string, number> = {
    'Juara 1': 30,
    'Juara 2': 20,
    'Juara 3': 10,
  }

  const multipliers: Record<string, number> = {
    'Kabupaten/Kota': 1,
    Provinsi: 2,
    Nasional: 3,
    Internasional: 5,
  }

  const base = basePoints[peringkat] || 0
  const multiplier = multipliers[tingkat] || 1
  return base * multiplier
}

// 2. The Idempotent Hook
const pointMutationHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req: { payload },
}) => {
  // Gatekeeper: Only trigger on updates where status transitions exactly to 'approved'
  if (operation === 'update' && doc.status === 'approved' && previousDoc.status !== 'approved') {
    const pointsToAdd = calculatePoints(doc.peringkat, doc.tingkatKejuaraan)

    // Resolve relation ID (Payload might populate it, so we ensure we get the string ID)
    const athleteId = typeof doc.atlet === 'object' ? doc.atlet.id : doc.atlet

    try {
      // Fetch the current user state to calculate the new total
      const user = await payload.findByID({
        collection: 'users',
        id: athleteId,
      })

      const currentPoints = user.totalPoin || 0

      // Execute atomic update on the User entity
      await payload.update({
        collection: 'users',
        id: athleteId,
        data: {
          totalPoin: currentPoints + pointsToAdd,
        },
      })

      payload.logger.info(`[Hook Execution] Injected ${pointsToAdd} points to User ${athleteId}`)
    } catch (error: any) {
      payload.logger.error(
        `[Hook Error] Failed to update points for User ${athleteId}: ${error.message}`,
      )
    }
  }
}

export const Achievements: CollectionConfig = {
  slug: 'achievements',

  admin: {
    useAsTitle: 'namaKejuaraan',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    // Ganti logika upate dan delete menggunakan pengecekan array
    update: ({ req: { user } }) => ['admin', 'superadmin'].includes(user?.role as string),
    delete: ({ req: { user } }) => ['admin', 'superadmin'].includes(user?.role as string),
  },
  hooks: {
    afterChange: [pointMutationHook],
  },
  fields: [
    {
      name: 'atlet',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      access: {
        update: () => false, // Prevent re-assigning owner after creation.
      },
    },
    { name: 'namaKejuaraan', type: 'text', required: true },
    { name: 'kategori', type: 'text', required: true },
    {
      name: 'peringkat',
      type: 'select',
      options: ['Juara 1', 'Juara 2', 'Juara 3'],
      required: true,
    },
    {
      name: 'tingkatKejuaraan',
      type: 'select',
      options: ['Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'],
      required: true,
    },
    { name: 'tanggalKejuaraan', type: 'date', required: true },
    { name: 'lokasiKejuaraan', type: 'text' },
    {
      name: 'sertifikat',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'approved', 'rejected'],
      defaultValue: 'pending',
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'catatanPenolakan',
      type: 'textarea',
      admin: {
        condition: (data) => data.status === 'rejected',
      },
    },
  ],
}
