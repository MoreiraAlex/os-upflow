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
  const user = session.user

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
            <Badge variant="secondary" className="ml-2">
              {/* #ToDo - Buscar a role do usuario */}
              Admin
            </Badge>
          </span>
          {/* #ToDo - Buscar a workshop do usuario */}
          <span className="text-gray-500">Oficina</span>
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
