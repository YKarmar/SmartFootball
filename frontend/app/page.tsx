"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, Map, MessageSquare, BarChart, LogIn, UserPlus, TrendingUp, Trophy, Heart, LineChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import Image from "next/image"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // 检查用户是否已登录 - 从Cookie和localStorage两处获取
    const checkLoginStatus = () => {
      const userIdCookie = Cookies.get('userId');
      const userIdLocal = localStorage.getItem('userId');
      
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
  }, [])
  
  return (
    <div className="space-y-6">
      {!isLoggedIn ? (
        <>
          {/* 英雄区域 */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700/90 to-indigo-500/70 z-10"></div>
            <div className="relative bg-gradient-to-br from-slate-300 to-slate-600 h-[350px]">
              <div className="container mx-auto px-6 relative z-20 flex flex-col h-full justify-center">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Elevate Your Football Training
                  </h2>
                  <p className="text-lg text-white/90 mb-8">
                    Get personalized insights, AI-powered recommendations, and track your progress
                    with our comprehensive football analytics platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-white text-slate-700 hover:bg-white/90 font-bold">
                      <Link href="/auth/register">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Get Started for Free
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white text-slate-700 hover:bg-white/20 hover:text-white">
                      <Link href="/auth/login">
                        <LogIn className="mr-2 h-5 w-5" />
                        Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 特性列表 */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-12">
              Advanced Features to Improve Your Game
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Activity className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-muted-foreground">
                  Track your performance metrics in real-time with smart watch integration
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Map className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Field Mapping</h3>
                <p className="text-muted-foreground">
                  Visualize your movement patterns and position coverage on the pitch
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Coach</h3>
                <p className="text-muted-foreground">
                  Get AI-powered insights and personalized training recommendations
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <LineChart className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Analysis</h3>
                <p className="text-muted-foreground">
                  Track your improvement over time with detailed analytics and reporting
                </p>
              </div>
            </div>
          </div>

          {/* 行动呼吁 */}
          <div className="text-center py-8 bg-slate-50 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Training?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our community of players who are using SmartFootball to reach their full potential
              and take their game to the next level.
            </p>
            <Button asChild size="lg" className="bg-slate-700 hover:bg-slate-800">
              <Link href="/auth/register">
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up Now
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to SmartFootball</h1>
            <p className="text-muted-foreground">
              Your comprehensive football performance tracking and analysis platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recent Activities</CardTitle>
                <CardDescription>Your last training was 2 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-2xl font-bold">5.2 km</span>
                    <span className="text-sm text-muted-foreground">Total distance</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-2xl font-bold">42 min</span>
                    <span className="text-sm text-muted-foreground">Duration</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-2xl font-bold">156 bpm</span>
                    <span className="text-sm text-muted-foreground">Max heart rate</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href="/training-logs">View details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Training Suggestions</CardTitle>
                <CardDescription>Personalized suggestions based on your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      High Priority
                    </Badge>
                    <span>Improve sprint recovery</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Medium
                    </Badge>
                    <span>Increase field coverage</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="mt-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/training-recommendations">All suggestions</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/watch-data">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <Activity className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="text-lg font-medium">Watch Data</h3>
                  <p className="text-sm text-center text-muted-foreground">View your Apple Watch sensor data</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/field-analysis">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <Map className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="text-lg font-medium">Field Analysis</h3>
                  <p className="text-sm text-center text-muted-foreground">GPS tracking and field boundaries</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/training-logs">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <BarChart className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="text-lg font-medium">Training Logs</h3>
                  <p className="text-sm text-center text-muted-foreground">View your training history and statistics</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/assistant">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                  <p className="text-sm text-center text-muted-foreground">Get answers to your training questions</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
