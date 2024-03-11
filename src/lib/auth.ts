import { AuthOptions, getServerSession as getServerSessionNative } from 'next-auth'

import Google from 'next-auth/providers/google'

import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/db'

// if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
//   throw new Error('GITHUB_ID and GITHUB_SECRET must be defined')
// }
if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  throw new Error('GOOGLE_ID and GOOGLE_SECRET must be defined')
}
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET
    // }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ]
}

export const getServerSession = () => getServerSessionNative(authOptions)
