// src/collections/Achievements.ts
import { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { calculatePoints } from '@/lib/points'

// 2. The Core Aggregation Engine
const syncAthletePoints = async (athleteId: string | number, req: any) => {
  try {
    const approvedAchievements = await req.payload.find({
      collection: 'achievements',
      where: {
        and: [{ atlet: { equals: athleteId } }, { status: { equals: 'approved' } }],
      },
      depth: 0,
      pagination: false,
      req, // [!] WAJIB: Wariskan konteks transaksi aktif agar tidak deadlock
    })

    const absoluteTotalPoints = approvedAchievements.docs.reduce((sum: number, doc: any) => {
      // Injeksi parameter ketiga (jenisKejuaraan)
      return sum + calculatePoints(doc.jenisKejuaraan, doc.tingkatKejuaraan, doc.peringkat)
    }, 0)

    await req.payload.update({
      collection: 'users',
      id: athleteId,
      data: { totalPoin: absoluteTotalPoints },
      req, // [!] WAJIB: Wariskan konteks transaksi aktif
    })

    req.payload.logger.info(
      `[Sync Execution] Absolute points for User ${athleteId} resolved to ${absoluteTotalPoints}`,
    )
  } catch (error: any) {
    req.payload.logger.error(
      `[Sync Error] Failed to compute points for User ${athleteId}: ${error.message}`,
    )
  }
}

// 3. The Triggers
const afterChangeSync: CollectionAfterChangeHook = async ({ doc, req }) => {
  const athleteId = typeof doc.atlet === 'object' ? doc.atlet.id : doc.atlet
  await syncAthletePoints(athleteId, req)
}

const afterDeleteSync: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const athleteId = typeof doc.atlet === 'object' ? doc.atlet.id : doc.atlet
  await syncAthletePoints(athleteId, req)
}

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    useAsTitle: 'namaKejuaraan',
    hidden: ({ user }) => user?.role !== 'superadmin',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => ['admin', 'superadmin'].includes(user?.role as string),
    delete: ({ req: { user } }) => ['admin', 'superadmin'].includes(user?.role as string),
  },
  hooks: {
    afterChange: [afterChangeSync],
    afterDelete: [afterDeleteSync],
  },
  fields: [
    {
      name: 'atlet',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      access: { update: () => false },
    },
    { name: 'namaKejuaraan', type: 'text', required: true },
    { name: 'kategori', type: 'text', required: true },

    // [!] Field Baru Terinjeksi
    {
      name: 'jenisKejuaraan',
      type: 'select',
      options: ['Open', 'Festival'],
      required: true,
      defaultValue: 'Open',
    },

    {
      name: 'peringkat',
      type: 'select',
      options: ['Juara 1', 'Juara 2', 'Juara 3'],
      required: true,
    },
    {
      name: 'tingkatKejuaraan',
      type: 'select',
      required: true,
      options: ['Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'],
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
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
    {
      name: 'catatanPenolakan',
      type: 'textarea',
      admin: { condition: (data) => data.status === 'rejected' },
    },
  ],
}
