// src/lib/fetchers/pengurus.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { Where } from 'payload'
export async function getPengurusList() {
  const payload = await getPayload({ config })
  try {
    const data = await payload.find({
      collection: 'pengurus',
      depth: 1, // Agar relasi media/foto ter-resolve otomatis
      sort: 'divisi', // Urutkan berdasarkan divisi
      limit: 100, // Sesuaikan dengan kebutuhan organisasi
    })

    return data.docs
  } catch (error) {
    console.error('[Fetcher Error] Gagal mengambil data pengurus:', error)
    return []
  }
}

interface FetchLeaderboardParams {
  page?: number
  limit?: number
  search?: string
}

export async function getLeaderboardData({ page, limit, search }: FetchLeaderboardParams) {
  const payload = await getPayload({ config })

  // 1. Build Query
  const queryWhere: any = {
    role: { equals: 'athlete' },
  }

  if (search) {
    queryWhere.namaLengkap = { contains: search }
  }

  try {
    // 2. Parallel Fetching
    const [podiumData, tableData, globalRanking] = await Promise.all([
      // Query A: Top 3 Podium
      payload.find({
        collection: 'users',
        where: { role: { equals: 'athlete' } },
        sort: '-totalPoin',
        limit: 3,
        depth: 1,
      }),
      // Query B: Paginated Table Data
      payload.find({
        collection: 'users',
        where: queryWhere,
        sort: '-totalPoin',
        page: page,
        limit: limit,
        depth: 1,
      }),
      // Query C: Global Ranking for Absolute Rank Mapping
      payload.find({
        collection: 'users',
        where: { role: { equals: 'athlete' } },
        sort: '-totalPoin',
        limit: 0, // Fetch all
        depth: 0,
        select: { totalPoin: true }, // Optimization: Only fetch points
      }),
    ])

    // 3. Build Rank Map: { [userId]: rank }
    const rankMap = new Map<number | string, number>(
      globalRanking.docs.map((doc, index) => [doc.id, index + 1]),
    )

    // 4. Enriched Table Docs with Absolute Rank
    const enrichedDocs = tableData.docs.map((doc, index) => ({
      ...doc,
      absoluteRank:
        rankMap.get(doc.id as number | string) ?? ((page || 0) - 1) * (limit || 0) + index + 1,
    }))

    return {
      top3: podiumData.docs,
      tableDocs: enrichedDocs,
      pagination: {
        totalPages: tableData.totalPages,
        hasNextPage: tableData.hasNextPage,
        hasPrevPage: tableData.hasPrevPage,
        nextPage: tableData.nextPage,
        prevPage: tableData.prevPage,
      },
    }
  } catch (error) {
    console.error('[Fetcher Error] Failed to fetch leaderboard:', error)
    return {
      top3: [],
      tableDocs: [],
      pagination: { totalPages: 1, hasNextPage: false, hasPrevPage: false },
    }
  }
}

interface GetKontenParams {
  status?: 'published' | 'draft'
  search?: string
  page?: number
  limit?: number
}

export async function getKontenData({
  status = 'published',
  search = '',
  page = 1,
  limit = 9,
}: GetKontenParams) {
  const payload = await getPayload({ config })

  const where: Where = {
    and: [{ status: { equals: status } }],
  }

  if (search) {
    where.and!.push({ judul: { contains: search } })
  }

  try {
    const data = await payload.find({
      collection: 'konten',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 1,
    })

    return {
      docs: data.docs,
      pagination: {
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        nextPage: data.nextPage,
        prevPage: data.prevPage,
      },
    }
  } catch (error) {
    console.error('[Fetcher Error] Gagal mengambil data konten:', error)
    return {
      docs: [],
      pagination: { totalPages: 1, hasNextPage: false, hasPrevPage: false },
    }
  }
}

// src/lib/fetchers/konten.ts — tambahkan function ini

export async function getKontenById(id: string) {
  const payload = await getPayload({ config })

  try {
    const data = await payload.findByID({
      collection: 'konten',
      id,
      depth: 1,
    })

    return data
  } catch (error) {
    console.error('[Fetcher Error] Gagal mengambil detail konten:', error)
    return null
  }
}
