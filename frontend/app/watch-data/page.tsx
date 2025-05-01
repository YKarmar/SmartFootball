"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Heart, Map, Play, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function WatchDataPage() {
  // Mock state for whether HealthKit is connected
  const [isConnected, setIsConnected] = useState(false)
  // Mock state for active session
  const [isActive, setIsActive] = useState(false)

  // Mock data for watch sensors
  const [sensorData, setSensorData] = useState({
    heartRate: 72,
    steps: 0,
    calories: 0,
    distance: 0,
    activityStatus: "Idle",
    latitude: 40.7128,
    longitude: -74.006,
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
  })

  // Connect to HealthKit (in a real app this would use the actual HealthKit API)
  const handleConnect = () => {
    setIsConnected(true)
    // Begin simulating data for demo
    startSimulation()
  }

  // Toggle training session
  const toggleSession = () => {
    setIsActive(!isActive)

    // Update activity status
    if (!isActive) {
      setSensorData({
        ...sensorData,
        activityStatus: "Training",
      })
    } else {
      setSensorData({
        ...sensorData,
        activityStatus: "Paused",
      })
    }
  }

  // Simulate sensor data for demo purposes
  const startSimulation = () => {
    const interval = setInterval(() => {
      if (isActive) {
        setSensorData((prev) => ({
          ...prev,
          heartRate: Math.floor(130 + Math.random() * 30),
          steps: prev.steps + Math.floor(Math.random() * 10),
          calories: prev.calories + Math.floor(Math.random() * 5),
          distance: +(prev.distance + Math.random() * 0.01).toFixed(2),
          accelerometer: {
            x: +(Math.random() * 2 - 1).toFixed(2),
            y: +(Math.random() * 2 - 1).toFixed(2),
            z: +(Math.random() * 2 - 1).toFixed(2),
          },
          gyroscope: {
            x: +(Math.random() * 5 - 2.5).toFixed(2),
            y: +(Math.random() * 5 - 2.5).toFixed(2),
            z: +(Math.random() * 5 - 2.5).toFixed(2),
          },
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Apple Watch Data</h1>
          <p className="text-muted-foreground">Monitor real-time sensor data from your connected Apple Watch</p>
        </div>
        <div>
          {!isConnected ? (
            <Button onClick={handleConnect}>Connect HealthKit</Button>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              Connected
            </Badge>
          )}
        </div>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Apple Watch</CardTitle>
            <CardDescription>
              Grant permission to access HealthKit data for tracking your football activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertTitle>Permission Required</AlertTitle>
              <AlertDescription>
                SmartFootball needs access to your Apple Watch data to analyze your performance. All data is processed
                securely.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button className="w-full sm:w-auto" onClick={handleConnect}>
                Connect HealthKit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "outline"}>{sensorData.activityStatus}</Badge>
              {isActive && (
                <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                  Recording
                </Badge>
              )}
            </div>
            <Button onClick={toggleSession} variant={isActive ? "destructive" : "default"}>
              {isActive ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Stop Session
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Session
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
              <TabsTrigger value="sensors">Sensors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Heart Rate</CardTitle>
                    <CardDescription>Current BPM (Beats Per Minute)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <div className="relative flex h-36 w-36 items-center justify-center">
                        <Heart className="h-12 w-12 text-red-500 animate-pulse" />
                        <span className="absolute text-3xl font-bold">{sensorData.heartRate}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Resting (60-80)</span>
                        <span>High (140-160)</span>
                      </div>
                      <Progress value={(sensorData.heartRate / 200) * 100} className="h-2 mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Activity Metrics</CardTitle>
                    <CardDescription>Current session data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-background p-3 shadow-sm border">
                        <div className="text-muted-foreground text-sm">Distance</div>
                        <div className="text-2xl font-bold">{sensorData.distance} km</div>
                      </div>
                      <div className="rounded-lg bg-background p-3 shadow-sm border">
                        <div className="text-muted-foreground text-sm">Steps</div>
                        <div className="text-2xl font-bold">{sensorData.steps}</div>
                      </div>
                      <div className="rounded-lg bg-background p-3 shadow-sm border">
                        <div className="text-muted-foreground text-sm">Calories</div>
                        <div className="text-2xl font-bold">{sensorData.calories} kcal</div>
                      </div>
                      <div className="rounded-lg bg-background p-3 shadow-sm border">
                        <div className="text-muted-foreground text-sm">Duration</div>
                        <div className="text-2xl font-bold">{isActive ? "00:12:34" : "00:00:00"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Activity Recognition</CardTitle>
                  <CardDescription>AI-detected football activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Running</span>
                      <Progress value={75} className="w-64 h-2" />
                      <span className="text-muted-foreground text-sm">75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Walking</span>
                      <Progress value={15} className="w-64 h-2" />
                      <span className="text-muted-foreground text-sm">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sprinting</span>
                      <Progress value={5} className="w-64 h-2" />
                      <span className="text-muted-foreground text-sm">5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Standing</span>
                      <Progress value={5} className="w-64 h-2" />
                      <span className="text-muted-foreground text-sm">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="heart-rate">
              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate Monitor</CardTitle>
                  <CardDescription>Real-time heart rate data from your Apple Watch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-80">
                    <div className="text-center">
                      <div className="flex flex-col items-center mb-4">
                        <Heart className="h-16 w-16 text-red-500 animate-pulse" />
                        <span className="text-5xl font-bold mt-2">{sensorData.heartRate}</span>
                        <span className="text-muted-foreground">BPM</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 max-w-md">
                        <div className="bg-background p-3 rounded-lg shadow-sm border">
                          <div className="text-sm text-muted-foreground">Resting</div>
                          <div className="font-medium">68 BPM</div>
                        </div>
                        <div className="bg-background p-3 rounded-lg shadow-sm border">
                          <div className="text-sm text-muted-foreground">Average</div>
                          <div className="font-medium">132 BPM</div>
                        </div>
                        <div className="bg-background p-3 rounded-lg shadow-sm border">
                          <div className="text-sm text-muted-foreground">Max</div>
                          <div className="font-medium">174 BPM</div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="text-sm text-muted-foreground mb-1">Zone Analysis</div>
                        <div className="bg-gray-100 dark:bg-gray-800 h-6 rounded-full overflow-hidden flex">
                          <div className="bg-blue-400 h-full" style={{ width: "20%" }}></div>
                          <div className="bg-green-400 h-full" style={{ width: "35%" }}></div>
                          <div className="bg-yellow-400 h-full" style={{ width: "30%" }}></div>
                          <div className="bg-red-400 h-full" style={{ width: "15%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Recovery (60-100)</span>
                          <span>Aerobic (100-140)</span>
                          <span>Anaerobic (140-170)</span>
                          <span>Max (170+)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sensors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>GPS Location</CardTitle>
                    <CardDescription>Current coordinates from your device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center mb-4">
                      <Map className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Map View</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Latitude:</span>
                        <span>{sensorData.latitude.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Longitude:</span>
                        <span>{sensorData.longitude.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Accuracy:</span>
                        <span>±3.2 meters</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accelerometer</CardTitle>
                    <CardDescription>Movement acceleration data (g)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between">
                          <span>X-axis</span>
                          <span>{sensorData.accelerometer.x} g</span>
                        </div>
                        <Progress value={(sensorData.accelerometer.x + 1) * 50} className="h-2 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Y-axis</span>
                          <span>{sensorData.accelerometer.y} g</span>
                        </div>
                        <Progress value={(sensorData.accelerometer.y + 1) * 50} className="h-2 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Z-axis</span>
                          <span>{sensorData.accelerometer.z} g</span>
                        </div>
                        <Progress value={(sensorData.accelerometer.z + 1) * 50} className="h-2 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gyroscope</CardTitle>
                    <CardDescription>Rotational movement data (rad/s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between">
                          <span>X-axis (Roll)</span>
                          <span>{sensorData.gyroscope.x} rad/s</span>
                        </div>
                        <Progress value={(sensorData.gyroscope.x + 2.5) * 20} className="h-2 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Y-axis (Pitch)</span>
                          <span>{sensorData.gyroscope.y} rad/s</span>
                        </div>
                        <Progress value={(sensorData.gyroscope.y + 2.5) * 20} className="h-2 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Z-axis (Yaw)</span>
                          <span>{sensorData.gyroscope.z} rad/s</span>
                        </div>
                        <Progress value={(sensorData.gyroscope.z + 2.5) * 20} className="h-2 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
