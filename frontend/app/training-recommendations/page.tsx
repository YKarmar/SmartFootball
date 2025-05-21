"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, CheckCircle, XCircle, Flag, AlertTriangle, Settings, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchRecommendationByUserId, updateRecommendation } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Summarize } from "@/lib/api"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Define recommendation type
type Recommendation = {
  id: string
  recommendationType: string
  title: string
  description: string
  priority: number
  status: string
  createdAt: string
  userId: string
}

// 样式组件，用于自定义Markdown渲染
const markdownStyles = {
  p: "mb-2",
  h1: "text-xl font-bold mb-2",
  h2: "text-lg font-bold mb-2",
  h3: "text-base font-bold mb-2",
  h4: "text-sm font-bold mb-2",
  h5: "text-xs font-bold mb-1",
  h6: "text-xs font-bold mb-1",
  strong: "font-bold",
  em: "italic",
  ol: "list-decimal pl-6 mb-2",
  ul: "list-disc pl-6 mb-2",
  li: "mb-1",
  code: "bg-gray-100 px-1 py-0.5 rounded text-sm",
  pre: "bg-gray-100 p-3 rounded overflow-x-auto mb-2",
  table: "border-collapse border border-gray-300 my-2",
  th: "border border-gray-300 px-2 py-1 bg-gray-100",
  td: "border border-gray-300 px-2 py-1",
  a: "text-blue-600 underline hover:text-blue-800"
};

export default function TrainingRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // 清理Markdown标记的函数
  const cleanMarkdown = (text: string) => {
    return text
      // 移除标题标记 (### 等)
      .replace(/^#+\s+/gm, '')
      // 移除粗体标记 (**text**)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // 移除斜体标记 (*text*)
      .replace(/\*(.*?)\*/g, '$1')
      // 移除代码块
      .replace(/```[\s\S]*?```/g, '')
      // 移除行内代码
      .replace(/`([^`]+)`/g, '$1')
      // 移除列表标记
      .replace(/^[\s-]*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // 移除链接，只保留文本
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 移除多余空行
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  // 切换详情展开/收缩状态
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  useEffect(() => {
    // Get user ID from local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If not found, use default ID
      setUserId('d2693663-51a3-4de0-9198-5f9c1241ed8b');
    }
  }, [])

  // 处理recommendationType，移除DETAILED_ANALYSIS、LLM_ANALYSIS等标签
  const formatRecommendationType = (type: string) => {
    if (!type) return "";
    
    // 移除特定标签
    const tagsToRemove = ["DETAILED_ANALYSIS", "LLM_ANALYSIS", "ANALYSIS"];
    let formattedType = type;
    
    tagsToRemove.forEach(tag => {
      formattedType = formattedType.replace(tag, "").trim();
    });
    
    // 处理多余的空格和分隔符
    formattedType = formattedType.replace(/\s+/g, " ").trim();
    formattedType = formattedType.replace(/^[_\-,;:\s]+|[_\-,;:\s]+$/g, "");
    
    return formattedType || "General";
  };

  // Fetch recommendation data
  const fetchRecommendations = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchRecommendationByUserId(userId);
      // Ensure status values are lowercase to match frontend expectations
      const normalizedData = data.map((rec: Recommendation) => ({
        ...rec,
        status: rec.status?.toLowerCase() || "new",
        // 确保recommendationType被格式化
        recommendationType: formatRecommendationType(rec.recommendationType)
      }));
      setRecommendations(normalizedData);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: 'Failed to fetch recommendations',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get AI summary and add to recommendation list
  const getAISummary = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      toast({
        title: 'Generating AI summary',
        description: 'This may take a moment, please wait...',
      });
      
      // Call Summarize API
      await Summarize({
        userId: userId,
        query: "Please summarize my training data and give me recommendations"
      });
      
      // Get updated recommendation list
      await fetchRecommendations();
      
      toast({
        title: 'AI summary created successfully',
        description: 'New training recommendations have been added to the list',
      });
    } catch (error) {
      console.error('Error getting AI summary:', error);
      toast({
        title: 'Failed to get AI summary',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recommendations when page loads
  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  // Filter recommendations based on active tab
  const filteredRecommendations = recommendations.filter((rec) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return rec.status === "new" || rec.status === "in-progress"
    if (activeTab === "completed") return rec.status === "completed"
    if (activeTab === "ignored") return rec.status === "ignored"
    return true
  })

  // Update recommendation status
  const updateStatus = async (id: string, status: string) => {
    try {
      const rec = recommendations.find(r => r.id === id);
      if (!rec) return;
      
      const updatedRec = { ...rec, status };
      await updateRecommendation(id, updatedRec);
      
      // Update local state
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      
      toast({
        title: 'Status updated',
        description: `Recommendation marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: 'Failed to update status',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  }

  // Helper for priority badge
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 2:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            High Priority
          </Badge>
        )
      case 1:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        )
      case 0:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Low
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        )
    }
  }

  // Helper for status badge
  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            New
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={getAISummary} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Get AI Training Summary
          </Button>
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

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="mt-2">Loading...</p>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="text-center py-10">
              <p>No recommendations found</p>
              <Button 
                variant="outline" 
                onClick={getAISummary} 
                className="mt-4"
              >
                Get AI Training Summary
              </Button>
            </div>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{recommendation.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {getPriorityBadge(recommendation.priority)}
                        {getStatusBadge(recommendation.status)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Settings</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateStatus(recommendation.id, "new")}>
                          <Flag className="mr-2 h-4 w-4" />
                          <span>Mark as New</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(recommendation.id, "in-progress")}>
                          <Activity className="mr-2 h-4 w-4" />
                          <span>Mark as In Progress</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(recommendation.id, "completed")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Mark as Completed</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(recommendation.id, "ignored")}>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Mark as Ignored</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {expandedItems[recommendation.id] ? 'Hide details' : 'Show details'}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => toggleExpand(recommendation.id)}
                      >
                        {expandedItems[recommendation.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {expandedItems[recommendation.id] ? (
                      <div className="markdown-content mt-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className={markdownStyles.p} {...props} />,
                            h1: ({node, ...props}) => <h1 className={markdownStyles.h1} {...props} />,
                            h2: ({node, ...props}) => <h2 className={markdownStyles.h2} {...props} />,
                            h3: ({node, ...props}) => <h3 className={markdownStyles.h3} {...props} />,
                            h4: ({node, ...props}) => <h4 className={markdownStyles.h4} {...props} />,
                            h5: ({node, ...props}) => <h5 className={markdownStyles.h5} {...props} />,
                            h6: ({node, ...props}) => <h6 className={markdownStyles.h6} {...props} />,
                            strong: ({node, ...props}) => <strong className={markdownStyles.strong} {...props} />,
                            em: ({node, ...props}) => <em className={markdownStyles.em} {...props} />,
                            ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                            ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                            li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                            code: ({inline, ...props}: {inline?: boolean} & React.HTMLProps<HTMLElement>) => 
                              inline 
                                ? <code className={markdownStyles.code} {...props} />
                                : <pre className={markdownStyles.pre}><code {...props} /></pre>,
                            a: ({node, ...props}) => <a className={markdownStyles.a} target="_blank" rel="noopener noreferrer" {...props} />,
                          }}
                        >
                          {recommendation.description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cleanMarkdown(recommendation.description)}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-1 text-xs text-muted-foreground">
                  Created on{" "}
                  {new Date(recommendation.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
