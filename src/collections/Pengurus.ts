import { DIVISI_OPTIONS, JABATAN_OPTIONS } from '@/lib/utils'
import { CollectionConfig } from 'payload'

export const Pengurus: CollectionConfig = {
  slug: 'pengurus',
  admin: {
    // [!] FIX: Ubah ke 'nama' karena bidang 'judul' tidak eksis di skema ini
    useAsTitle: 'nama',
    hidden: ({ user }) => !['superadmin', 'admin'].includes(user?.role as string),
  },
  labels: {
    singular: 'Pengurus',
    plural: 'Pengurus', // Tetap gunakan 'Pengurus' karena dalam bahasa Indonesia tidak berubah
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
    update: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
    delete: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
  },
  hooks: {
    // [!] LIFECYCLE HOOKS FOR AUTO-POPULATE
    beforeValidate: [
      async ({ data, req }) => {
        // Jika admin memilih akun atlet terdaftar
        if (data?.atlet) {
          try {
            // Ambil data lengkap user/atlet dari database
            const userDoc = await req.payload.findByID({
              collection: 'users',
              id: data.atlet,
              depth: 1, // Pastikan relasi media/fotoProfil ikut ter-extract jika ada
            })

            if (userDoc) {
              // Kebijakan 1: Ambil nama otomatis HANYA jika kolom nama dikosongkan
              if (!data.nama) {
                data.nama = userDoc.namaLengkap || userDoc.email
              }

              // Kebijakan 2: Ambil foto profil otomatis HANYA jika kolom foto dikosongkan
              if (!data.foto && userDoc.fotoProfil) {
                // Pastikan kita hanya menyimpan ID media (Foreign Key)
                data.foto =
                  typeof userDoc.fotoProfil === 'object'
                    ? userDoc.fotoProfil.id
                    : userDoc.fotoProfil
              }
            }
          } catch (error: any) {
            req.payload.logger.error(
              `[Populate Error] Failed to fetch athlete data for Pengurus: ${error.message}`,
            )
          }
        }
        return data
      },
    ],
  },
  fields: [
    // [!] FIELD BARU: Relasi ke Koleksi Users (Khusus Atlet)
    {
      name: 'atlet',
      type: 'relationship',
      relationTo: 'users',
      required: false, // Opsional, agar tetap bisa input custom pengurus luar
      hasMany: false,
      admin: {
        sortOptions: 'namaLengkap',
        description:
          'Pilih jika pengurus merupakan Atlet terdaftar. Nama & Foto akan terisi otomatis jika dikosongkan.',
      },
      // Filter opsi agar hanya menampilkan user dengan role 'athlete'
      filterOptions: {
        role: { equals: 'athlete' },
      },
    },
    {
      name: 'nama',
      type: 'text',
      required: false,
      admin: {
        description: 'Biarkan kosong jika ingin mengambil nama otomatis dari akun Atlet di atas.',
      },
    },
    {
      type: 'row', // Mengelompokkan agar UI admin lebih rapi
      fields: [
        {
          name: 'divisi',
          type: 'select',
          required: true,
          options: DIVISI_OPTIONS,
        },
        {
          name: 'jabatan',
          type: 'select',
          required: true,
          options: JABATAN_OPTIONS,
        },
      ],
    },
    {
      name: 'jurusan',
      type: 'text',
      required: true,
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Biarkan kosong jika ingin mengambil foto profil dari akun Atlet di atas.',
      },
    },
  ],
}
