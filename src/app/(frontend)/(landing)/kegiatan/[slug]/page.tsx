import KontenDetail from '@/app/(frontend)/components/KontenDetail'
import { getKontenBySlug } from '@/app/api/getPayloadData'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function DetailKontenPage({ params }: PageProps) {
  const { slug } = await params
  const konten = await getKontenBySlug(slug)
  if (!konten) return notFound()

  return <KontenDetail konten={konten} />
}
