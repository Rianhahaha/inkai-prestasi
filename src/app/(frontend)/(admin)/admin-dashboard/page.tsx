// src/app/(admin)/admin-dashboard/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { Clock, Trophy, User2 } from 'lucide-react'
import RecentActivity from './RecentActivity'

export default async function AdminDashboardPage() {
  const payload = await getPayload({ config })
  const pendingAchievements = await payload.find({
    collection: 'achievements',
    where: {
      status: { equals: 'pending' },
    },
    depth: 2,
    sort: 'createdAt', // FIFO (First In First Out)
  })
  const totalAchievements = await payload.find({
    collection: 'achievements',
    depth: 2,
    sort: 'createdAt', // FIFO (First In First Out)
  })
  const atlet = await payload.find({
    collection: 'users',
    where: {
      role: { equals: 'athlete' },
    },
    depth: 2,
  })

  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="font-medium text-[32px]">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          {/* Cards */}
          <div className="card-outline flex gap-5 items-stretch">
            <div className=" bg-blue-500/20 text-blue-500 p-4 rounded-full flex items-center justify-center">
              <User2 className="size-10" />
            </div>
            <div className="flex flex-col justify-between text-[20px]">
              <span className="card-title mb-0!">Total Atlet</span>
              <div>
                <span className="font-bold text-[27px]">{atlet.totalDocs} </span>
                <span>Atlet </span>
              </div>
            </div>
          </div>

          <div className="card-outline flex gap-5 items-stretch">
            <div className=" bg-green-500/20 text-green-500 p-4 rounded-full flex items-center justify-center">
              <Trophy className="size-10" />
            </div>
            <div className="flex flex-col justify-between text-[20px]">
              <span className="card-title mb-0!">Total Prestasi</span>
              <div>
                <span className="font-bold text-[27px]">{totalAchievements.totalDocs} </span>
                <span>Atlet </span>
              </div>
            </div>
          </div>

          <div className="card-outline flex gap-5 items-stretch">
            <div className=" bg-yellow-500/20 text-yellow-500 p-4 rounded-full flex items-center justify-center">
              <Clock className="size-10" />
            </div>
            <div className="flex flex-col justify-between text-[20px]">
              <span className="card-title mb-0!">Pending</span>
              <div>
                <span className="font-bold text-[27px]">{pendingAchievements.totalDocs} </span>
                <span>Atlet </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 mt-6">
        <RecentActivity />
      </div>
    </>
  )
}
