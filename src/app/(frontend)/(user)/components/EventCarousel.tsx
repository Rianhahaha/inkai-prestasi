'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Clock, LocationEdit } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function EventCarousel({ events }: { events: any[] }) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      //   pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      className="w-full h-full"
    >
      {events.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="w-full bg-blue-500/20 rounded-xl p-6 flex flex-col md:flex-row gap-6">
            <div className="shrink-0 w-full md:w-48 h-48 rounded-xl overflow-hidden bg-slate-200">
              {typeof item.thumbnail === 'object' && item.thumbnail?.url ? (
                <img
                  src={item.thumbnail.url}
                  alt={item.judul}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 text-sm flex-1">
              <div className="card-title text-lg">{item.judul}</div>
              <div className="flex flex-col justify-between h-full gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-start">
                    <Clock className="w-5 shrink-0" /> <span>{formatDate(item.tanggalMulai)}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <LocationEdit className="w-5 shrink-0" /> <span>{item.lokasi || 'TBA'}</span>
                  </div>
                </div>
                <button className="bg-blue-500 px-6 py-2 rounded-xl text-white font-bold w-fit">
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
