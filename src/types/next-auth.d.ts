/* eslint-disable no-unused-vars */
import { Session } from 'next-auth'

declare module 'next-auth' {

  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: User
  }
}
