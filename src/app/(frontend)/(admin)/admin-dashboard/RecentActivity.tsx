// src/app/(frontend)/(admin)/admin-dashboard/RecentActivity.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Trophy, CheckCircle, XCircle, UserPlus } from 'lucide-react'
import { formatDateTime, formatRelativeTime } from '@/lib/utils' // Sesuaikan path

// 1. Define standard interface for unified logs
interface NormalizedLog {
  id: string
  type:
    | 'achievement_pending'
    | 'achievement_approved'
    | 'achievement_rejected'
    | 'user_athlete'
    | 'user_admin'
  actorName: string
  actionText: string
  detailText: string
  timestamp: string
  timestampMs: number
}

export default async function RecentActivity() {
  const payload = await getPayload({ config })

  // 2. Parallel fetching for performance (limit 5 per collection is enough for a top-5 merged list)
  const [usersRes, achievementsRes] = await Promise.all([
    payload.find({
      collection: 'users',
      sort: '-createdAt', // Ambil user terbaru
      limit: 5,
      depth: 0,
    }),
    payload.find({
      collection: 'achievements',
      sort: '-updatedAt', // Gunakan updatedAt agar status tolak/setuju ikut ter-capture
      limit: 5,
      depth: 1, // Depth 1 untuk mengambil nama atlet
    }),
  ])

  // 3. Normalize User Data
  const userLogs: NormalizedLog[] = usersRes.docs.map((user: any) => ({
    id: `user-${user.id}`,
    type: user.role === 'admin' ? 'user_admin' : 'user_athlete',
    actorName: user.namaLengkap || user.email,
    actionText: user.role === 'admin' ? 'didaftarkan sebagai Admin' : 'mendaftar sebagai Atlet',
    detailText: user.role === 'admin' ? 'Sistem Manajemen' : `Sabuk: ${user.sabuk || '-'}`,
    timestamp: user.createdAt,
    timestampMs: new Date(user.createdAt).getTime(),
  }))

  // 4. Normalize Achievement Data
  const achievementLogs: NormalizedLog[] = achievementsRes.docs.map((ach: any) => {
    let type: NormalizedLog['type'] = 'achievement_pending'
    let actionText = 'mengajukan prestasi'

    if (ach.status === 'approved') {
      type = 'achievement_approved'
      actionText = 'prestasi diverifikasi'
    } else if (ach.status === 'rejected') {
      type = 'achievement_rejected'
      actionText = 'prestasi ditolak'
    }

    return {
      id: `ach-${ach.id}`,
      type,
      actorName: ach.atlet?.namaLengkap || 'Atlet',
      actionText,
      detailText: `${ach.peringkat} ${ach.namaKejuaraan}`,
      timestamp: ach.updatedAt,
      timestampMs: new Date(ach.updatedAt).getTime(),
    }
  })

  // 5. Merge, Sort by exact time descending, and slice top 5
  const combinedLogs = [...userLogs, ...achievementLogs]
    .sort((a, b) => b.timestampMs - a.timestampMs)
    .slice(0, 5)

  // 6. Visual Dictionary for styling mapping
  const styleMap: Record<NormalizedLog['type'], { icon: any; bgClass: string; iconClass: string }> =
    {
      achievement_pending: { icon: Trophy, bgClass: 'bg-[#fef9c3]', iconClass: 'text-[#eab308]' }, // Yellow soft
      achievement_approved: {
        icon: CheckCircle,
        bgClass: 'bg-[#dcfce7]',
        iconClass: 'text-[#22c55e]',
      }, // Green soft
      achievement_rejected: { icon: XCircle, bgClass: 'bg-[#fee2e2]', iconClass: 'text-[#ef4444]' }, // Red soft
      user_athlete: { icon: UserPlus, bgClass: 'bg-[#e0f2fe]', iconClass: 'text-[#38bdf8]' }, // Sky blue soft
      user_admin: { icon: UserPlus, bgClass: 'bg-[#f1f5f9]', iconClass: 'text-[#64748b]' }, // Slate soft
    }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden px-10 pb-15">
      <div className="px-6 py-5 border-b border-slate-300">
        <h2 className="font-bold text-slate-800 text-[18px]">Aktivitas Terbaru</h2>
      </div>

      <div className="flex flex-col">
        {combinedLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Belum ada aktivitas.</div>
        ) : (
          combinedLogs.map((log, index) => {
            const visual = styleMap[log.type]
            const Icon = visual.icon

            return (
              <div
                key={log.id}
                className={`flex gap-4 p-5 hover:bg-slate-200 border-b border-slate-300 `}
              >
                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${visual.bgClass}`}
                >
                  <Icon className={`w-6 h-6 ${visual.iconClass}`} />
                </div>

                {/* Content Container */}
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-[15px] text-slate-700">
                    <span className="font-bold text-slate-900">{log.actorName}</span>{' '}
                    {log.actionText}
                  </div>
                  <div className="text-[13px] text-slate-500 font-medium">{log.detailText}</div>
                  <div className="text-[12px] text-slate-400 mt-0.5">
                    {formatRelativeTime(log.timestamp)} - {formatDateTime(log.timestamp)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
