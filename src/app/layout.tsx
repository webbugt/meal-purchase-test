import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import NextAuthProvider from '@/components/next-auth-provider'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession()
  console.log('layout session', session)
  if (!session) {
    return redirect('/api/auth/signin')
  }
  return (
    <html lang="en">
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
