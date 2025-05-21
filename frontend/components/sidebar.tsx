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
  LogOut,
  TrendingUp,
  ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import Image from "next/image"

// 更新颜色为蓝色系列
const primaryColor = "text-blue-600"

// 受保护的路由（需要登录）
const protectedRoutes = [
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
    color: primaryColor,
  },
  {
    label: "Watch Data",
    icon: HeartPulse,
    href: "/watch-data",
    color: primaryColor,
  },
  {
    label: "Field Analysis",
    icon: Map,
    href: "/field-analysis",
    color: primaryColor,
  },
  {
    label: "Heatmap",
    icon: Activity,
    href: "/heatmap",
    color: primaryColor,
  },
  {
    label: "Training Suggestions",
    icon: TrendingUp,
    href: "/training-recommendations",
    color: primaryColor,
  },
  {
    label: "Training Logs",
    icon: ClipboardList,
    href: "/training-logs",
    color: primaryColor,
  },
  {
    label: "AI Assistant",
    icon: MessageSquare,
    href: "/assistant",
    color: primaryColor,
  },
]

// 公共路由（无需登录）
const publicRoutes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: primaryColor,
  },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // 检查用户是否已登录 - 从Cookie和localStorage两处获取
    const checkLoginStatus = () => {
      const userIdCookie = Cookies.get('userId');
      const userIdLocal = localStorage.getItem('userId');
      
      console.log("用户登录状态检查 - Cookie:", userIdCookie, "LocalStorage:", userIdLocal);
      
      // 如果任一来源有userId，则认为用户已登录
      setIsLoggedIn(!!(userIdCookie || userIdLocal));
    };
    
    // 初始检查
    checkLoginStatus();
    
    // 设置事件监听器，以便在其他页面登录/登出后更新状态
    window.addEventListener('storage', checkLoginStatus);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  // 登出处理函数
  const handleLogout = () => {
    // 清除本地存储的用户信息
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    
    // 删除cookie
    Cookies.remove('userId', { path: '/' })
    
    // 更新登录状态
    setIsLoggedIn(false)
    
    // 重定向到首页
    router.push('/')
  }
  
  // 根据登录状态动态确定显示的路由
  const routesToShow = isLoggedIn 
    ? [...publicRoutes, ...protectedRoutes]
    : publicRoutes

  // 用于调试 - 确认路由是否正确加载
  console.log("侧边栏状态 - 已登录:", isLoggedIn, "显示路由数量:", routesToShow.length);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-y-auto border-r bg-background p-4 pt-0 shadow-sm transition-all duration-300",
        collapsed ? "w-[80px]" : "w-60",
      )}
    >
      <div className="flex items-center justify-between py-4">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/SmartFootball.svg"
              alt="SmartFootball Logo"
              width={28}
              height={28}
              className="mr-1"
            />
            <h1 className="text-xl font-bold">SmartFootball</h1>
          </Link>
        ) : (
          <Link href="/" className="flex items-center justify-center w-full">
            <Image
              src="/images/SmartFootball.svg"
              alt="SmartFootball Logo"
              width={28}
              height={28}
            />
          </Link>
        )}
        <Button variant="ghost" size="icon" className={cn("ml-auto", collapsed && "w-full")} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </Button>
      </div>
      <div className="space-y-1 py-4">
        {routesToShow.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700",
              pathname === route.href ? "bg-blue-50 text-blue-700" : "transparent",
              collapsed ? "justify-center" : ""
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color, collapsed ? "mr-0" : "mr-3")} />
            {!collapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </div>
      <div className="mt-auto space-y-1 pt-4">
        {isLoggedIn ? (
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-blue-50 hover:text-blue-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 text-blue-600" />
            {!collapsed && <span>Logout</span>}
          </Button>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="group flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700"
            >
              <LogIn className="mr-3 h-5 w-5 text-blue-600" />
              {!collapsed && <span>Login</span>}
            </Link>
            <Link
              href="/auth/register"
              className="group flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700"
            >
              <UserPlus className="mr-3 h-5 w-5 text-blue-600" />
              {!collapsed && <span>Register</span>}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar
