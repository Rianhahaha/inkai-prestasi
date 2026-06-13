// src/app/(frontend)/auth/actions.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  // PayloadCMS default cookie name is 'payload-token'
  // Force delete the httpOnly cookie from the server
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  // Redirect to login page and terminate the current route cache
  redirect('/login')
}
