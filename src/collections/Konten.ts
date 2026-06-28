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
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const isPublishing = data.status === 'published' && originalDoc?.status !== 'published'

        if (isPublishing) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
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
      options: ['Kegiatan', 'Kejuaraan', 'Ujian', 'Pelatihan', 'Pengumuman', 'Berita', 'Lainnya'],
      required: true,
    },
    // {
    //   name: 'tanggalPelaksanaan',
    //   type: 'text',
    //   admin: { description: 'Contoh: 28-30 Agustus 2026' },
    // },
    {
      name: 'tanggalMulai',
      type: 'date',
      admin: {
        description: 'Tanggal mulai pelaksanaan kegiatan.',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMMM yyyy' },
        position: 'sidebar',
      },
    },
    {
      name: 'tanggalSelesai',
      type: 'date',
      admin: {
        description: 'Kosongkan jika kegiatan hanya satu hari.',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMMM yyyy' },
        position: 'sidebar',
        condition: (data) => Boolean(data?.tanggalMulai),
      },
      validate: (value, { data }) => {
        const d = data as { tanggalMulai?: string }
        if (!value) return true
        if (!d?.tanggalMulai) return 'Isi tanggal mulai terlebih dahulu.'
        if (new Date(value as unknown as string) < new Date(d.tanggalMulai)) {
          return 'Tanggal selesai tidak boleh sebelum tanggal mulai.'
        }
        return true
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true, // Admin tidak bisa manual edit
        description: 'Otomatis diisi saat status dipublikasikan.',
        condition: (data) => Boolean(data?.publishedAt), // Hide jika masih null
      },
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
