import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'admin') {
    return redirect('/')
  }
  return (
    <>{children}</>
  )
}
