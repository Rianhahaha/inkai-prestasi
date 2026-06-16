// src/collections/Users.ts
import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'namaLengkap',
    hidden: ({ user }) => !['admin', 'superadmin'].includes(user?.role as string),
  },
  access: {
    // 1. Absolute Barrier for Payload Native UI
    // Hanya mengeksekusi return true jika role adalah superadmin
    admin: ({ req: { user } }) => user?.role === 'superadmin',

    // ... [Pertahankan properti read, create, update, delete Anda sebelumnya di bawah sini] ...
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user }, id }) => {
      if (user?.role === 'superadmin') return true
      if (user?.id === id) return true
      if (user?.role === 'admin') return { role: { equals: 'athlete' } }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'superadmin') return true
      if (user?.role === 'admin') return { role: { equals: 'athlete' } }
      return false
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['superadmin', 'admin', 'athlete'],
      defaultValue: 'athlete',
      required: true,
      access: {
        // Kunci level field: Hanya superadmin yang boleh memanipulasi jabatan
        update: ({ req: { user } }) => user?.role === 'superadmin',
        create: ({ req: { user } }) => user?.role === 'superadmin',
      },
    },
    {
      name: 'namaLengkap',
      type: 'text',
      required: true,
      defaultValue: 'Super Admin',
    },
    { name: 'tempatLahir', type: 'text' },
    { name: 'tanggalLahir', type: 'date' },
    {
      name: 'jenisKelamin',
      type: 'select',
      options: ['Laki-laki', 'Perempuan'],
    },
    { name: 'nomorTelepon', type: 'text' },
    {
      name: 'sabuk',
      type: 'select',
      defaultValue: 'Putih',
      options: [
        'Putih',
        'Kuning',
        'Hijau',
        'Biru',
        'Coklat Kyu 1',
        'Coklat Kyu 2',
        'Coklat Kyu 3',
        'Hitam Dan 1',
        'Hitam Dan 2',
        'Hitam Dan 3',
        'Hitam Dan 4',
        'Hitam Dan 5',
      ],
    },
    {
      name: 'totalPoin',
      type: 'number',
      defaultValue: 0,
      access: {
        update: () => false, // Immutable via standard API updates.
      },
    },
  ],
}
