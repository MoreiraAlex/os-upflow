import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { HomeIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { SidebarUserInfo } from './SidebarUserInfo'
import { Logo } from '@/components/image/logo'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="pt-4">
        <Logo width={200} height={80} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operação</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/order">
                  <UsersIcon className="w-4 h-4" />
                  <span>Ordens de Serviço</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserInfo />
      </SidebarFooter>
    </Sidebar>
  )
}
