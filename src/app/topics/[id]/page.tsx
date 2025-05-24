"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bookmark, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
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
  const [expandAll, setExpandAll] = useState(false)

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
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => {
                const newExpandState = !expandAll;
                setExpandAll(newExpandState);
                
                // Create a new object where all categories have the same expanded state
                const allCategories: Record<string, boolean> = {};
                Object.keys(topic.apiData?.categories || {}).forEach(category => {
                  allCategories[category] = newExpandState;
                });
                
                setExpandedCategories(allCategories);
              }}
              className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-md cursor-pointer"
            >
              {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
          
          <div className="columns-1 gap-6 space-y-6 max-w-6xl mx-auto">
            <p className="text-gray-100 text-sm font-md">
              ALL DISCUSSIONS
            </p>
          {/* <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6"> */}
          {Object.entries(topic.apiData.categories || {}).map(([categoryName, category]: [string, Category]) => (
            <div key={categoryName} className="bg-zinc-900 rounded-lg px-4 py-4 md:px-10 md:py-4 break-inside-avoid border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-lg font-semibold py-4">{category.category}</p>
                {user && (
                      <button
                        onClick={() => handleBookmark(category.category, category.pain_points)}
                        className="text-white hover:text-brand cursor-pointer transition-colors "
                      >
                        <Bookmark
                          size={20}
                          className={savedItems[`${category.category}-${category.pain_points}`] ? 'text-brand fill-brand' : ''}
                        />
                      </button>
                    )}
              </div>

              <div className="flex items-center justify-between mb-2 mt-6">
                <p className="text-gray-100 text-xs font-md">SUMMARY</p>
              </div>
              <div key={categoryName} className="bg-zinc-800/95 rounded-lg my-2 mb-8 p-4 border border-zinc-800">
                <div className="flex items-start justify-between bg ">
                  <p className="mb-4 text-base">{category.pain_points}</p>
                </div>
              </div>

                <div className="flex items-center justify-between mb-2 mt-6">
                  <p className="text-gray-100 text-xs font-md">TOP PICKS</p>
                  <button 
                    onClick={() => {
                      const currentExpanded = expandedCategories[categoryName] || false;
                      setExpandedCategories({...expandedCategories, [categoryName]: !currentExpanded});
                    }}
                    className="text-brand hover:underline text-xs transition-colors duration-200 cursor-pointer"
                  >
                    {expandedCategories[categoryName] ? 'Show Less' : `View all posts (${(category.posts || []).length})`}
                  </button>
                </div>

                <div className="bg-zinc-800/95 rounded-lg my-2 p-4 border border-zinc-800">
                
                <div className="space-y-4 mt-2">
                  {(category.posts || [])
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .slice(0, expandedCategories[categoryName] ? undefined : 2)
                    .map((post: RedditPost, index: number) => (
                      <div key={index} className="border-l-2 border-brand pl-3 py-1 ">
                        <h4 className="font-medium text-sm break-words">{post.title}</h4>
                        {/* <div className="w-[200px] sm:w-[300px] md:w-[600px] lg:max-w-full"> */}
                        <div className="w-[300px] sm:w-[430px]  md:w-full">
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{post.content}</p>
                        </div>
                        {post.url && (
                          <div className="flex items-center gap-3 mt-1">
                            <a 
                              href={post.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand text-xs hover:underline"
                            >
                              View on Reddit
                            </a>
                            <span className="text-gray-400 text-xs">↑ Score: {post.score}</span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <MessageSquare size={12} /> {post.num_comments}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  {/* Bottom show more/less text */}
                  {expandedCategories[categoryName] ? (
                    <div 
                      onClick={() => {
                        setExpandedCategories({...expandedCategories, [categoryName]: false});
                      }}
                      className="text-center text-sm text-brand hover:text-white transition-colors duration-200 cursor-pointer mt-4 flex items-center justify-center gap-1"
                    >
                      Show less <ChevronUp size={16} />
                    </div>
                  ) : (category.posts || []).length > 2 && (
                    <div 
                      onClick={() => {
                        setExpandedCategories({...expandedCategories, [categoryName]: true});
                      }}
                      className="text-center text-xs text-white hover:text-brand transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1"
                    >
                      {(category.posts || []).length - 2} more 
                      <ChevronDown size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <p className="text-gray-400">No analysis data available for this topic.</p>
      </div>
    )}
    </div>
  )
} 