"use client"

import dynamic from 'next/dynamic'

// 使用动态导入，禁用SSR以避免水合错误
const AssistantContent = dynamic(() => import('./client-page'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-middle"></div>
        <p className="mt-2">Loading assistant...</p>
      </div>
    </div>
  )
})

export default function AssistantPage() {
  return <AssistantContent />
}
