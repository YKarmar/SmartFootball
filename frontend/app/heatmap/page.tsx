"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef, useEffect } from "react"
import { Download, Filter } from "lucide-react"

export default function HeatmapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridSize, setGridSize] = useState(10)
  const [densityThreshold, setDensityThreshold] = useState(25)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        drawHeatmap(ctx, canvas.width, canvas.height)
      }
    }
  }, [gridSize, densityThreshold])

  // Draw a mock heatmap
  const drawHeatmap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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

    // Create heatmap grid
    const gridCellWidth = (fieldLength * scaleX) / gridSize
    const gridCellHeight = (fieldWidth * scaleY) / gridSize

    // Generate mock heatmap data
    const heatmapData = generateMockHeatmapData(gridSize, gridSize)

    // Draw heatmap
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const intensity = heatmapData[y][x]

        // Only draw cells above threshold
        if (intensity > densityThreshold) {
          const alpha = Math.min(1, intensity / 100)

          ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`
          ctx.fillRect(marginX + x * gridCellWidth, marginY + y * gridCellHeight, gridCellWidth, gridCellHeight)
        }
      }
    }
  }

  // Generate mock heatmap data
  const generateMockHeatmapData = (width: number, height: number) => {
    const data: number[][] = []

    // Player tends to spend more time in certain areas of the field
    // Center of the field
    const centerX = Math.floor(width / 2)
    const centerY = Math.floor(height / 2)

    // Right wing position
    const rightWingX = Math.floor(width * 0.7)
    const rightWingY = Math.floor(height * 0.2)

    // Left penalty area
    const leftPenaltyX = Math.floor(width * 0.2)
    const leftPenaltyY = Math.floor(height * 0.5)

    for (let y = 0; y < height; y++) {
      const row: number[] = []
      for (let x = 0; x < width; x++) {
        // Base value
        let value = 10

        // Add intensity based on distance from key positions
        const distCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const distRightWing = Math.sqrt(Math.pow(x - rightWingX, 2) + Math.pow(y - rightWingY, 2))
        const distLeftPenalty = Math.sqrt(Math.pow(x - leftPenaltyX, 2) + Math.pow(y - leftPenaltyY, 2))

        value += Math.max(0, 80 - distCenter * 8)
        value += Math.max(0, 90 - distRightWing * 10)
        value += Math.max(0, 70 - distLeftPenalty * 9)

        // Add some randomness
        value += Math.random() * 20

        row.push(Math.min(100, value))
      }
      data.push(row)
    }

    return data
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Heatmap Analysis</h1>
        <p className="text-muted-foreground">Visualize your movement patterns and field coverage</p>
      </div>

      <Tabs defaultValue="heatmap">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="heatmap">Heatmap View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Movement Heatmap</CardTitle>
                  <CardDescription>Based on your GPS track data</CardDescription>
                </div>
                <Select defaultValue="last">
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last">Last Session</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative bg-muted mb-4 rounded-md overflow-hidden">
                <canvas ref={canvasRef} width={800} height={500} className="w-full h-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-background border shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Coverage</div>
                    <div className="text-2xl font-bold">68%</div>
                    <div className="text-xs text-muted-foreground">of field area</div>
                  </CardContent>
                </Card>
                <Card className="bg-background border shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Hotspots</div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">high density areas</div>
                  </CardContent>
                </Card>
                <Card className="bg-background border shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Movement Pattern</div>
                    <div className="text-2xl font-bold">Right Wing</div>
                    <div className="text-xs text-muted-foreground">dominant position</div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Density threshold: {densityThreshold}%</span>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Heatmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Heatmap Settings</CardTitle>
              <CardDescription>Configure visualization parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="grid-size-slider">
                    Grid Size: {gridSize}x{gridSize}
                  </Label>
                  <span className="text-sm text-muted-foreground">{gridSize * gridSize} cells</span>
                </div>
                <Slider
                  id="grid-size-slider"
                  min={5}
                  max={20}
                  step={1}
                  value={[gridSize]}
                  onValueChange={(value) => setGridSize(value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Smaller grid size provides more detailed visualization but may require more data points.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="density-threshold-slider">Density Threshold: {densityThreshold}%</Label>
                </div>
                <Slider
                  id="density-threshold-slider"
                  min={0}
                  max={75}
                  step={5}
                  value={[densityThreshold]}
                  onValueChange={(value) => setDensityThreshold(value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Only areas with activity above this threshold will be displayed on the heatmap.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select defaultValue="red">
                  <SelectTrigger>
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">Red Gradient</SelectItem>
                    <SelectItem value="blue">Blue Gradient</SelectItem>
                    <SelectItem value="rainbow">Rainbow</SelectItem>
                    <SelectItem value="custom">Custom Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Source</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="match">Match Only</SelectItem>
                    <SelectItem value="training">Training Only</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
