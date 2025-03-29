"use client"

import Link from "next/link"
import { Plus, User, X, Trash2, MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { RedditAnalysisRequest, RedditAnalysisResponse } from "@/types/reddit"

// Sample colors for new cards
export const sampleColors = [
  { bg: "bg-brand", text: "text-black" },
  { bg: "bg-yellow-300", text: "text-black" },
  { bg: "bg-red-300", text: "text-black" },
  { bg: "bg-blue-300", text: "text-black" },
  { bg: "bg-green-300", text: "text-black" },
  { bg: "bg-purple-300", text: "text-black" },
  { bg: "bg-pink-300", text: "text-black" }
]

// // Default topics data - only used if no saved topics exist
// const defaultTopics = [
// //   {
// //     id: "devops",
// //     title: "DevOps",
// //     members: "1.5M Members",
// //     color: "bg-yellow-300",
// //     textColor: "text-black",
// //     // No icons initially - we'll use placeholders
// //   },
//   {
//     id: "localllm",
//     title: "LocalLLM",
//     members: "470k Members",
//     color: "bg-red-300",
//     textColor: "text-black",
//     // No icons initially - we'll use placeholders
//   },
// ]

// export function TopicsOverview() {
//   // Initialize with empty array, we'll load from localStorage in useEffect
//   const [topics, setTopics] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [subredditName, setSubredditName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [isInitialized, setIsInitialized] = useState(false)
  
//   // Load topics from localStorage on component mount
//   useEffect(() => {
//     if (typeof window !== 'undefined' && !isInitialized) {
//       const savedTopics = localStorage.getItem('topics')
//       if (savedTopics) {
//         try {
//           const parsedTopics = JSON.parse(savedTopics)
//           setTopics(parsedTopics)
//         } catch (e) {
//           console.error('Failed to parse saved topics:', e)
//           // If parsing fails, use default topics
//           setTopics(defaultTopics)
//         }
//       } else {
//         // If no saved topics, use default topics
//         setTopics(defaultTopics)
//       }
//       setIsInitialized(true)
//     }
//   }, [isInitialized])
  
//   // Save topics to localStorage whenever they change
//   useEffect(() => {
//     if (isInitialized && topics.length > 0) {
//       localStorage.setItem('topics', JSON.stringify(topics))
//     }
//   }, [topics, isInitialized])
  
//   // Function to add a new topic card
//   const addNewTopic = () => {
//     setIsModalOpen(true)
//   }

//   // Function to handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!subredditName.trim()) {
//       setError("Please enter a subreddit name")
//       return
//     }
    
//     setIsLoading(true)
//     setError("")
    
//     try {
//       const requestData: RedditAnalysisRequest = {
//         subreddits: [subredditName],
//         search_limit: 20
//       }
      
//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       })

//       console.log("response: ", response)
//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`)
//       }
      
//       const data: RedditAnalysisResponse = await response.json()
      
//       // Create new topic with API data
//       const randomColorIndex = Math.floor(Math.random() * sampleColors.length)
      
//       const newTopic = {
//         id: subredditName.toLowerCase(),
//         title: `r/${subredditName}`,
//         members: `${data.total_posts} Posts`,
//         color: sampleColors[randomColorIndex].bg,
//         textColor: sampleColors[randomColorIndex].text,
//         apiData: data
//       }
      
//       const updatedTopics = [...topics, newTopic]
//       setTopics(updatedTopics)
//       // Also save to localStorage immediately
//       localStorage.setItem('topics', JSON.stringify(updatedTopics))
      
//       setIsModalOpen(false)
//       setSubredditName("")
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch data")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto px-10 py-16">
//       {/* <h1 className="text-3xl font-bold mb-8 text-center">Topics</h1> */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
//         {topics.map((topic) => (
//           <Link href={`/topics/${topic.id}`} key={topic.id} className="block">
//             <div className="bg-topic-card-bg/70 rounded-lg overflow-hidden border border-topic-card-border hover:border-secondary transition-colors h-[200px]">
//               <div className="p-6">
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {/* Use fixed placeholders instead of trying to load images */}
//                   {[1, 2, 3, 4].map((_, index) => (
//                     <div
//                       key={index}
//                       className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden"
//                     >
//                       <div className="w-6 h-6 flex items-center justify-center text-gray-500">
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <rect width="24" height="24" rx="4" fill="#374151"/>
//                           <path d="M12 8V16M8 12H16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
//                         </svg>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className={`${topic.color} ${topic.textColor} font-bold py-1 px-3 inline-block mb-2`}>
//                   {topic.title}
//                 </div>

//                 <div className="text-gray-400 flex items-center mt-2">
//                   <User className="w-4 h-4 mr-1" />
//                   {topic.members}
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}

//         {/* Add new topic card */}
//         <div 
//           className="bg-topic-card-bg/70 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors h-[200px] flex items-center justify-center cursor-pointer"
//           onClick={addNewTopic}
//         >
//           <button className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
//             <Plus className="h-8 w-8 text-white" />
//           </button>
//         </div>
//       </div>

//       {/* Modal for adding new subreddit */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Add Subreddit</h2>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="subreddit" className="block text-sm font-medium text-gray-300 mb-2">
//                   Subreddit Name
//                 </label>
//                 <input
//                   type="text"
//                   id="subreddit"
//                   value={subredditName}
//                   onChange={(e) => setSubredditName(e.target.value)}
//                   placeholder="e.g. programming"
//                   className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
//                   disabled={isLoading}
//                 />
//                 {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
//               </div>
              
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 text-gray-300 hover:text-white mr-2"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-brand text-black font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Loading..." : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// Topic Card Component
export function TopicCard({ 
  topic, 
  isAuthenticated, 
  onDelete 
}: { 
  topic: any; 
  isAuthenticated: boolean;
  onDelete?: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(topic.id);
    }
    setShowMenu(false);
  };

  const handleMouseLeave = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  return (
    <Link href={`/topics/${topic.id}`} className="block relative group">
      <div 
        className=" bg-topic-card-bg/70 rounded-lg overflow-hidden border border-topic-card-border hover:border-secondary transition-colors "
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-6 flex flex-row h-[200px] justify-between gap-2">
          {isAuthenticated && (
            <div className="absolute top-2 right-2 ">
              <button 
                onClick={handleMenuToggle}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 bg-gray-800 hover:bg-gray-700 flex items-center"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Topic
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* <div className="grid grid-cols-2 auto-cols-fr gap-2 w-1/2"> */}
          <div className="flex flex-wrap justify-center items-center gap-2  w-1/2">
          {/* <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2"> */}
            {/* Use fixed placeholders instead of trying to load images */}

            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="w-15 h-15 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden"
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

          <div className="flex flex-col justify-center">
            <div className={`${topic.color} text-black text-xl font-bold py-2 px-4 inline-block mb-1`}>
                {topic.title}
            </div>

            <div className="text-gray-400 flex items-center mt-2 justify-center">
                <User className="w-4 h-4 mr-1" />
                {topic.members}
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  )
}

// Add New Topic Card Component
export function AddTopicCard({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="bg-topic-card-bg/70 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors h-[200px] flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <button className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
        <Plus className="h-8 w-8 text-white" />
      </button>
    </div>
  )
}

// Add Subreddit Modal Component
export function AddSubredditModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  subredditName, 
  setSubredditName, 
  isLoading, 
  error 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  subredditName: string;
  setSubredditName: (value: string) => void;
  isLoading: boolean;
  error: string;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Subreddit</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
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
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              disabled={isLoading}
            />
            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
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
  )
}

