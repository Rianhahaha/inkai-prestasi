// src/app/(frontend)/components/Podium.tsx
import { StarIcon, User2 } from 'lucide-react'
import type { User } from '@/payload-types'
interface AthleteDoc {
  id: string
  namaLengkap: string
  totalPoin?: number
  fotoProfil?: { url?: string } | null
}

interface PodiumCardProps {
  athlete: User
  rank: 1 | 2 | 3
}

const RANK_CONFIG = {
  1: {
    starColor: 'fill-amber-400',
    pointColor: 'text-amber-500',
    textSize: 'text-2xl',
    nameSize: 'text-xl',
    containerClass: 'bg-amber-50 border-amber-200 w-72 h-full z-10 pt-12',
  },
  2: {
    starColor: 'fill-slate-400',
    pointColor: 'text-slate-400',
    textSize: 'text-xl',
    nameSize: 'text-lg',
    containerClass: 'bg-slate-50 border-slate-200 w-64 h-[80%] pt-10',
  },
  3: {
    starColor: 'fill-orange-400',
    pointColor: 'text-orange-500',
    textSize: 'text-xl',
    nameSize: 'text-lg',
    containerClass: 'bg-orange-50 border-orange-200 w-64 h-[70%] pt-10',
  },
}

function PodiumCard({ athlete, rank }: PodiumCardProps) {
  const config = RANK_CONFIG[rank]
  const avatarUrl =
    typeof athlete.fotoProfil === 'object' && athlete.fotoProfil?.url
      ? athlete.fotoProfil.url
      : null

  return (
    <div
      className={`flex flex-col items-center border rounded-t-3xl p-6 relative ${config.containerClass}`}
    >
      {/* Star Badge */}
      <div className="absolute -top-10 text-white size-20 flex items-center justify-center font-bold text-2xl">
        <div className="relative size-full">
          <StarIcon
            className={`absolute stroke-0 size-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${config.starColor}`}
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            {rank}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 bg-amber-100 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={athlete.namaLengkap} className="w-full h-full object-cover" />
        ) : (
          <User2 className="w-10 h-10 text-amber-400" />
        )}
      </div>

      <h3 className={`font-bold text-center truncate w-full ${config.nameSize}`}>
        {athlete.namaLengkap}
      </h3>
      <p className={`font-bold mt-1 ${config.pointColor} ${config.textSize}`}>
        {athlete.totalPoin ?? 0} poin
      </p>
    </div>
  )
}

interface PodiumProps {
  top3: User[]
}

export default function Podium({ top3 }: PodiumProps) {
  const [rank1, rank2, rank3] = top3

  return (
    <div className="flex justify-center items-end gap-4 mt-8 mb-4 h-[300px]">
      {rank2 && <PodiumCard athlete={rank2} rank={2} />}
      {rank1 && <PodiumCard athlete={rank1} rank={1} />}
      {rank3 && <PodiumCard athlete={rank3} rank={3} />}
    </div>
  )
}
