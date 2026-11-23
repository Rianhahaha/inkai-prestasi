import KontenDetail from '@/app/(frontend)/components/KontenDetail'
import { getKontenBySlugStatic } from '@/lib/static-data'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { dummyKonten } = await import('@/data/dummy-data')
  return dummyKonten.map(k => ({ slug: k.slug }))
}

export default async function DetailKontenPage({ params }: PageProps) {
  const { slug } = await params
  const konten = await getKontenBySlugStatic(slug)
  if (!konten) return notFound()

  return <KontenDetail konten={konten} />
}