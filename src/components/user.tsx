'use client'

import { cn } from '@/lib/utils'
import {
  signIn, signOut,
  useSession
} from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

type UserCardProps = {
  className?: string;
};
export const UserCard = ({ className }: UserCardProps) => {
  const { data: session } = useSession()
  const user = session?.user
  const name = user?.name ? user.name : 'Anonymous User'
  const fallbackName = name.split(' ').map((n) => n[0]).join('')
  return (
    <div className={cn(className, 'flex-row')}>
        <Avatar>
            {user?.image ? <AvatarImage src={user?.image} alt="@shadcn" /> : null}
            <AvatarFallback>{fallbackName}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
            <h1 className="text-xl font-bold">{name}</h1>
        </div>
        {<Button className="ml-3" onClick={user ? () => { signOut() } : () => { signIn() } }>Sign {user ? 'Out' : 'In'}</Button>}
    </div>
  )
}
