"use client"

import { useState, useEffect } from "react"
import { TopicCard, AddTopicCard, AddSubredditModal, sampleColors } from "@/components/topic-card"
import { RedditAnalysisRequest, RedditAnalysisResponse } from "@/types/reddit"
import { supabase } from "@/lib/supabase"
import { AuthModal, UserProfile } from "@/components/auth"
import { User } from "@supabase/supabase-js"
import { useAuth } from "@/context/AuthContext"

// Default topics data - only used if no user is logged in
const defaultTopics = [
  {
    id: "localllm",
    title: "LocalLLM",
    members: "470k Members",
    color: "bg-red-300",
    // textColor: "text-black",
  },
]

export default function Home() {
  const [topics, setTopics] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [subredditName, setSubredditName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  // const [user, setUser] = useState<User | null>(null)
  const [subreddit, setSubreddit] = useState<string[]>([])
  // Check for existing session on load
  const { user, profile } = useAuth()

  console.log("page-user: ", user)
  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       setUser(session?.user || null)
  //     }
  //   )
    
  //   // Get initial session
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setUser(session?.user || null)
  //   })
    
  //   return () => subscription.unsubscribe()
  // }, [])
  
  // Load topics from Supabase when user changes
  useEffect(() => {
    const loadTopics = async () => {
      if (user) {
        try {
          setIsLoading(true)
          const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          if (error) throw error
          
          if (data) {
            // Transform database format to component format if needed
            const formattedTopics = data.map(topic => ({
              id: topic.id,
              title: topic.title,
              members: topic.members,
              color: topic.color,
              apiData: topic.api_data
            }))
            
            setTopics(formattedTopics)
          }
        } catch (error) {
          console.error('Error loading topics:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Not logged in, use default topics
        setTopics(defaultTopics)
      }
    }
    
    loadTopics()
  }, [user])
  
  // Function to add a new topic card
  const addNewTopic = () => {
    if (!user) {
      setIsAuthModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subredditName.trim()) {
      setError("Please enter a subreddit name")
      return
    }
    
    if (!user) {
      setIsAuthModalOpen(true)
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

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data: RedditAnalysisResponse = await response.json()
      
      // Create new topic with API data
      const randomColorIndex = Math.floor(Math.random() * sampleColors.length)
      
      const topicId = subredditName.toLowerCase()
      
      const newTopic = {
        id: topicId,
        title: `r/${subredditName}`,
        members: `${data.total_posts} Posts`,
        color: sampleColors[randomColorIndex].bg,
        subreddit: [subredditName],
        // textColor: sampleColors[randomColorIndex].text,
        apiData: data
      }
      
      // Save to Supabase
      const { error: dbError } = await supabase
        .from('topics')
        .insert({
          id: topicId,
          user_id: user.id,
          title: newTopic.title,
          subreddit: [subredditName],
          members: newTopic.members,
          color: newTopic.color,
          api_data: newTopic.apiData,
          created_at: new Date().toISOString()
        })
      
      if (dbError) throw dbError
      
      // Update local state
      setTopics([newTopic, ...topics])
      
      setIsModalOpen(false)
      setSubredditName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteTopic = async (topicId: string) => {
    if (!user) return
    
    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Update local state
      setTopics(topics.filter(topic => topic.id !== topicId))
    } catch (error) {
      console.error('Error deleting topic:', error)
    }
  }
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
  
  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false)
    
    // Get the current user
    // const { data: { user } } = await supabase.auth.getUser()
    // setUser(user)
    
    // Check if user has a profile, if not (e.g., Google sign-in) redirect to complete profile
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        // Redirect to complete profile page
        window.location.href = '/complete-profile'
      }
    }
  }

  return (
    <div className="container mx-auto px-10 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Topics</h1>
        {user ? (
          <UserProfile user={user} onSignOut={handleSignOut} />
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-1 bg-brand text-black font-medium rounded-md"
          >
            Sign In
          </button>
        )}
      </div>
      
      {isLoading && topics.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {topics.map((topic) => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              isAuthenticated={!!user}
              onDelete={handleDeleteTopic}
            />
          ))}

          {/* Add new topic card */}
          <AddTopicCard onClick={addNewTopic} />
        </div>
      )}

      {/* Modal for adding new subreddit */}
      <AddSubredditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        subredditName={subredditName}
        setSubredditName={setSubredditName}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
