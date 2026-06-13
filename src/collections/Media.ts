// src/collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Only admins or the owner can read the file
    read: ({ req: { user } }) => {
      // Tolak akses jika tidak ada sesi
      if (!user) return false

      // Bypass mutlak untuk administrator
      if (user.role === 'superadmin' || user.role === 'admin') return true

      // Fallback ke Query Constraint:
      // "Hanya kembalikan record di mana kolom 'owner' sama dengan ID saya"
      return {
        owner: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  upload: {
    disableLocalStorage: true, // WAJIB: Mencegah Payload mencoba menulis ke disk lokal server
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
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
