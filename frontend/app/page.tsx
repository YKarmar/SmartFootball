import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, Map, MessageSquare, BarChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to SmartFootball</h1>
        <p className="text-muted-foreground">
          Your comprehensive platform for football performance tracking and analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Your last training session was 2 days ago</CardDescription>
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
                <Link href="/training-logs">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Training Recommendations</CardTitle>
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
                <Link href="/training-recommendations">All Recommendations</Link>
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
              <p className="text-sm text-center text-muted-foreground">View your training history and stats</p>
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
    </div>
  )
}
