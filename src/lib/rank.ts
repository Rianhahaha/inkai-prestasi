// src/lib/rank.ts
import { Payload } from 'payload'

export async function getAthleteRank(
  payload: Payload,
  points: number,
): Promise<number | 'Unranked'> {
  // Jika 0 poin, jangan lakukan query, langsung return 'Unranked'
  if (points <= 0) return 'Unranked'

  // Query berapa orang yang punya poin lebih tinggi
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      and: [{ role: { equals: 'athlete' } }, { totalPoin: { greater_than: points } }],
    },
  })

  return totalDocs + 1
}
