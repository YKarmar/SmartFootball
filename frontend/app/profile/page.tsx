import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { User, Edit, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  // Mock data - in a real app, this would come from a user context or API
  const user = {
    id: "1",
    username: "lionelmessi",
    fullName: "Lionel Messi",
    email: "lionel@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    age: 35,
    height: 170,
    weight: 72,
    position: "Forward",
    skillLevel: "Professional",
    stats: {
      trainingSessions: 156,
      totalDistance: 842,
      averageHeartRate: 142,
      maxSpeed: 32,
    },
    badges: [
      { name: "Marathon Runner", description: "Ran over 500km total" },
      { name: "Sprint King", description: "Reached top speed of 30km/h" },
      { name: "Regular Trainer", description: "Completed 100+ sessions" },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Button asChild>
          <Link href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <div className="w-full space-y-2 text-left">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{user.age} years</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Height:</span>
                  <span>{user.height} cm</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Weight:</span>
                  <span>{user.weight} kg</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Position:</span>
                  <span>{user.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skill Level:</span>
                  <span>{user.skillLevel}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Performance Statistics</CardTitle>
            <CardDescription>Overall training metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-background p-4 shadow-sm border">
                <div className="text-muted-foreground text-sm">Training Sessions</div>
                <div className="text-3xl font-bold">{user.stats.trainingSessions}</div>
              </div>
              <div className="rounded-lg bg-background p-4 shadow-sm border">
                <div className="text-muted-foreground text-sm">Total Distance</div>
                <div className="text-3xl font-bold">{user.stats.totalDistance} km</div>
              </div>
              <div className="rounded-lg bg-background p-4 shadow-sm border">
                <div className="text-muted-foreground text-sm">Avg. Heart Rate</div>
                <div className="text-3xl font-bold">{user.stats.averageHeartRate} bpm</div>
              </div>
              <div className="rounded-lg bg-background p-4 shadow-sm border">
                <div className="text-muted-foreground text-sm">Max Speed</div>
                <div className="text-3xl font-bold">{user.stats.maxSpeed} km/h</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Achievements</h3>
              <div className="space-y-3">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg bg-background p-3 shadow-sm border">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
