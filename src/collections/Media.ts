// src/collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    hidden: ({ user }) => !['superadmin', 'admin'].includes(user?.role as string),
    // [!] UI VISIBILITY INTERCEPTOR
    // Hanya memfilter tampilan di Dashboard Payload, tidak memblokir API Fetching
    baseListFilter: ({ req }) => {
      const user = req.user

      // Jika yang login adalah admin konten, sembunyikan file milik atlet
      if (user?.role === 'admin') {
        return {
          'owner.role': {
            in: ['superadmin', 'admin'],
          },
        }
      }

      // Superadmin melihat seluruh media di database tanpa filter
      return null
    },
  },
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        // Injeksi otomatis ID uploader secara aman
        if (req.user && data && !data.owner) {
          data.owner = req.user.id
        }
        return data
      },
    ],
  },
  access: {
    // [!] API SECURITY LAYER
    // Wajib Publik: Jika tidak, Next.js tidak akan bisa merender <img src="...">
    read: () => true,

    // Write Access Control
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
    delete: ({ req: { user } }) => ['superadmin', 'admin'].includes(user?.role as string),
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: { update: () => false },
      admin: { hidden: true },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
