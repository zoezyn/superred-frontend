"use client"

import { useState, useEffect } from "react"
import { TopicCard, AddTopicCard, AddSubredditModal, ManageSubredditsModal, sampleColors } from "@/components/topic-card"
import { RedditAnalysisRequest, RedditAnalysisResponse, SubredditInfo as BaseSubredditInfo } from "@/types/reddit"
import { supabase } from "@/lib/supabase"
import { AuthModal, UserProfile } from "@/components/auth"
// import { User } from "@supabase/supabase-js"
import { useAuth } from "@/context/AuthContext"
import { Topic } from "@/types/tables"
import { useRouter } from "next/navigation"
// Extended SubredditInfo type for our UI needs
interface SubredditInfo extends BaseSubredditInfo {
  _toRemove?: boolean;
}

// Default topics data - only used if no user is logged in
// const defaultTopics = [
//   {
//     id: "localllm",
//     title: "LocalLLM",
//     subscribers: 470000,
//     color: "bg-red-300",
//     subreddit: ["LocalLLM"],
//     subreddit_icons: ["https://www.redditstatic.com/desktop2x/img/id-cards/icon-reddit-large.png"],
//     apiData: {categories: {}, total_posts: 0},
//   },
// ]

export const maxDuration = 60; 

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [subredditName, setSubredditName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  // const [user, setUser] = useState<User | null>(null)
  // const [subreddit, setSubreddit] = useState<string[]>([])
  const [isManageSubredditsModalOpen, setIsManageSubredditsModalOpen] = useState(false)
  const [currentTopicToManage, setCurrentTopicToManage] = useState<Topic | null>(null)
  // Check for existing session on load
  const { user } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setIsAuthModalOpen(false)
      router.replace("/dashboard");
    }
  }, [user, router])

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
              subscribers: topic.subscribers,
              color: topic.color,
              subreddit_icons: topic.subreddit_icons,
              apiData: topic.api_data,
              subreddit: topic.subreddit,
              // numSubreddits: topic.subreddit?.length || 1
            }))
            
            setTopics(formattedTopics)
          }
        } catch (error) {
          console.error('Error loading topics:', error)
        } finally {
          setIsLoading(false)
        }
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
      // Get the selected subreddits data from the hidden input
      const selectedSubredditsInput = document.getElementById('selected-subreddit-data') as HTMLInputElement;
      let selectedSubreddits: { name: string; icon: string; subscribers?: number }[] = [];
      
      try {
        if (selectedSubredditsInput?.value) {
          selectedSubreddits = JSON.parse(selectedSubredditsInput.value);
        }
      } catch (err) {
        console.error("Error parsing selected subreddits:", err);
      }
      
      // If we have parsed data, use it; otherwise fall back to the single subredditName
      const subredditNames = selectedSubreddits.length > 0 
        ? selectedSubreddits.map(sr => sr.name) 
        : subredditName.split(',').map(name => name.trim());
      
      const requestData: RedditAnalysisRequest = {
        subreddits: subredditNames,
        search_limit: 50
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
      
      // Get a name and icon for the topic (using first subreddit as primary if multiple)
      const primarySubredditName = subredditNames[0];
      // const topicId = primarySubredditName.toLowerCase();
      
      // Get icon from either the selected subreddits data or from the API response
      let subredditIconUrl = null;

      
      if (selectedSubreddits.length > 0) {
        // Get up to 4 icons from the selected subreddits
        subredditIconUrl = selectedSubreddits
          .slice(0, 4)
          .map(sr => sr.icon || ""); // Replace null/undefined with empty string instead of filtering
      } 
      // else if (data.categories) {
      //   // If no selected subreddits with icons, try to extract from API response
      //   subredditIconUrl = Array.from(new Set(
      //     Object.values(data.categories)
      //       .flatMap(category => category.posts)
      //       .filter(post => post.subreddit_icon !== null)
      //       .map(post => post.subreddit_icon as string)
      //       .slice(0, 4)
      //   ));
      // }
      
      // else if (data.categories[0]?.posts[0]?.subreddit_icon) {
      //   subredditIconUrl = data.categories[0].posts[0].subreddit_icon;
      // }
      
      
      // Calculate total subscribers across all selected subreddits
      const totalSubscribers = selectedSubreddits.reduce((total, sr) => total + (sr.subscribers || 0), 0);
      
      // Create topic title based on number of subreddits
      const topicTitle = subredditNames.length === 1 
        ? primarySubredditName
        : `${primarySubredditName}+${subredditNames.length - 1}`;
      
      // Create new topic with API data
      const randomColorIndex = Math.floor(Math.random() * sampleColors.length)
      
      // const newTopic = {
      //   // id: uuidv4(),
      //   title: topicTitle,
      //   subscribers: totalSubscribers,
      //   color: sampleColors[randomColorIndex].bg,
      //   subreddit: subredditNames,
      //   subreddit_icons: subredditIconUrl,
      //   apiData: data
      // }
      // console.log("newTopic: ", newTopic)
      
      // Save to Supabase
      const {data: dataNewTopic, error } = await supabase
        .from('topics')
        .insert({
          // id: newTopic.id,
          user_id: user.id,
          title: topicTitle,
          subreddit: subredditNames,
          subscribers: totalSubscribers,
          color: sampleColors[randomColorIndex].bg,
          subreddit_icons: subredditIconUrl,
          api_data: data,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      // const {data2: Any2, error: dbError2} = await supabase
      //   .from('topics')
      //   .select('*')
      //   .eq('id', Any.id)
      //   .eq('user_id', user.id)
      //   .single()

      
      if (error) throw error
      
      // Update local state
      setTopics([dataNewTopic, ...topics])
      
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
      // First, delete all saved items related to this topic
      const { error: savedItemsError } = await supabase
        .from('saved_items')
        .delete()
        .eq('topic_id', topicId)
        .eq('user_id', user.id)
        
      if (savedItemsError) {
        console.error('Error deleting saved items:', savedItemsError)
        // Continue with topic deletion even if saved item deletion failed
      }
      
      // Then delete the topic
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
  
  const handleEditTitle = async (topicId: string, newTitle: string) => {
    if (!user) return
    
    try {
      // Update the topic title in Supabase
      const { error } = await supabase
        .from('topics')
        .update({ title: newTitle })
        .eq('id', topicId)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Update local state
      setTopics(topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, title: newTitle } 
          : topic
      ))
    } catch (error) {
      console.error('Error updating topic title:', error)
    }
  }
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // window.location.reload()
    window.location.href = '/'
  }
  
  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false)
    
    // Get the current user
    // const { data: { user } } = await supabase.auth.getUser()
    // setUser(user)
    
    // Check if user has a profile, if not (e.g., Google sign-in) redirect to complete profile
    // if (user) {
    //   const { data: profile } = await supabase
    //     .from('user_profiles')
    //     .select('*')
    //     .eq('id', user.id)
    //     .single()
      
    //   if (!profile) {
    //     // Redirect to complete profile page
    //     window.location.href = '/complete-profile'
    //   }
    // }
  }

  // Function to handle opening the manage subreddits modal
  const handleManageSubreddits = (topicId: string) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    
    const topicToManage = topics.find(topic => topic.id === topicId)
    if (topicToManage) {
      setCurrentTopicToManage(topicToManage)
      setIsManageSubredditsModalOpen(true)
    }
  }
  
  // Function to update a topic's subreddits
  const handleUpdateTopicSubreddits = async (topicId: string, subredditsToModify: SubredditInfo[]) => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // Get the current topic
      const currentTopic = topics.find(topic => topic.id === topicId)
      if (!currentTopic) throw new Error("Topic not found")
      
      // Get current subreddits as an array
      const currentSubreddits = currentTopic.subreddit || []
      
      // Separate subreddits to add and remove
      const subredditsToRemove = subredditsToModify
        .filter(sr => sr._toRemove)
        .map(sr => sr.display_name)

      
      const subredditsToAdd = subredditsToModify
        .filter(sr => !sr._toRemove)
        .map(sr => sr.display_name)

      
      // Create the updated subreddit list
      const updatedSubreddits = currentSubreddits
        .filter((name: string) => !subredditsToRemove.includes(name))
        .concat(subredditsToAdd)
      
      // Extract up to 4 subreddit icons from the selected subreddits
      const updatedSubredditIcons = subredditsToModify
        .filter(sr => !sr._toRemove)
        .map(sr => sr.subreddit_icon || "")
        .concat(currentTopic.subreddit_icons || [])
        .filter(icon => icon !== "")
        .slice(0, 4)


      // Get the current subscribers count
      const currentSubscribers = currentTopic.subscribers || 0;

      // Calculate subscribers from newly added subreddits
      const newSubscribers = subredditsToModify
        .filter(sr => !sr._toRemove)
        .reduce((total, sr) => total + (sr.subscribers || 0), 0);
      
      // Calculate subscribers from removed subreddits (if we have that data)
      const removedSubscribers = subredditsToModify
        .filter(sr => sr._toRemove)
        .reduce((total, sr) => total + (sr.subscribers || 0), 0);
      
      // Calculate the total subscribers (current + added - removed)
      const totalSubscribers = currentSubscribers + newSubscribers - removedSubscribers;
      
      // // Calculate the total subscribers across all subreddits
      // const addedSubscribers = subredditsToModify
      //   .filter(sr => !sr._toRemove)
      //   .reduce((total, sr) => total + (sr.subscribers || 0), 0)

      
      // Subtract removed subreddits subscribers if known (might not be accurate)
      // For now, we'll recalculate based on API data
      
      // Call the Reddit API to analyze the updated subreddits
      const requestData: RedditAnalysisRequest = {
        subreddits: updatedSubreddits,
        search_limit: 50
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
      
      // Create a name for the topic based on the number of subreddits
      // const primarySubredditName = updatedSubreddits[0]
      // const topicTitle = updatedSubreddits.length === 1 
      //   ? primarySubredditName
      //   : `${primarySubredditName}+${updatedSubreddits.length - 1}`
      

              // Merge the new API data with existing data
      // const mergedApiData = {
      //   ...currentTopic.apiData,
      //   ...data,
      //   // Merge categories if both exist
      //   categories: {
      //     ...(currentTopic.apiData?.categories || {}),
      //     ...(data.categories || {})
      //   }
      // };
      // Update the topic in Supabase
      const { error: dbError } = await supabase
        .from('topics')
        .update({
          // title: topicTitle,
          subreddit: updatedSubreddits,
          subreddit_icons: updatedSubredditIcons,
          subscribers: totalSubscribers, // This is approximate
          api_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId)
        .eq('user_id', user.id)
      
      if (dbError) throw dbError
      
      // Update local state
      setTopics(prev => prev.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            // title: topicTitle,
            subreddit: updatedSubreddits,
            subreddit_icons: updatedSubredditIcons,
            subscribers: totalSubscribers, // This is approximate
            apiData: data,
            // subredditss: updatedSubreddits
          }
        }
        return topic
      }))
      
      // Close the modal
      setIsManageSubredditsModalOpen(false)
      setCurrentTopicToManage(null)
    } catch (err) {
      console.error('Error updating topic subreddits:', err)
      setError(err instanceof Error ? err.message : "Failed to update subreddits")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-10 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Topics</h1>
        {user ? (
          <UserProfile onSignOut={handleSignOut} />
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-1 bg-brand text-black font-medium rounded-md hover:bg-brand/80 transition-colors duration-200 cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
      
      {isLoading && topics.length === 0 ? (
        <div className="flex justify-center py-12" key="loading-spinner">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {topics.map((topic) => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              // subredditss={topic.subredditss}
              isAuthenticated={!!user}
              onDelete={handleDeleteTopic}
              onEdit={handleEditTitle}
              onManageSubreddits={handleManageSubreddits}
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


