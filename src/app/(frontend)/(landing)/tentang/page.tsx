import { getPengurusList } from '@/app/api/getPayloadData'
import React from 'react'
import PengurusList from '../PengurusCarousel'

export default async function page() {
  const pengurus = await getPengurusList()
  // console.log('Pengurus :', pengurus)

  const divisi1 = pengurus.filter

  const pengurusInti = pengurus.filter((p) => p.divisi === 'Pengurus Inti')
  const divisiLatihan = pengurus.filter((p) => p.divisi === 'Divisi Latihan')
  const divisiHumas = pengurus.filter((p) => p.divisi === 'Divisi Humas')
  const divisiKrt = pengurus.filter((p) => p.divisi === 'Divisi KRT/UU')

  return (
    <>
      <section className="w-full bg-[#C5DDFF] ">
        <div className="w-full min-h-[372px] flex flex-col justify-center py-24 px-6 max-w-7xl mx-auto">
          <h1 className="font-bold text-[45px]">Tentang Kami</h1>
          <p>
            Mengenal lebih jauh tentang sejarah, visi misi, dan pengurus UKM Karate INKAI
            Universitas Negeri Yogyakarta.
          </p>
        </div>
      </section>
      {/* SEJARAH */}

      <section className="py-24 px-6 max-w-7xl mx-auto w-full min-h-screen flex flex-col items-center justify-start gap-15">
        <div className="w-[20rem] text-center">
          <h4 className="uppercase text-blue-500 font-normal text-base mb-2">- Sejarah -</h4>
          <h2 className="text-3xl font-bold text-blue-600">Perjalanan Panjang Menuju Prestasi</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Image Wrapper 1 */}
            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-md col-span-2">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                alt="Tentang Kami 1"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Image Wrapper 2 */}
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col gap-6  h-full">
            <p className="text-slate-600 leading-relaxed text-lg text-justify">
              Unit Kegiatan Mahasiswa Karate “INKAI” Universitas Negeri Yogyakarta merupakan salah
              satu UKM yang menampung bakat di bidang Karate. Karate masuk di Universitas Negeri
              Yogyakarta pada tanggal 3 Maret 1975, yang pada waktu itu masih bernama IKIP. <br />{' '}
              <br />
              UKM Karate “INKAI” Universitas Negeri Yogyakarta didirikan oleh Senpai Yahya Wilis AS,
              Irwansyah SY, Samsul Bakrie, dan Yudiono yang kemudian diikuti oleh para karateka
              lain. UKM ini terbentuk di Pantai Parangkusumo, pada pendiri melakukan perjalanan
              pulang dengan jalan kaki dari Pantai Parangkusumo menuju UNY. <br /> <br />
              UKM Karate “INKAI” UNY tidak hanya diikuti oleh mahasiswa, namun juga umum mulai dari
              anak-anak sampai dewasa diluar universitas yang dinaungi suatu lembaga pembinaan
              olahraga di Universitas Negeri Yogyakarta, yang disebut Selabora (Sekolah Laboratorium
              Olahraga)
            </p>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 max-w-7xl mx-auto w-full min-h-screen flex flex-col items-center justify-start gap-15 text-center">
        <div className="w-[20rem] ">
          <h4 className="uppercase text-blue-500 font-normal text-base mb-2">- lokasi -</h4>
          <h2 className="text-3xl font-bold text-blue-600">Alamat Kami</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 items-center">
          <h2 className="text-3xl font-bold text-black">GOR Beladiri UNY</h2>
          <p>
            69FP+7CH, Karang Malang, Caturtunggal, Depok, Sleman Regency, Special Region of
            Yogyakarta 55281
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.122782032506!2d110.3861139!3d-7.776803499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59c9a1bc4a43%3A0x2ca49ecd8efed3af!2sGOR%20Beladiri%20UNY!5e0!3m2!1sen!2sid!4v1782738365087!5m2!1sen!2sid"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </section>
      <section className="py-24 px-6 max-w-7xl mx-auto w-full min-h-screen flex flex-col items-center justify-start gap-15">
        <div className="w-[20rem] text-center">
          <h4 className="uppercase text-blue-500 font-normal text-base mb-2">- organisasi -</h4>
          <h2 className="text-3xl font-bold text-blue-600">Struktur Kepengurusan</h2>
        </div>
        <div className="w-full">
          <h3 className=" text-blue-500 font-semibold text-xl mb-10 text-center">
            - Pengurus Inti -
          </h3>
          <PengurusList data={pengurusInti} variant="grid" />
        </div>
        <div className="w-full">
          <h3 className=" text-blue-500 font-semibold text-xl mb-10 text-center">
            - Divisi Latihan -
          </h3>
          <PengurusList data={divisiLatihan} variant="grid" />
        </div>
        <div className="w-full">
          <h3 className=" text-blue-500 font-semibold text-xl mb-10 text-center">
            - Divisi Humas -
          </h3>
          <PengurusList data={divisiHumas} variant="grid" />
        </div>
        <div className="w-full">
          <h3 className=" text-blue-500 font-semibold text-xl mb-10 text-center">
            - Divisi KRT/UU -
          </h3>
          <PengurusList data={divisiKrt} variant="grid" />
        </div>
      </section>
    </>
  )
}
