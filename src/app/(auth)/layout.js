import Unauthorized from '@/components/pages/Unauthorized'
import { AppSidebar } from '@/components/sidebar/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({ children }) {
  const incomingHeaders = headers()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
    headers: {
      cookie: incomingHeaders.get('cookie') ?? '',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    return redirect('/login')
  }

  const user = await res.json()
  if (user.role === 'su' || user.role === '') {
    return <Unauthorized />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
