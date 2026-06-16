// src/collections/Achievements.ts
import { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const calculatePoints = (peringkat: string, tingkat: string): number => {
  const pointMatrix: Record<string, Record<string, number>> = {
    Kecamatan: { 'Juara 1': 10, 'Juara 2': 8, 'Juara 3': 5 },
    'Kabupaten/Kota': { 'Juara 1': 20, 'Juara 2': 15, 'Juara 3': 10 },
    Provinsi: { 'Juara 1': 40, 'Juara 2': 30, 'Juara 3': 20 },
    Nasional: { 'Juara 1': 80, 'Juara 2': 60, 'Juara 3': 40 },
    Internasional: { 'Juara 1': 160, 'Juara 2': 120, 'Juara 3': 80 },
  }
  return pointMatrix[tingkat]?.[peringkat] || 0
}

// 1. The Core Aggregation Engine
// [!] Ubah parameter kedua untuk menerima seluruh objek `req`
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
      return sum + calculatePoints(doc.peringkat, doc.tingkatKejuaraan)
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

// 2. The Triggers
const afterChangeSync: CollectionAfterChangeHook = async ({ doc, req }) => {
  const athleteId = typeof doc.atlet === 'object' ? doc.atlet.id : doc.atlet
  // Lempar seluruh objek `req`
  await syncAthletePoints(athleteId, req)
}

const afterDeleteSync: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const athleteId = typeof doc.atlet === 'object' ? doc.atlet.id : doc.atlet
  // Lempar seluruh objek `req`
  await syncAthletePoints(athleteId, req)
}

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    useAsTitle: 'namaKejuaraan',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => ['admin', 'superadmin'].includes(user?.role as string),
    delete: ({ req: { user } }) => ['admin', 'superadmin'].includes(user?.role as string),
  },

  // [!] Daftarkan kedua trigger hook di sini
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
