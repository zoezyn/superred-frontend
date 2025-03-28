"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Topic {
  id: string
  title: string
  members: string
  color: string
  textColor: string
  apiData?: any
}

export default function TopicPage() {
  const params = useParams()
  const topicId = params?.id as string
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get topics from localStorage
    if (typeof window !== 'undefined') {
      const savedTopics = localStorage.getItem('topics')
      if (savedTopics) {
        try {
          const topics = JSON.parse(savedTopics)
          const currentTopic = topics.find((t: Topic) => t.id === topicId)
          setTopic(currentTopic || null)
        } catch (e) {
          console.error('Failed to parse saved topics:', e)
        }
      }
      setLoading(false)
    }
  }, [topicId])

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link href="/" className="text-brand hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Topics
      </Link>

      <div className="mb-8">
        <div className={`${topic.color} ${topic.textColor} font-bold py-1 px-3 rounded inline-block mb-2`}>
          {topic.title}
        </div>
        <h1 className="text-3xl font-bold">{topic.title} Analysis</h1>
        <p className="text-gray-400 mt-2">{topic.members}</p>
      </div>

      {topic.apiData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(topic.apiData.categories || {}).map(([categoryName, category]: [string, any]) => (
            <div key={categoryName} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">{categoryName}</h2>
              <p className="text-gray-300 mb-4">{category.category_info}</p>
              
              <h3 className="text-lg font-semibold mb-2">Related Posts</h3>
              <div className="space-y-4">
                {category.posts && category.posts.map((post: any, index: number) => (
                  <div key={index} className="border-l-2 border-brand pl-4 py-1">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <span className="mr-3">Score: {post.score}</span>
                      <span>Comments: {post.num_comments}</span>
                    </div>
                    {post.url && (
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand text-xs hover:underline mt-1 inline-block"
                      >
                        View on Reddit
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <p className="text-gray-400">No analysis data available for this topic.</p>
        </div>
      )}
    </div>
  )
} 