// src/app/(frontend)/(admin)/data-atlet/[id]/page.tsx

import { ArrowBigLeftDash, Edit } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { getKontenById, getKontenData } from '@/app/api/getPayloadData'
import KontenDetail from '@/app/(frontend)/components/KontenDetail'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}
export default async function DetailKontenPage({ params }: PageProps) {
  const resolvedParams = await params
  const kontenId = resolvedParams.id

  const konten = await getKontenById(kontenId)

  if (!konten) return notFound()

  return (
    <>
      {/* admin header */}
      <div className="w-full shadow-sm flex justify-between py-4 px-8 border items-center border-slate-200 rounded-2xl ">
        <div className="flex gap-2 items-center">
          <Link
            href="/dashboard/konten/"
            className="border border-transparent rounded-xl hover:border-blue-200 size-10 flex justify-center items-center transition-all"
          >
            <ArrowBigLeftDash />
          </Link>
          <div>
            <h1 className="text-lg font-semibold mb-2">{konten.judul} (preview)</h1>
            <div className="text-xs text-slate-600">
              <b>Terakhir diubah: </b>
              <span>{formatDate(konten.updatedAt)}</span>
            </div>
          </div>
        </div>
        <a
          href={`superadmin/collections/konten/${konten.id}`}
          className="text-white text-sm font-semibold transition-colors flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Edit
          <Edit className="size-4" />
        </a>
      </div>

      <div className="border border-slate-300 my-5 rounded-2xl overflow-hidden">
        <KontenDetail konten={konten} />
      </div>
    </>
  )
}
