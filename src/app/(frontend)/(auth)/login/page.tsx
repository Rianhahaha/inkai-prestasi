// src/app/login/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GoogleLogin } from '@react-oauth/google' // [!] Import diaktifkan

export default function CustomLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false) // ... [state deklarasi Anda tetap sama] ...
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Hit Payload's native authentication endpoint directly
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials')
      }
      // 2. Role-Based Routing
      if (data.user.role === 'admin') {
        router.push('/admin-dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // [!] Google Handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })

      const data = await res.json()

      if (data.success) {
        // Backend yang memutuskan rute, Frontend hanya mengeksekusi
        window.location.href = data.redirectUrl
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung dengan server otentikasi Google.')
      setIsLoading(false)
    }
  }

  return (
    <div className="h-auto flex items-center justify-center w-full">
      <div className="bg-white w-full max-w-7xl ">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleLocalLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-normal mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-normal mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        {/* Separator UI */}
        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 font-medium">Atau masuk dengan</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* [!] Eksekusi Komponen Google */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Koneksi otentikasi Google dibatalkan.')}
            theme="outline" // Opsional: "filled_black" atau "outline"
            shape="rectangular" // Membuat tombol membulat (rounded-full)
            text="continue_with" // Mengubah teks standar
            // width="300"
          />
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
            Daftar
          </Link>
        </div>
      </div>
    </div>
  )
}
