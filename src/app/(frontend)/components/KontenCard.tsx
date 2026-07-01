// src/app/(frontend)/components/KontenCard.tsx
import { formatDate } from '@/lib/utils'
import { CalendarDays, ImageIcon, MapPin, Edit } from 'lucide-react'
import Image from 'next/image'
// import { getMediaUrl } from '@/lib/utils'

interface KontenCardProps {
  item: any
  adminBasePath?: string // '/superadmin' | '/admin' — flexible per role
  detailBasePath?: string
  admin?: boolean
}

export default function KontenCard({
  item,
  adminBasePath = '/superadmin',
  detailBasePath = '/kegiatan',
  admin = false,
}: KontenCardProps) {
  const getMediaUrl = (mediaField: any): string | null => {
    if (typeof mediaField === 'object' && mediaField !== null && 'url' in mediaField) {
      return mediaField.url as string
    }
    return null
  }
  const thumbnailUrl = getMediaUrl(item.thumbnail)

  console.log(item)
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
      {/* Thumbnail */}
      <div className="relative h-48 bg-slate-100 w-full shrink-0 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <Image
            width={200}
            height={200}
            src={thumbnailUrl}
            alt={item.judul}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-300" />
        )}
        <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded">
          {item.kategori}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-800 text-[16px] leading-snug line-clamp-2 mb-3">
          {item.judul}
        </h3>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">
              {formatDate(item.tanggalMulai) || ''} - {formatDate(item.tanggalSelesai) || ''}{' '}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{item.lokasi || '-'}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-3 mb-5 flex-grow">{item.ringkasan}</p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <a
            href={`${detailBasePath}/${admin ? item.id : item.slug}`}
            className="text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors inline-block hover:underline"
          >
            Lihat detail
          </a>
          {admin && (
            <a
              href={`${adminBasePath}/collections/konten/${item.id}`}
              className="text-white text-sm font-semibold transition-colors flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              Edit
              <Edit className="size-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
