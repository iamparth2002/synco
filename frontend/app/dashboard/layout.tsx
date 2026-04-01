import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { StoreProvider } from "@/context/store"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <StoreProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {children}
          </main>
        </SidebarProvider>
      </StoreProvider>
    </ProtectedRoute>
  )
}
