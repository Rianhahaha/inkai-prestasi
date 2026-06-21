// src/collections/Users.ts
import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useSessions: true,
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  admin: {
    useAsTitle: 'namaLengkap',
    hidden: ({ user }) => user?.role !== 'superadmin',
  },
  access: {
    // 1. Absolute Barrier for Payload Native UI
    // Hanya mengeksekusi return true jika role adalah superadmin
    admin: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
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
      name: 'googleId',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'ID identitas absolut dari sistem Google OAuth.',
      },
    },
    {
      name: 'authProvider',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Local (Password)', value: 'local' },
        { label: 'Google OAuth', value: 'google' },
      ],
      hooks: {
        beforeChange: [
          ({ value }) => {
            // Jika saat mutasi nilainya kosong, paksa simpan sebagai ['local']
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return ['local']
            }
            return value
          },
        ],
      },
      defaultValue: ['local'],
    },
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
    {
      name: 'fotoProfil',
      type: 'relationship',
      relationTo: 'media', // Pastikan slug koleksi media Anda sesuai
      admin: {
        description: 'Referensi ke koleksi media untuk foto profil atlet.',
      },
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
