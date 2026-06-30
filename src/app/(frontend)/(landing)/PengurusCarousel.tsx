'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'

type PengurusListProps = {
  data: any[]
  variant?: 'carousel' | 'grid' // [!] Props baru untuk menentukan layout
}

export default function PengurusList({ data, variant = 'carousel' }: PengurusListProps) {
  const swiperRef = useRef<any>(null)

  if (!data || data.length === 0) return null

  // Komponen Card yang reusable (didefinisikan di dalam sini atau dipisah ke file lain)
  const PengurusCard = ({ item }: { item: any }) => {
    const imageUrl = item?.foto?.sizes?.medium?.url || item?.foto?.url || '/fallback-avatar.png'
    return (
      <div className="flex flex-col items-center group cursor-pointer w-full">
        <div className="relative w-full max-w-[300px] aspect-[6/7] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow mx-auto">
          <Image
            fill
            src={imageUrl}
            alt={item?.nama || 'Pengurus'}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 25vw"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#98C3FF] to-transparent"></div>
          <div className="absolute bottom-4 left-0 w-full text-center px-2 z-10">
            <p className="text-white text-sm font-semibold">{item?.jabatan}</p>
            <h3 className="font-bold text-white text-lg">{item?.nama}</h3>
            <p className="text-white text-sm">{item?.jurusan}</p>
          </div>
        </div>
      </div>
    )
  }

  // Layout Grid (Non-Carousel)
  if (variant === 'grid') {
    return (
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {data.map((item, index) => (
          <div key={index} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
            <PengurusCard item={item} />
          </div>
        ))}
      </div>
    )
  }

  // Layout Carousel
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full pb-10"
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <PengurusCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="w-full flex justify-center gap-5">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
        >
          <ArrowBigLeftDash />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
        >
          <ArrowBigRightDash />
        </button>
      </div>
    </div>
  )
}
