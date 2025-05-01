"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, CheckCircle, XCircle, Flag, AlertTriangle, Settings } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define recommendation type
type Recommendation = {
  id: string
  category: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "new" | "in-progress" | "completed" | "ignored"
  createdAt: string
}

export default function TrainingRecommendationsPage() {
  // Mock recommendations data
  const initialRecommendations: Recommendation[] = [
    {
      id: "rec1",
      category: "Endurance",
      title: "Increase aerobic capacity",
      description:
        "You've shown decreased performance in the later stages of training. Focus on improving your aerobic endurance with longer running sessions at 70% of your max heart rate.",
      priority: "high",
      status: "new",
      createdAt: "2023-09-15",
    },
    {
      id: "rec2",
      category: "Speed",
      title: "Add sprint recovery training",
      description:
        "Your sprint recovery time is longer than recommended. Add interval training with 30-second sprints followed by 60-second active recovery periods.",
      priority: "high",
      status: "in-progress",
      createdAt: "2023-09-10",
    },
    {
      id: "rec3",
      category: "Positioning",
      title: "Improve field coverage",
      description:
        "Heatmap analysis shows limited coverage on the left side of the field. Incorporate more movement drills focusing on cross-field transitions.",
      priority: "medium",
      status: "new",
      createdAt: "2023-09-08",
    },
    {
      id: "rec4",
      category: "Recovery",
      title: "Optimize rest intervals",
      description:
        "Heart rate recovery is slower than expected. Consider adding more rest days between high-intensity sessions and focus on active recovery techniques.",
      priority: "medium",
      status: "new",
      createdAt: "2023-09-05",
    },
    {
      id: "rec5",
      category: "Nutrition",
      title: "Pre-training meal timing",
      description:
        "Based on your performance metrics, consider adjusting your pre-training meal to 2-3 hours before activity to optimize energy levels.",
      priority: "low",
      status: "new",
      createdAt: "2023-09-01",
    },
    {
      id: "rec6",
      category: "Technique",
      title: "Improve acceleration mechanics",
      description:
        "Sensor data shows inefficient acceleration patterns. Focus on explosive first-step exercises and proper running form drills.",
      priority: "high",
      status: "completed",
      createdAt: "2023-08-25",
    },
    {
      id: "rec7",
      category: "Strength",
      title: "Add lower body strength training",
      description:
        "Power metrics suggest room for improvement in lower body strength. Incorporate squats, lunges, and plyometric exercises twice per week.",
      priority: "medium",
      status: "ignored",
      createdAt: "2023-08-20",
    },
  ]

  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations)
  const [activeTab, setActiveTab] = useState("all")

  // Filter recommendations based on active tab
  const filteredRecommendations = recommendations.filter((rec) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return rec.status === "new" || rec.status === "in-progress"
    if (activeTab === "completed") return rec.status === "completed"
    if (activeTab === "ignored") return rec.status === "ignored"
    return true
  })

  // Update recommendation status
  const updateStatus = (id: string, status: Recommendation["status"]) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, status } : rec)))
  }

  // Update recommendation priority
  const updatePriority = (id: string, priority: Recommendation["priority"]) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, priority } : rec)))
  }

  // Helper for priority badge
  const getPriorityBadge = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Low
          </Badge>
        )
    }
  }

  // Helper for status badge
  const getStatusBadge = (status: Recommendation["status"]) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            New
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      case "ignored":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Ignored
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Recommendations</h1>
          <p className="text-muted-foreground">Personalized suggestions based on your performance data</p>
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="priority">Priority (High-Low)</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({recommendations.filter((r) => r.status === "new" || r.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({recommendations.filter((r) => r.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="ignored">
            Ignored ({recommendations.filter((r) => r.status === "ignored").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 pt-4">
          {filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No recommendations found</h3>
                <p className="text-muted-foreground mt-2 text-center max-w-md">
                  {activeTab === "all"
                    ? "No training recommendations are available yet. Keep training to generate personalized suggestions."
                    : `No ${activeTab} recommendations are available.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className={recommendation.status === "completed" ? "opacity-75" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{recommendation.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{recommendation.category}</Badge>
                        {getPriorityBadge(recommendation.priority)}
                        {getStatusBadge(recommendation.status)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updatePriority(recommendation.id, "high")}
                          disabled={recommendation.priority === "high"}
                        >
                          <Flag className="mr-2 h-4 w-4 text-red-500" />
                          Set High Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePriority(recommendation.id, "medium")}
                          disabled={recommendation.priority === "medium"}
                        >
                          <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                          Set Medium Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePriority(recommendation.id, "low")}
                          disabled={recommendation.priority === "low"}
                        >
                          <Flag className="mr-2 h-4 w-4 text-green-500" />
                          Set Low Priority
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{recommendation.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <p className="text-xs text-muted-foreground">
                    Added on {new Date(recommendation.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    {recommendation.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(recommendation.id, "completed")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Completed
                      </Button>
                    )}
                    {recommendation.status !== "ignored" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(recommendation.id, "ignored")}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Ignore
                      </Button>
                    )}
                    {(recommendation.status === "completed" || recommendation.status === "ignored") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(recommendation.id, "in-progress")}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Reactivate
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
