"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Activity,
  BarChart,
  ChevronsLeft,
  ChevronsRight,
  HeartPulse,
  Home,
  LogIn,
  Map,
  MessageSquare,
  UserCircle,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
    color: "text-violet-500",
  },
  {
    label: "Watch Data",
    icon: HeartPulse,
    href: "/watch-data",
    color: "text-pink-500",
  },
  {
    label: "Field Analysis",
    icon: Map,
    href: "/field-analysis",
    color: "text-orange-500",
  },
  {
    label: "Heatmap",
    icon: Activity,
    href: "/heatmap",
    color: "text-emerald-500",
  },
  {
    label: "Training Recommendations",
    icon: BarChart,
    href: "/training-recommendations",
    color: "text-green-500",
  },
  {
    label: "Training Logs",
    icon: BarChart,
    href: "/training-logs",
    color: "text-blue-500",
  },
  {
    label: "AI Assistant",
    icon: MessageSquare,
    href: "/assistant",
    color: "text-yellow-500",
  },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-y-auto border-r bg-background p-4 pt-0 shadow-sm transition-all duration-300",
        collapsed ? "w-[80px]" : "w-60",
      )}
    >
      <div className="flex items-center justify-between py-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">SmartFootball</h1>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </Button>
      </div>
      <div className="space-y-1 py-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === route.href ? "bg-accent" : "transparent",
            )}
          >
            <route.icon className={cn("mr-3 h-5 w-5", route.color)} />
            {!collapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </div>
      <div className="mt-auto space-y-1 pt-4">
        <Link
          href="/auth/login"
          className="group flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <LogIn className="mr-3 h-5 w-5 text-gray-500" />
          {!collapsed && <span>Login</span>}
        </Link>
        <Link
          href="/auth/register"
          className="group flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <UserPlus className="mr-3 h-5 w-5 text-gray-500" />
          {!collapsed && <span>Register</span>}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
