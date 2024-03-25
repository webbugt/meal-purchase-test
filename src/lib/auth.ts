// import { getServerSession as getServerSessionNative } from 'next-auth/next'
import { AuthOptions } from 'next-auth'

import Google from 'next-auth/providers/google'

import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/db'

// if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
//   throw new Error('GITHUB_ID and GITHUB_SECRET must be defined')
// }
if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  throw new Error('GOOGLE_ID and GOOGLE_SECRET must be defined')
}

const defaultAdmins = process.env.NEXTAUTH_ADMIN_EMAILS?.split(',') ?? []
const shouldBeAdmin = (email:string) => {
  console.log(email, defaultAdmins)
  return defaultAdmins.includes(email)
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET
    // }),
    Google({
      profile (profile:any) {
        return {
          role: (shouldBeAdmin(profile.email) && 'admin') || (profile.role ?? 'guest'),
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database'
  },

  callbacks: {
    session ({ session, user }) {
      if (typeof session.user === 'undefined') return session
      session.user.role = user.role
      return session
    }
  }
}
