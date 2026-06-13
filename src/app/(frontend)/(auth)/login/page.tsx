// src/app/login/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { GoogleLogin } from '@react-oauth/google'; // Asumsi Anda menggunakan library ini untuk UI tombol Google

export default function CustomLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 1. Traditional Local Authentication
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

  // 3. Google OAuth Authentication Trigger
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true)
    try {
      // Hit our custom Route Handler
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })

      const data = await res.json()

      if (data.success) {
        // Untuk OAuth, kita arahkan secara absolut sesuai response server,
        // atau kita ubah logic Route Handler sebelumnya untuk mengembalikan role user.
        // Untuk amannya, arahkan ke root dispatcher atau dashboard user secara default.
        window.location.href = data.redirectUrl
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login UKM Karate</h2>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleLocalLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          {/* Implementasi tombol Google OAuth */}
          {/* <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Auth Failed')} /> */}
          <button
            onClick={() => alert('Trigger Google OAuth Flow')}
            className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  )
}
