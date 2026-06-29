import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Achievements } from './collections/Achievements'
import BackToDashboard from './components/BackToDashboard'
import { s3Storage } from '@payloadcms/storage-s3'
import { Konten } from './collections/Konten'
import { Pengurus } from './collections/Pengurus'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/superadmin',
  },
  admin: {
    user: Users.slug,
    components: {
      beforeNavLinks: ['./components/BackToDashboard'],
    },
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Achievements, Konten, Pengurus],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        // Cukup nyatakan 'true' pada key yang sesuai dengan slug koleksi Media Anda
        media: true,
      },
      bucket: process.env.SUPABASE_S3_BUCKET as string,
      config: {
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY as string,
        },
        region: process.env.SUPABASE_S3_REGION as string,
        endpoint: process.env.SUPABASE_S3_ENDPOINT as string,
        forcePathStyle: true, // Tetap WAJIB untuk Supabase S3
      },
    }),
  ],
})
