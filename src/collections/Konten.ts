// src/collections/Konten.ts
import { CollectionConfig } from 'payload'

export const Konten: CollectionConfig = {
  slug: 'konten',
  admin: {
    useAsTitle: 'judul',
    // UI Visibility: Hanya admin dan superadmin yang bisa melihat menu ini
    hidden: ({ user }) => !['superadmin', 'admin'].includes(user?.role as string),
  },
  access: {
    // API Security: Siapa saja (termasuk publik/atlet) bisa membaca konten
    read: () => true,
    // API Security: Hanya role berwenang yang bisa manipulasi
    create: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
    update: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
    delete: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
  },
  fields: [
    {
      name: 'judul',
      type: 'text',
      required: true,
    },
    {
      name: 'ringkasan',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Muncul sebagai deskripsi singkat di card UI.',
      },
    },
    {
      name: 'kategori',
      type: 'select',
      options: ['Kejuaraan', 'Pengumuman', 'Berita', 'Lainnya'],
      required: true,
    },
    {
      name: 'tanggalPelaksanaan',
      type: 'text',
      admin: { description: 'Contoh: 28-30 Agustus 2026' },
    },
    {
      name: 'lokasi',
      type: 'text',
      admin: { description: 'Contoh: GOR Amongrogo' },
    },
    {
      name: 'thumbnail',
      type: 'upload', // Berubah dari relationship ke upload untuk direct integration
      relationTo: 'media',
      required: true,
    },
    {
      name: 'isiKonten',
      type: 'richText', // Lexical editor bawaan Payload
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'published',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
