'use client'

import { jadwalLatihan } from '@/lib/jadwal'
import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// src/components/JadwalCarousel.tsx (atau file tempat data disimpan)
// 1. Data Source of Truth

// 2. Logic mapping dinamis (tidak perlu manual map lagi)
function getTodayScheduleIndex(): number {
  const day = new Date().getDay() // 0-6
  const index = jadwalLatihan.findIndex((item) => item.dayIndex === day)
  return index === -1 ? 0 : index
}

export default function JadwalCarousel() {
  const todayIndex = getTodayScheduleIndex()
  const todayId = jadwalLatihan[todayIndex]?.id ?? null
  const swiperRef = useRef<any>(null)

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(todayIndex, 0)
    }
  }, [todayIndex])

  return (
    <div className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-5 gap-y-2">
      {/* <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        centeredSlides={false}
        initialSlide={0}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
        }}
      > */}
      {jadwalLatihan.map((item) => (
        <div key={item.id} className="">
          <div
            className={`p-6 border rounded-xl transition-all ${
              todayId === item.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-200 bg-white opacity-70'
            }`}
          >
            <h3 className="font-bold text-lg">{item.hari}</h3>
            <p className="text-sm text-slate-600 mt-2">🕒 {item.waktu}</p>
            <p className="text-sm text-slate-600">📍 {item.lokasi}</p>
          </div>
        </div>
      ))}
      {/* </Swiper> */}
    </div>
  )
}
