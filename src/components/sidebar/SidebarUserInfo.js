import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Logout from '@/components/button/logout'
import { DropdownMenuItemClient } from '@/components/Dropdown/DropdownMenuItemClient'

export async function SidebarUserInfo() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  const incomingHeaders = headers()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
    headers: {
      cookie: incomingHeaders.get('cookie') ?? '',
    },
    cache: 'no-store',
  })
  const user = await res.json()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center w-full gap-3 hover:bg-secondary rounded-md p-2">
        <Avatar className="w-10 h-10">
          <AvatarFallback>
            {user.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm justify-start items-start">
          <span className="font-medium">
            {user.username}

            {user.role && (
              <Badge variant="secondary" className="ml-2">
                {user.role}
              </Badge>
            )}
          </span>
          <span className="text-gray-500">
            {user.workshop.name || 'Oficina'}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItemClient />
        <DropdownMenuItem>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
