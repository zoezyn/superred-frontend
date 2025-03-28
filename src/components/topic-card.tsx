"use client"

import Link from "next/link"
import { Plus, User, X } from "lucide-react"
import { useState, useEffect } from "react"
import { RedditAnalysisRequest, RedditAnalysisResponse } from "@/types/reddit"

// Sample colors for new cards
const sampleColors = [
  { bg: "bg-yellow-300", text: "text-black" },
  { bg: "bg-red-300", text: "text-black" },
  { bg: "bg-blue-300", text: "text-black" },
  { bg: "bg-green-300", text: "text-black" },
  { bg: "bg-purple-300", text: "text-black" },
  { bg: "bg-pink-300", text: "text-black" }
]

// Default topics data - only used if no saved topics exist
const defaultTopics = [
//   {
//     id: "devops",
//     title: "DevOps",
//     members: "1.5M Members",
//     color: "bg-yellow-300",
//     textColor: "text-black",
//     // No icons initially - we'll use placeholders
//   },
  {
    id: "localllm",
    title: "LocalLLM",
    members: "470k Members",
    color: "bg-red-300",
    textColor: "text-black",
    // No icons initially - we'll use placeholders
  },
]

export function TopicsOverview() {
  // Initialize with empty array, we'll load from localStorage in useEffect
  const [topics, setTopics] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subredditName, setSubredditName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load topics from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const savedTopics = localStorage.getItem('topics')
      if (savedTopics) {
        try {
          const parsedTopics = JSON.parse(savedTopics)
          setTopics(parsedTopics)
        } catch (e) {
          console.error('Failed to parse saved topics:', e)
          // If parsing fails, use default topics
          setTopics(defaultTopics)
        }
      } else {
        // If no saved topics, use default topics
        setTopics(defaultTopics)
      }
      setIsInitialized(true)
    }
  }, [isInitialized])
  
  // Save topics to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && topics.length > 0) {
      localStorage.setItem('topics', JSON.stringify(topics))
    }
  }, [topics, isInitialized])
  
  // Function to add a new topic card
  const addNewTopic = () => {
    setIsModalOpen(true)
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subredditName.trim()) {
      setError("Please enter a subreddit name")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const requestData: RedditAnalysisRequest = {
        subreddits: [subredditName],
        search_limit: 20
      }
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("response: ", response)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data: RedditAnalysisResponse = await response.json()
      
      // Create new topic with API data
      const randomColorIndex = Math.floor(Math.random() * sampleColors.length)
      
      const newTopic = {
        id: subredditName.toLowerCase(),
        title: `r/${subredditName}`,
        members: `${data.total_posts} Posts`,
        color: sampleColors[randomColorIndex].bg,
        textColor: sampleColors[randomColorIndex].text,
        apiData: data
      }
      
      const updatedTopics = [...topics, newTopic]
      setTopics(updatedTopics)
      // Also save to localStorage immediately
      localStorage.setItem('topics', JSON.stringify(updatedTopics))
      
      setIsModalOpen(false)
      setSubredditName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-10 py-16">
      {/* <h1 className="text-3xl font-bold mb-8 text-center">Topics</h1> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {topics.map((topic) => (
          <Link href={`/topics/${topic.id}`} key={topic.id} className="block">
            <div className="bg-topic-card-bg/70 rounded-lg overflow-hidden border border-topic-card-border hover:border-secondary transition-colors h-[200px]">
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Use fixed placeholders instead of trying to load images */}
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden"
                    >
                      <div className="w-6 h-6 flex items-center justify-center text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#374151"/>
                          <path d="M12 8V16M8 12H16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`${topic.color} ${topic.textColor} font-bold py-1 px-3 inline-block mb-2`}>
                  {topic.title}
                </div>

                <div className="text-gray-400 flex items-center mt-2">
                  <User className="w-4 h-4 mr-1" />
                  {topic.members}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Add new topic card */}
        <div 
          className="bg-topic-card-bg/70 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors h-[200px] flex items-center justify-center cursor-pointer"
          onClick={addNewTopic}
        >
          <button className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
            <Plus className="h-8 w-8 text-white" />
          </button>
        </div>
      </div>

      {/* Modal for adding new subreddit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Subreddit</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="subreddit" className="block text-sm font-medium text-gray-300 mb-2">
                  Subreddit Name
                </label>
                <input
                  type="text"
                  id="subreddit"
                  value={subredditName}
                  onChange={(e) => setSubredditName(e.target.value)}
                  placeholder="e.g. programming"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  disabled={isLoading}
                />
                {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white mr-2"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-black font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

