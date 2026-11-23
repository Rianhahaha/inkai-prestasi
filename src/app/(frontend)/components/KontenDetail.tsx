// src/app/(frontend)/components/KontenDetail.tsx
'use client'
import { formatDate } from '@/lib/utils'
import { ArrowBigLeftDash } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getEventStatus } from '@/lib/getEventStatus'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface KontenDetailProps {
  konten: any
}

export default function KontenDetail({ konten }: KontenDetailProps) {
  const pathname = usePathname()

  let isAdmin = pathname.startsWith('/admin-dashboard/konten/detail/')

  // Handle both Payload media object and static string path
  const thumbnail = typeof konten.thumbnail === 'object' && konten.thumbnail?.url 
    ? konten.thumbnail.url 
    : typeof konten.thumbnail === 'string' 
      ? konten.thumbnail 
      : null

  // Handle both Lexical rich text and plain HTML string
  const isLexical = konten.isiKonten && typeof konten.isiKonten === 'object' && 'root' in konten.isiKonten

  // Safe date formatting
  const safeFormatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '-'
    try {
      return formatDate(dateStr)
    } catch {
      return '-'
    }
  }

  return (
    <>
      <section className="w-full bg-[#C5DDFF] ">
        <div className="w-full min-h-[372px] flex flex-col gap-5 justify-center py-18 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-5">
            {!isAdmin && (
              <Link
                href="/kegiatan#konten-section"
                className="border border-transparent rounded-xl hover:border-blue-200 size-10 flex justify-center items-center transition-all"
              >
                <ArrowBigLeftDash />
              </Link>
            )}
            <div className="px-8 py-1 bg-white rounded-md text-sm font-semibold">
              {konten.kategori}
            </div>
            <div className="px-8 py-1 bg-white rounded-md text-sm font-semibold">
              {getEventStatus(konten?.tanggalMulai || '', konten.tanggalSelesai || '')}
            </div>
          </div>
          <h1 className="font-bold text-[45px]">{konten.judul}</h1>
          <p className="text-sm font-bold">Published: {safeFormatDate(konten?.publishedAt)}</p>
          <div className="text-sm font-bold w-fit">
            {safeFormatDate(konten?.tanggalMulai)} - {safeFormatDate(konten?.tanggalSelesai)}
          </div>
        </div>
      </section>
      <section className="py-10 px-6 max-w-7xl mx-auto">
        {thumbnail && (
          <Image
            width={100}
            height={100}
            className="rounded-xl w-full mb-10"
            src={thumbnail}
            alt={konten.judul}
          />
        )}

        {isLexical ? (
          <RichText data={konten.isiKonten} />
        ) : (
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: konten.isiKonten || '' }}
          />
        )}
      </section>
    </>
  )
}