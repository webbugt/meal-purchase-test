import { usePathname } from 'next/navigation'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { PropsWithChildren } from 'react'
import { NavigationMenuLink } from '../ui/navigation-menu'

const MenuLink = ({ href, ...props }: PropsWithChildren<NextLinkProps>) => {
  const pathname = usePathname()
  const isActive = href === pathname

  return (
    <NavigationMenuLink asChild active={isActive}>
      <NextLink href={href} className="NavigationMenuLink" {...props} />
    </NavigationMenuLink>
  )
}

export default MenuLink
