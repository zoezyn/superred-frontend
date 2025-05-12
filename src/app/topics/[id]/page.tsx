"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bookmark } from "lucide-react"
import { supabase } from "@/lib/supabase"
// import { useAuth } from '@/context/AuthContext'
import { RedditPost, Category, RedditAnalysisResponse } from "@/types/reddit"
import { User } from "@supabase/supabase-js"
interface Topic {
  id: string
  title: string
  members: string
  color: string
  // textColor: string
  apiData?: RedditAnalysisResponse
}

export default function TopicPage() {
  const params = useParams()
  const topicId = params?.id as string
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  // const { user } = useAuth()
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({})

  // Check for user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })
  }, [])

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
  // Load topic data
  // useEffect(() => {

    
  //   if (topicId) {
  //     loadTopic()
  //   }
  // }, [topicId, user])

  const checkSavedItems = async () => {
    if (!user) return
    
    try {
      const { data } = await supabase
        .from('saved_items')
        .select('category_name, pain_point')
        .eq('user_id', user.id)
        .eq('topic_id', topicId)
      
      if (data) {
        const savedMap: Record<string, boolean> = {}
        data.forEach(item => {
          savedMap[`${item.category_name}-${item.pain_point}`] = true
        })
        setSavedItems(savedMap)
      }
    } catch (error) {
      console.error('Error checking saved items:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      if (topicId) {
        await loadTopic()
      }
      if (user) {
        await checkSavedItems()
      }
      setLoading(false)
    }
    
    loadData()
  }, [topicId, user])

  const handleBookmark = async (categoryName: string, painPoint: string) => {
    if (!user) return
    
    const key = `${categoryName}-${painPoint}`
    const isCurrentlySaved = savedItems[key]
    
    try {
      if (isCurrentlySaved) {
        // Remove bookmark
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', user.id)
          .eq('topic_id', topicId)
          .eq('category_name', categoryName)
          .eq('pain_point', painPoint)
        
        if (error) throw error
        
        setSavedItems(prev => {
          const updated = { ...prev }
          delete updated[key]
          return updated
        })
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('saved_items')
          .insert({
            user_id: user.id,
            topic_id: topicId,
            category_name: categoryName,
            pain_point: painPoint
          })
        
        if (error) throw error
        
        setSavedItems(prev => ({
          ...prev,
          [key]: true
        }))
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

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
          <Link href="/dashboard" className="text-brand hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-2 sm:px-6 py-8 overflow-x-hidden">
    {/* <div className="container mx-auto px-6 py-8 "> */}
    {/* <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-6 py-8"> */}
      <Link href="/dashboard" className="flex items-center hover:text-white mb-6">
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
        
          <div className="columns-1 lg:columns-2 gap-6 space-y-6 ">
          {/* <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6"> */}
          {Object.entries(topic.apiData.categories || {}).map(([categoryName, category]: [string, Category]) => (
            <div key={categoryName} className="bg-brand/65 rounded-lg p-2 pt-4 border border-zinc-800 break-inside-avoid">
              <div className="flex items-center justify-between mb-2">
                <p className="text-black text-md font-semibold ml-2">{category.category}</p>
                {user && (
                      <button
                        onClick={() => handleBookmark(category.category, category.pain_points)}
                        className="text-zinc-800 hover:text-white transition-colors"
                      >
                        <Bookmark
                          size={20}
                          className={savedItems[`${category.category}-${category.pain_points}`] ? 'fill-current' : ''}
                        />
                      </button>
                    )}
              </div>
              <div key={categoryName} className="bg-zinc-900/95 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-start justify-between">
                  <p className="mb-4 text-base">{category.pain_points}</p>
                  {/* {user && (
                    <button
                      onClick={() => handleBookmark(categoryName, category.pain_points)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Bookmark
                        size={20}
                        className={savedItems[`${categoryName}-${category.pain_points}`] ? 'fill-current' : ''}
                      />
                    </button>
                  )} */}
                </div>
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
                    expandedCategories[categoryName] ? ' opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-4 mt-2">
                    {category.posts && category.posts.map((post: RedditPost, index: number) => (
                      <div key={index} className="border-l-2 border-brand pl-3 py-1 ">
                        <h4 className="font-medium text-sm break-words">{post.title}</h4>
                        <div className="w-[200px] sm:w-[300px] md:w-[600px] lg:max-w-full"> {/* Fixed width container */}
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{post.content}</p>
                        </div>
                        {/* <p className="text-gray-400 text-xs mt-1 line-clamp-2 break-words">{post.content}</p> */}
                        {/* <p className="text-gray-400 text-xs mt-1 line-clamp-2 break-words max-w-full whitespace-normal overflow-wrap-anywhere">{post.content}</p> */}
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