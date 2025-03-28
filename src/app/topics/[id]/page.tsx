"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Topic {
  id: string
  title: string
  members: string
  color: string
  // textColor: string
  apiData?: any
}

export default function TopicPage() {
  const params = useParams()
  const topicId = params?.id as string
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Check for user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })
  }, [])

  // Load topic data
  useEffect(() => {
    const loadTopic = async () => {
      setLoading(true)
      
      try {
        if (user) {
          // Fetch from database if user is logged in
          const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('id', topicId)
            .eq('user_id', user.id)
            .single()
          
          if (error) {
            console.error('Error fetching topic:', error)
            setTopic(null)
          } else if (data) {
            setTopic({
              id: data.id,
              title: data.title,
              members: data.members,
              color: data.color,
              apiData: data.api_data
            })
          }
        } else {
          // Try to get from localStorage as fallback
          if (typeof window !== 'undefined') {
            const savedTopics = localStorage.getItem('topics')
            if (savedTopics) {
              try {
                const topics = JSON.parse(savedTopics)
                const currentTopic = topics.find((t: Topic) => t.id === topicId)
                setTopic(currentTopic || null)
              } catch (e) {
                console.error('Failed to parse saved topics:', e)
                setTopic(null)
              }
            }
          }
        }
      } finally {
        setLoading(false)
      }
    }
    
    if (topicId) {
      loadTopic()
    }
  }, [topicId, user])

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
      <Link href="/" className="flex items-center hover:text-white mb-6">
        <ArrowLeft className="mr-2 h-4 w-4  " />
        <div className={`${topic.color} text-black  font-bold py-1 px-3 text-2xl inline-block `}>
          {topic.title}
        </div>
        {/* Back to Topics */}
      </Link>

      <div className="mb-4">

        {/* <h1 className="text-3xl font-bold">{topic.title} Analysis</h1> */}
        <p className="text-gray-400 ">{topic.members}</p>
      </div>

      {topic.apiData ? (
        // <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        
          <div className="columns-1 lg:columns-md gap-6 space-y-6 ">
          {Object.entries(topic.apiData.categories || {}).map(([categoryName, category]: [string, any]) => (
            <div key={categoryName} className="bg-brand/55 rounded-lg p-3 pt-5 border border-zinc-800 break-inside-avoid">
              <p className="text-black text-lg font-semibold mb-3 ml-2">{category.category}</p>
              <div key={categoryName} className="bg-zinc-900/95 rounded-lg p-6 border border-zinc-800">
                {/* <h2 className="text-xl font-bold mb-4">{categoryName}</h2> */}
                
                <p className= "mb-4 font-medium">Pain Points: {category.pain_points}</p>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`inline-block py-1 px-3 text-white border border-green-200 rounded-md font-normal`}>
                    Related Posts
                  </h3>
                  <button 
                    onClick={() => {
                      const currentExpanded = expandedCategories[categoryName] || false;
                      setExpandedCategories({...expandedCategories, [categoryName]: !currentExpanded});
                    }}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {expandedCategories[categoryName] ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                <div 
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    expandedCategories[categoryName] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-4 mt-2">
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