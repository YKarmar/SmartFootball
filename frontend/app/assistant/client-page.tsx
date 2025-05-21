"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User, ClipboardList } from "lucide-react"
import { Chat } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// 样式组件，用于自定义Markdown渲染
const markdownStyles = {
  p: "mb-2",
  h1: "text-2xl font-bold mb-2",
  h2: "text-xl font-bold mb-2",
  h3: "text-lg font-bold mb-2",
  h4: "text-base font-bold mb-2",
  h5: "text-sm font-bold mb-2",
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

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AssistantContent() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 初始化欢迎消息，在客户端渲染时添加
    setMessages([{
      id: "1",
      role: "assistant",
      content: "Hello! I'm your **SmartFootball AI assistant**. How can I help you with your football training today?",
      timestamp: new Date(),
    }]);
    
    // 获取用户ID，这里已由中间件确保用户已登录
    const storedUserId = localStorage.getItem('userId');
    console.log("从localStorage获取userId:", storedUserId);
    
    if (!storedUserId || storedUserId.trim() === '') {
      console.error("No valid userId detected, but middleware should have handled this");
      toast({
        title: 'User authentication error',
        description: 'Please try logging in again',
        variant: 'destructive',
      });
      router.push('/auth/login');
      return;
    }
    
    setUserId(storedUserId);
  }, [router, toast])

  // Handle user message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    console.log("Sending chat request with userId:", userId, "and query:", input);

    try {
      // Call the API
      console.log("Making API call to /api/llm/basic-chat with payload:", { userId, query: input });
      const response = await Chat({
        userId: userId,
        query: input
      });
      
      console.log("Chat API response:", response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.description || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again later',
        variant: 'destructive',
      });
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, an error occurred. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate to training recommendations page
  const goToTrainingRecommendations = () => {
    // Add user request message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "I want to see my training data summary",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    
    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Sure, I'm redirecting you to the Training Recommendations page where you can view your training data summary and personalized recommendations.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
    
    // Delay the navigation slightly to let the user see the message
    setTimeout(() => {
      router.push('/training-recommendations')
    }, 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-start gap-3 max-w-[80%]">
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <Card className={`${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                <CardContent className="p-3">
                  {message.role === "assistant" ? (
                    <div className="markdown-content">
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
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{message.content}</div>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </div>
                </CardContent>
              </Card>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card>
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce delay-200"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            className="flex-1"
            placeholder="Ask about training, nutrition, recovery, or performance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        <div className="flex justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            The AI assistant uses your training data to provide personalized responses and suggestions.
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToTrainingRecommendations} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <ClipboardList className="h-4 w-4" />
            View Training Recommendations
          </Button>
        </div>
      </div>
    </div>
  )
} 