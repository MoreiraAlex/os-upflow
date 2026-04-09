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
import {
  ClipboardCheck,
  Contact,
  HomeIcon,
  MessageSquare,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { SidebarUserInfo } from './SidebarUserInfo'
import { Logo } from '@/components/image/logo'
import { headers } from 'next/headers'

export async function AppSidebar() {
  const incomingHeaders = headers()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
    headers: {
      cookie: incomingHeaders.get('cookie') ?? '',
    },
    cache: 'no-store',
  })
  const user = await res.json()

  return (
    <Sidebar>
      <SidebarHeader className="pt-4">
        <Link href="/">
          <Logo width={200} height={80} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  <span>Visão Geral</span>
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
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Ordens de Serviço</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>WhatsApp</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contact">
                    <Contact className="w-4 h-4" />
                    <span>Acessos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/message">
                    <MessageSquare className="w-4 h-4" />
                    <span>Conversas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserInfo />
      </SidebarFooter>
    </Sidebar>
  )
}
