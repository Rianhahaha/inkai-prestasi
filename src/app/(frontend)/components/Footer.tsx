import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#4285F4] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand & Address */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
              IN
            </div>
            <span className="font-bold text-lg">INKAI UNY</span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            Gedung Student Center Lt. 2<br />
            Universitas Negeri Yogyakarta
            <br />
            Karang Malang, Yogyakarta
          </p>
        </div>

        {/* Links Group 1 */}
        <div>
          <h4 className="font-semibold mb-4">Navigasi</h4>
          <ul className="flex flex-col gap-2 text-sm text-blue-100">
            <li>
              <Link href="/" className="hover:text-white">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="#tentang" className="hover:text-white">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="#kegiatan" className="hover:text-white">
                Kegiatan
              </Link>
            </li>
            <li>
              <Link href="#leaderboard" className="hover:text-white">
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Group 2 */}
        <div>
          <h4 className="font-semibold mb-4">Bantuan</h4>
          <ul className="flex flex-col gap-2 text-sm text-blue-100">
            <li>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/panduan" className="hover:text-white">
                Panduan Pendaftaran
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Kontak</h4>
          <ul className="flex flex-col gap-2 text-sm text-blue-100">
            <li>+62 812 3456 7890</li>
            <li>inkai@student.uny.ac.id</li>
            <li>@inkaiuny</li>
          </ul>
        </div>
      </div>
      <hr />

      <div className="max-w-7xl mx-auto px-6 pt-8  text-left text-sm text-blue-200">
        &copy; {new Date().getFullYear()} UKM Karate INKAI Universitas Negeri Yogyakarta.
      </div>
    </footer>
  )
}
