import React from 'react'

export default function page() {
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
            <p className="text-slate-600 leading-relaxed text-lg">
              {` Unit Kegiatan Mahasiswa Karate “INKAI” Universitas Negeri Yogyakarta merupakan salah
              satu UKM yang menampung bakat di bidang Karate. Karate masuk di Universitas Negeri
              Yogyakarta pada tanggal 3 Maret 1975, yang pada waktu itu masih bernama IKIP.
               UKM Karate “INKAI” Universitas Negeri Yogyakarta didirikan oleh Senpai Yahya Wilis AS,
              Irwansyah SY, Samsul Bakrie, dan Yudiono yang kemudian diikuti oleh para karateka
              lain. UKM ini terbentuk di Pantai Parangkusumo, pada pendiri melakukan perjalanan
              pulang dengan jalan kaki dari Pantai Parangkusumo menuju UNY. 
              UKM Karate “INKAI” UNY
              tidak hanya diikuti oleh mahasiswa, namun juga umum mulai dari anak-anak sampai dewasa
              diluar universitas yang dinaungi suatu lembaga pembinaan olahraga di Universitas
              Negeri Yogyakarta, yang disebut Selabora (Sekolah Laboratorium Olahraga).`}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.151652411653!2d110.38292307483135!3d-7.773738977117686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59b3fe486afd%3A0xbdc9314940646b96!2sUNY%20Hotel!5e0!3m2!1sen!2sid!4v1782657319413!5m2!1sen!2sid"
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
          <div className="w-full flex flex-wrap gap-6 justify-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center group cursor-pointer">
                {/* Image Wrapper */}
                <div className="relative w-[200px] h-[250px] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={`https://i.pravatar.cc/300?img=${item + 10}`}
                    alt="Pengurus"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Gradient Overlay at bottom for text readability if needed */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/80 to-transparent"></div>

                  {/* Name/Role Overlay inside image wrapper based on mockup */}
                  <div className="absolute bottom-4 left-0 w-full text-center px-2">
                    <h3 className="font-bold text-white text-sm">Nama Pengurus</h3>
                    <p className="text-blue-200 text-xs">Jabatan Organisasi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full">
          <h3 className=" text-blue-500 font-semibold text-xl mb-10 text-center">
            - Divisi Latihan -
          </h3>
          <div className="w-full flex flex-wrap gap-6 justify-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center group cursor-pointer">
                {/* Image Wrapper */}
                <div className="relative w-[200px] h-[250px] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={`https://i.pravatar.cc/300?img=${item + 10}`}
                    alt="Pengurus"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Gradient Overlay at bottom for text readability if needed */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/80 to-transparent"></div>

                  {/* Name/Role Overlay inside image wrapper based on mockup */}
                  <div className="absolute bottom-4 left-0 w-full text-center px-2">
                    <h3 className="font-bold text-white text-sm">Nama Pengurus</h3>
                    <p className="text-blue-200 text-xs">Jabatan Organisasi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
