"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Heart,
  LineChart,
  Map,
  MoreHorizontal,
  Ruler,
  Timer,
  User,
} from "lucide-react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define training log type
type TrainingLog = {
  id: string
  date: string
  title: string
  type: string
  duration: number // in minutes
  distance: number // in kilometers
  avgHeartRate: number
  maxHeartRate: number
  calories: number
  user: {
    name: string
    avatar: string
  }
}

export default function TrainingLogsPage() {
  // Mock training logs data
  const trainingLogs: TrainingLog[] = [
    {
      id: "log1",
      date: "2023-09-15",
      title: "Morning Practice",
      type: "Team Training",
      duration: 75,
      distance: 5.8,
      avgHeartRate: 142,
      maxHeartRate: 175,
      calories: 610,
      user: {
        name: "Lionel Messi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "log2",
      date: "2023-09-12",
      title: "Afternoon Drill Session",
      type: "Skill Training",
      duration: 45,
      distance: 3.2,
      avgHeartRate: 125,
      maxHeartRate: 155,
      calories: 380,
      user: {
        name: "Lionel Messi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "log3",
      date: "2023-09-08",
      title: "Weekend Match",
      type: "Match",
      duration: 95,
      distance: 9.7,
      avgHeartRate: 155,
      maxHeartRate: 185,
      calories: 850,
      user: {
        name: "Lionel Messi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "log4",
      date: "2023-09-05",
      title: "Conditioning Session",
      type: "Fitness",
      duration: 60,
      distance: 8.3,
      avgHeartRate: 162,
      maxHeartRate: 178,
      calories: 720,
      user: {
        name: "Lionel Messi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "log5",
      date: "2023-09-03",
      title: "Recovery Run",
      type: "Recovery",
      duration: 30,
      distance: 3.5,
      avgHeartRate: 110,
      maxHeartRate: 125,
      calories: 240,
      user: {
        name: "Lionel Messi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  const [activeTab, setActiveTab] = useState("list")

  // Format time from minutes to HH:MM format
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Logs</h1>
          <p className="text-muted-foreground">Track and analyze your football sessions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="match">Match</SelectItem>
              <SelectItem value="team">Team Training</SelectItem>
              <SelectItem value="skill">Skill Training</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="recovery">Recovery</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Recent Training Sessions</CardTitle>
              <CardDescription>View and manage your training activity history</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead className="hidden md:table-cell">Distance</TableHead>
                    <TableHead className="hidden md:table-cell">Avg HR</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{log.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.type === "Match"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : log.type === "Team Training"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : log.type === "Recovery"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          }
                        >
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Timer className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatTime(log.duration)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Ruler className="mr-2 h-4 w-4 text-muted-foreground" />
                          {log.distance} km
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Heart className="mr-2 h-4 w-4 text-red-500" />
                          {log.avgHeartRate} bpm
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={log.user.avatar || "/placeholder.svg"} alt={log.user.name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden md:inline">{log.user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Heatmap</DropdownMenuItem>
                            <DropdownMenuItem>Download Data</DropdownMenuItem>
                            <DropdownMenuItem>Edit Log</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-center space-x-2 py-4">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="px-2.5">
                  1
                </Button>
                <span>of 3</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>September 2023</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium py-2 text-sm">
                    {day}
                  </div>
                ))}
                {/* Empty days for the start of September */}
                {[...Array(5)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-md p-1 text-muted-foreground text-sm"></div>
                ))}
                {/* Days of September */}
                {[...Array(30)].map((_, i) => {
                  const day = i + 1
                  // Check if there's a log for this day
                  const hasLog = trainingLogs.some((log) => new Date(log.date).getDate() === day)

                  return (
                    <div
                      key={`day-${day}`}
                      className={`aspect-square relative rounded-md p-1 text-sm border ${
                        hasLog ? "bg-primary/10 border-primary" : "hover:bg-muted"
                      }`}
                    >
                      <div className="absolute top-1 left-1">{day}</div>
                      {hasLog && (
                        <div className="absolute bottom-1 right-1 flex space-x-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="font-medium">Sessions This Month</h3>
                {trainingLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{new Date(log.date).toLocaleDateString()}</span>
                      <span className="mx-2">-</span>
                      <span>{log.title}</span>
                    </div>
                    <Badge variant="outline">{log.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Summary</CardTitle>
                <CardDescription>Past 30 days performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Distance Chart</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-md border">
                    <div className="text-sm text-muted-foreground">Total Distance</div>
                    <div className="text-2xl font-bold">30.5 km</div>
                    <div className="text-sm text-green-500">+12% vs last month</div>
                  </div>
                  <div className="bg-background p-4 rounded-md border">
                    <div className="text-sm text-muted-foreground">Total Duration</div>
                    <div className="text-2xl font-bold">5h 05m</div>
                    <div className="text-sm text-green-500">+8% vs last month</div>
                  </div>
                  <div className="bg-background p-4 rounded-md border">
                    <div className="text-sm text-muted-foreground">Avg Heart Rate</div>
                    <div className="text-2xl font-bold">139 bpm</div>
                    <div className="text-sm text-red-500">+3% vs last month</div>
                  </div>
                  <div className="bg-background p-4 rounded-md border">
                    <div className="text-sm text-muted-foreground">Total Sessions</div>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-muted-foreground">Same as last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Distribution</CardTitle>
                <CardDescription>Activity type breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <Map className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Activity Chart</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Team Training</span>
                      <span className="text-sm">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Match</span>
                      <span className="text-sm">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Fitness</span>
                      <span className="text-sm">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Recovery</span>
                      <span className="text-sm">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Zones</CardTitle>
              <CardDescription>Time spent in different heart rate zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-blue-100 text-blue-800 p-3 rounded-md border border-blue-200">
                  <div className="font-medium mb-1">Zone 1</div>
                  <div className="text-xl font-bold">15%</div>
                  <div className="text-sm">Recovery (60-110 bpm)</div>
                </div>
                <div className="bg-green-100 text-green-800 p-3 rounded-md border border-green-200">
                  <div className="font-medium mb-1">Zone 2</div>
                  <div className="text-xl font-bold">25%</div>
                  <div className="text-sm">Endurance (111-130 bpm)</div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md border border-yellow-200">
                  <div className="font-medium mb-1">Zone 3</div>
                  <div className="text-xl font-bold">35%</div>
                  <div className="text-sm">Tempo (131-150 bpm)</div>
                </div>
                <div className="bg-orange-100 text-orange-800 p-3 rounded-md border border-orange-200">
                  <div className="font-medium mb-1">Zone 4</div>
                  <div className="text-xl font-bold">20%</div>
                  <div className="text-sm">Threshold (151-170 bpm)</div>
                </div>
                <div className="bg-red-100 text-red-800 p-3 rounded-md border border-red-200">
                  <div className="font-medium mb-1">Zone 5</div>
                  <div className="text-xl font-bold">5%</div>
                  <div className="text-sm">Anaerobic (171+ bpm)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
