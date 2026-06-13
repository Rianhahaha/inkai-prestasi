// src/components/AthleteStatsGrid.tsx
import React from 'react'

// Mendefinisikan kontrak data yang diterima komponen
interface AthleteStatsGridProps {
  totalPoin: number
  totalPrestasi: number
  sabuk: string
}

export function AthleteStatsGrid({ totalPoin, totalPrestasi, sabuk }: AthleteStatsGridProps) {
  // Mapping array untuk menghindari duplikasi struktur HTML Tailwind
  // Catatan: Class Tailwind ditulis secara absolut untuk mencegah masalah Purge/JIT compiler
  const stats = [
    {
      id: 'poin',
      label: 'Total Poin',
      value: totalPoin || 0,
      unit: 'poin',
      icon: '🎖️',
      bgClass: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'prestasi',
      label: 'Total Prestasi',
      value: totalPrestasi || 0,
      unit: 'prestasi',
      icon: '🏆',
      bgClass: 'bg-green-50 text-green-600',
    },
    {
      id: 'sabuk',
      label: 'Sabuk',
      value: sabuk || 'Putih',
      unit: '',
      icon: '🥋',
      bgClass: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${stat.bgClass}`}
          >
            {stat.icon}
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-800">
              {stat.value}{' '}
              {stat.unit && <span className="text-sm font-normal text-slate-500">{stat.unit}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
