// src/app/register/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    tempatLahir: '',
    tanggalLahir: '',
    nomorTelepon: '',
    jenisKelamin: 'Laki-laki',
    sabuk: 'Putih',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Dynamic state mutator for clean code
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 1. Execute Create User Mutation
      const submitData: any = {
        ...formData,
        role: 'athlete',
        totalPoin: 0,
      }

      if (!submitData.tanggalLahir) {
        delete submitData.tanggalLahir
      }

      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData), // Pass the sanitized object
      })

      const createData = await createRes.json()

      if (!createRes.ok) {
        throw new Error(createData.errors?.[0]?.message || 'Registrasi gagal.')
      }

      // 2. Execute Silent Auto-Login
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!loginRes.ok) {
        throw new Error('Akun berhasil dibuat, namun auto-login gagal. Silakan login manual.')
      }

      // 3. Dispatch to User Route
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-auto flex items-center justify-center w-full">
      <div className="bg-white w-full max-w-7xl ">
        <h2 className="text-2xl font-bold mb-8 text-slate-800">Daftar Akun</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Full Width Field */}
          <div>
            <label className="block text-sm font-normal text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-slate-700 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                name="nomorTelepon"
                value={formData.nomorTelepon}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-slate-700 mb-1">Sabuk</label>
              <select
                name="sabuk"
                value={formData.sabuk}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Putih">Putih</option>
                <option value="Kuning">Kuning</option>
                <option value="Hijau">Hijau</option>
                <option value="Biru">Biru</option>
                <option value="Coklat">Coklat</option>
                <option value="Hitam">Hitam</option>
              </select>
            </div>
          </div>

          {/* Radio Buttons */}
          <div>
            <label className="block text-sm font-normal text-slate-700 mb-2">Jenis Kelamin</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="Perempuan"
                  checked={formData.jenisKelamin === 'Perempuan'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                Perempuan
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="Laki-laki"
                  checked={formData.jenisKelamin === 'Laki-laki'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                Laki-laki
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 font-normal transition-colors mt-2 disabled:opacity-70"
          >
            {isLoading ? 'Memproses...' : 'Daftar Akun'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun? <br /> Masuk dengan email atau Google di{' '}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-normal hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
