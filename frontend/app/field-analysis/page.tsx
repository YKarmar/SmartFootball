"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { Download, Ruler } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export default function FieldAnalysisPage() {
  const mapCanvasRef = useRef<HTMLCanvasElement>(null)
  const [fieldDimensions, setFieldDimensions] = useState({
    length: 105,
    width: 68,
  })

  // Simulated GPS track data (would come from API in real app)
  const [gpsTrack, setGpsTrack] = useState<Array<{ x: number; y: number }>>([])
  const [showBoundaries, setShowBoundaries] = useState(true)

  useEffect(() => {
    if (mapCanvasRef.current) {
      const canvas = mapCanvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Generate some mock GPS data for demonstration
        generateMockGpsData()

        // Draw the field
        drawField(ctx, canvas.width, canvas.height)
      }
    }
  }, [showBoundaries])

  // Generate mock GPS tracking data
  const generateMockGpsData = () => {
    const numPoints = 100
    const fieldWidth = 68
    const fieldLength = 105

    // Create an array of points representing movement on a football field
    const newTrack = []

    // Start at middle of field
    let x = fieldLength / 2
    let y = fieldWidth / 2

    for (let i = 0; i < numPoints; i++) {
      // Add some random movement
      x += (Math.random() - 0.5) * 5
      y += (Math.random() - 0.5) * 3

      // Keep within bounds with some margin
      x = Math.max(2, Math.min(fieldLength - 2, x))
      y = Math.max(2, Math.min(fieldWidth - 2, y))

      newTrack.push({ x, y })
    }

    setGpsTrack(newTrack)
  }

  // Draw the field, GPS tracks and convex hull
  const drawField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const fieldLength = 105 // in meters
    const fieldWidth = 68 // in meters

    // Scale factor to fit field on canvas
    const scaleX = (width - 40) / fieldLength
    const scaleY = (height - 40) / fieldWidth

    // Calculate margins to center the field
    const marginX = (width - fieldLength * scaleX) / 2
    const marginY = (height - fieldWidth * scaleY) / 2

    // Draw field background
    ctx.fillStyle = "#8cbf78" // Green field
    ctx.fillRect(marginX, marginY, fieldLength * scaleX, fieldWidth * scaleY)

    // Draw field lines
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.strokeRect(marginX, marginY, fieldLength * scaleX, fieldWidth * scaleY)

    // Draw halfway line
    ctx.beginPath()
    ctx.moveTo(marginX + (fieldLength / 2) * scaleX, marginY)
    ctx.lineTo(marginX + (fieldLength / 2) * scaleX, marginY + fieldWidth * scaleY)
    ctx.stroke()

    // Draw center circle
    ctx.beginPath()
    ctx.arc(
      marginX + (fieldLength / 2) * scaleX,
      marginY + (fieldWidth / 2) * scaleY,
      9.15 * scaleX, // Center circle radius in meters
      0,
      2 * Math.PI,
    )
    ctx.stroke()

    // Draw penalty areas
    const penaltyAreaLength = 16.5 // in meters
    const penaltyAreaWidth = 40.3 // in meters

    // Left penalty area
    ctx.strokeRect(
      marginX,
      marginY + ((fieldWidth - penaltyAreaWidth) * scaleY) / 2,
      penaltyAreaLength * scaleX,
      penaltyAreaWidth * scaleY,
    )

    // Right penalty area
    ctx.strokeRect(
      marginX + (fieldLength - penaltyAreaLength) * scaleX,
      marginY + ((fieldWidth - penaltyAreaWidth) * scaleY) / 2,
      penaltyAreaLength * scaleX,
      penaltyAreaWidth * scaleY,
    )

    // Draw GPS tracks
    if (gpsTrack.length > 0) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"
      ctx.lineWidth = 3
      ctx.beginPath()

      // Transform GPS coordinates to canvas coordinates
      const firstPoint = gpsTrack[0]
      ctx.moveTo(marginX + firstPoint.x * scaleX, marginY + firstPoint.y * scaleY)

      for (let i = 1; i < gpsTrack.length; i++) {
        const point = gpsTrack[i]
        ctx.lineTo(marginX + point.x * scaleX, marginY + point.y * scaleY)
      }

      ctx.stroke()

      // Draw points
      ctx.fillStyle = "red"
      gpsTrack.forEach((point) => {
        ctx.beginPath()
        ctx.arc(marginX + point.x * scaleX, marginY + point.y * scaleY, 3, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw convex hull if enabled
      if (showBoundaries) {
        const hull = calculateConvexHull(gpsTrack)

        if (hull.length > 2) {
          ctx.strokeStyle = "rgba(0, 0, 255, 0.7)"
          ctx.lineWidth = 2
          ctx.beginPath()

          const firstHullPoint = hull[0]
          ctx.moveTo(marginX + firstHullPoint.x * scaleX, marginY + firstHullPoint.y * scaleY)

          for (let i = 1; i < hull.length; i++) {
            const point = hull[i]
            ctx.lineTo(marginX + point.x * scaleX, marginY + point.y * scaleY)
          }

          // Close the hull
          ctx.lineTo(marginX + firstHullPoint.x * scaleX, marginY + firstHullPoint.y * scaleY)

          ctx.stroke()

          // Fill with transparent color
          ctx.fillStyle = "rgba(0, 0, 255, 0.1)"
          ctx.fill()

          // Calculate and display dimensions
          const dimensions = calculateHullDimensions(hull)
          setFieldDimensions({
            length: Math.round(dimensions.length),
            width: Math.round(dimensions.width),
          })
        }
      }
    }
  }

  // Calculate the convex hull using Graham scan algorithm
  const calculateConvexHull = (points: Array<{ x: number; y: number }>) => {
    // Find the point with the lowest y-coordinate
    let lowestPoint = points[0]
    for (let i = 1; i < points.length; i++) {
      if (points[i].y < lowestPoint.y || (points[i].y === lowestPoint.y && points[i].x < lowestPoint.x)) {
        lowestPoint = points[i]
      }
    }

    // Sort points by polar angle with respect to the lowest point
    const sortedPoints = [...points].sort((a, b) => {
      const angleA = Math.atan2(a.y - lowestPoint.y, a.x - lowestPoint.x)
      const angleB = Math.atan2(b.y - lowestPoint.y, b.x - lowestPoint.x)

      if (angleA < angleB) return -1
      if (angleA > angleB) return 1

      // If angles are the same, sort by distance
      const distA = Math.sqrt(Math.pow(a.x - lowestPoint.x, 2) + Math.pow(a.y - lowestPoint.y, 2))
      const distB = Math.sqrt(Math.pow(b.x - lowestPoint.x, 2) + Math.pow(b.y - lowestPoint.y, 2))

      return distA - distB
    })

    // Build the hull
    const hull = [sortedPoints[0], sortedPoints[1]]

    for (let i = 2; i < sortedPoints.length; i++) {
      while (hull.length > 1 && !isLeftTurn(hull[hull.length - 2], hull[hull.length - 1], sortedPoints[i])) {
        hull.pop()
      }
      hull.push(sortedPoints[i])
    }

    return hull
  }

  // Helper function for convex hull algorithm
  const isLeftTurn = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) => {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0
  }

  // Calculate the dimensions of the convex hull
  const calculateHullDimensions = (hull: Array<{ x: number; y: number }>) => {
    let minX = hull[0].x
    let maxX = hull[0].x
    let minY = hull[0].y
    let maxY = hull[0].y

    for (let i = 1; i < hull.length; i++) {
      minX = Math.min(minX, hull[i].x)
      maxX = Math.max(maxX, hull[i].x)
      minY = Math.min(minY, hull[i].y)
      maxY = Math.max(maxY, hull[i].y)
    }

    return {
      length: maxX - minX,
      width: maxY - minY,
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Field Analysis</h1>
        <p className="text-muted-foreground">Analyze your GPS tracks and field boundaries</p>
      </div>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">GPS Map</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Field Boundaries</CardTitle>
                  <CardDescription>Estimated from GPS tracks</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-boundaries" checked={showBoundaries} onCheckedChange={setShowBoundaries} />
                  <Label htmlFor="show-boundaries">Show Boundaries</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative bg-muted mb-4 rounded-md overflow-hidden">
                <canvas ref={mapCanvasRef} width={800} height={500} className="w-full h-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Estimated Field Length</div>
                  <div className="text-2xl font-bold flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-primary" />
                    {fieldDimensions.length} meters
                  </div>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Estimated Field Width</div>
                  <div className="text-2xl font-bold flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-primary" />
                    {fieldDimensions.width} meters
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Map Settings</CardTitle>
              <CardDescription>Configure the field analysis parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="boundary-settings">Boundary Detection Sensitivity</Label>
                  <span className="text-sm text-muted-foreground">50%</span>
                </div>
                <Slider id="boundary-settings" defaultValue={[50]} max={100} step={1} />
                <p className="text-sm text-muted-foreground">
                  Higher sensitivity may detect more precise boundaries but can be affected by GPS errors.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-tracks" defaultChecked />
                  <Label htmlFor="show-tracks">Show GPS Tracks</Label>
                </div>
                <p className="text-sm text-muted-foreground pl-7">Display the raw GPS tracking data points and path.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="show-heat" defaultChecked />
                  <Label htmlFor="show-heat">Show Heat Overlay</Label>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Display a heat overlay showing areas of high activity.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="reference-field" />
                  <Label htmlFor="reference-field">Show Standard Field Reference</Label>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Display standard football field dimensions for comparison.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
