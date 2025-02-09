import { Sidebar } from "@/components/common/sidebar"
import { solanaRoutes } from "@/config/routes/solana"

export default function SolanaLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
        <Sidebar routes={solanaRoutes} />
      </div>
      <main className="md:pl-72">
        {children}
      </main>
    </div>
  )
} 