'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useEffect, useRef } from 'react'
import { jadwalLatihan } from '@/lib/jadwal'

const WEEKDAY_TO_SCHEDULE_ID: Record<number, number> = {
  1: 1, // Senin
  2: 2, // Selasa
  3: 3, // Rabu
  4: 4, // Kamis
  5: 5, // Jumat
}

function getTodayScheduleIndex(): number {
  const day = new Date().getDay()
  const scheduleId = WEEKDAY_TO_SCHEDULE_ID[day]
  if (!scheduleId) return 0
  const index = jadwalLatihan.findIndex((item) => item.id === scheduleId)
  return index === -1 ? 0 : index
}

export default function JadwalCarousel() {
  const todayIndex = getTodayScheduleIndex()
  const todayId = jadwalLatihan[todayIndex]?.id ?? null
  const swiperRef = useRef<any>(null)

  useEffect(() => {
    // Slide ke hari ini setelah mount untuk avoid hydration mismatch
    swiperRef.current?.slideTo(todayIndex, 0)
  }, [todayIndex])

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        centeredSlides={false}
        initialSlide={0}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
        }}
      >
        {jadwalLatihan.map((item) => (
          <SwiperSlide key={item.id} className="py-5">
            <div
              className={`p-6 border rounded-xl transition-all ${
                todayId === item.id
                  ? 'border-blue-500 bg-blue-50  shadow-lg'
                  : 'border-slate-200 bg-white opacity-70'
              }`}
            >
              <h3 className="font-bold text-lg">{item.hari}</h3>
              <p className="text-sm text-slate-600 mt-2">🕒 {item.waktu}</p>
              <p className="text-sm text-slate-600">📍 {item.lokasi}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
