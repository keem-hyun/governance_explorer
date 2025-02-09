"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Route = {
  label: string
  href: string
}

interface SidebarProps {
  routes: ReadonlyArray<Route>
}

export function Sidebar({ routes }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors
                ${pathname === route.href 
                  ? "bg-white/10 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 