"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AssistantPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your SmartFootball AI assistant. How can I help you with your football training today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle user message submission
  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const assistantMessage = generateFakeResponse(input)
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Generate a mock response based on the user's query
  const generateFakeResponse = (query: string): Message => {
    let response = "I'm sorry, I don't have enough information to answer that question."

    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("improve") && lowerQuery.includes("speed")) {
      response =
        "To improve your speed on the field, I recommend incorporating these exercises into your routine:\n\n1. High-intensity interval training (HIIT)\n2. Plyometric exercises like box jumps\n3. Sprint drills with short recovery periods\n4. Core strengthening exercises\n\nBased on your recent training data, I'd suggest focusing on your acceleration over the first 10 meters, as this appears to be where you have the most room for improvement."
    } else if (lowerQuery.includes("diet") || lowerQuery.includes("nutrition")) {
      response =
        "For optimal football performance, your nutrition should include:\n\n- Carbohydrates: 5-7g per kg of body weight (focus on complex carbs)\n- Protein: 1.2-1.7g per kg of body weight\n- Healthy fats: 20-35% of total calories\n\nPre-match meal (3-4 hours before): Pasta with chicken, vegetables, and a small amount of sauce\nPost-training recovery: Protein shake with banana within 30 minutes\n\nStay hydrated by drinking water consistently throughout the day!"
    } else if (lowerQuery.includes("recover") || lowerQuery.includes("recovery")) {
      response =
        "Based on your recent training intensity, here are some recovery recommendations:\n\n1. Ensure you're getting 7-9 hours of quality sleep\n2. Try contrast therapy (alternating hot and cold) for your legs\n3. Schedule a light active recovery session tomorrow (30 min at 60% max heart rate)\n4. Consider foam rolling your quadriceps and hamstrings\n\nYour heart rate variability data suggests you might need an extra day of recovery before your next high-intensity session."
    } else if (lowerQuery.includes("injury") || lowerQuery.includes("pain")) {
      response =
        "I notice you're mentioning pain or injury. While I can provide general information, please consult with a medical professional for proper diagnosis and treatment.\n\nFor minor muscle soreness:\n- R.I.C.E (Rest, Ice, Compression, Elevation)\n- Gentle stretching when pain subsides\n- Gradual return to activity\n\nYour training data shows a recent spike in workload which can increase injury risk. Consider reducing intensity by 15-20% for your next session."
    } else if (lowerQuery.includes("technique") || lowerQuery.includes("skill")) {
      response =
        "To improve your technical skills, I recommend structured practice:\n\n1. Dedicate 20 minutes daily to focused skill work\n2. Use video analysis to identify areas for improvement\n3. Break complex movements into smaller components\n4. Practice at game speed once basics are mastered\n\nYour motion data shows your left-foot control could use more work. Try spending 2:1 time on your non-dominant foot during skill sessions."
    } else if (lowerQuery.includes("training plan") || lowerQuery.includes("schedule")) {
      response =
        "Based on your current fitness level and goals, here's a weekly training structure:\n\nMonday: Technical skills + moderate cardio (60-70% max HR)\nTuesday: High-intensity interval training + strength\nWednesday: Active recovery + mobility work\nThursday: Game-specific drills + tactical training\nFriday: Speed and agility focus\nSaturday: Team training or match\nSunday: Complete rest or very light activity\n\nYour recent heart rate data suggests you recover well from high-intensity work, so we could potentially add another HIIT session if needed."
    }

    return {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }
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
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
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
        <div className="mt-2 text-xs text-muted-foreground">
          The AI assistant uses your training data to provide personalized responses and suggestions.
        </div>
      </div>
    </div>
  )
}
