"use client"

import Link from "next/link"
import { Plus, User, X, Trash2, MoreVertical, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { RedditAnalysisRequest, RedditAnalysisResponse, SubredditInfo, SubredditSearchResponse, Category } from "@/types/reddit"

// Sample colors for new cards
export const sampleColors = [
  { bg: "bg-brand", text: "text-black" },
  { bg: "bg-yellow-300", text: "text-black" },
  { bg: "bg-red-300", text: "text-black" },
  { bg: "bg-blue-300", text: "text-black" },
  { bg: "bg-green-300", text: "text-black" },
  { bg: "bg-purple-300", text: "text-black" },
//   { bg: "bg-pink-300", text: "text-black" }
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

function formatSubscriberCount(count: number): string {
  if (!count && count !== 0) return "0";
  
  if (count >= 1000000) {
    // Round to nearest million
    return Math.round(count / 1000000) + 'M';
  }
  if (count >= 1000) {
    // Round to nearest thousand
    return Math.round(count / 1000) + 'K';
  }
  return count.toString();
}

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

  // Extract post icons from apiData if available
  // const postIcons = topic.apiData?.categories
  //   ? Array.from(new Set(
  //       Object.values(topic.apiData.categories as Record<string, Category>)
  //         .flatMap(category => category.posts)
  //         .filter(post => post.subreddit_icon !== null && post.subreddit_icon !== "")
  //         .map(post => post.subreddit_icon as string)
  //         .slice(0, 4)
  //     ))
  //   : [];
  // console.log("postIcons: ", postIcons)

  // If we have topic icons directly, use them (and filter out empty strings)
  const displayIcons = Array.isArray(topic.subreddit_icons) 
    ? topic.subreddit_icons.filter((icon: string) => icon && icon !== "") 
    : [];

  console.log("Array.isArray(topic.subreddit_icons): ", Array.isArray(topic.subreddit_icons))

  // console.log("subredditIcons: ", subredditIcons)
  
  // // Combine both sources of icons, prioritizing direct subreddit icons
  // const displayIcons = subredditIcons.length > 0 
  //   ? subredditIcons 
  //   : postIcons;

  // const displayIcons = subredditIcons
  console.log("displayIcons: ", displayIcons)
  console.log("topic.subreddit_icons: ", topic.subreddit_icons)
  // Determine how many placeholder icons we need (if any)
  // const placeholdersNeeded = Math.max(0, 4 - displayIcons.length);
  const maxIcons = 4;
  const placeholdersNeeded = displayIcons.length === 0 ? maxIcons : 
                             displayIcons.length < maxIcons ? maxIcons - displayIcons.length : 0;
  
  return (
    <Link href={`/topics/${topic.id}`} className="block relative group">
      <div 
        className=" bg-topic-card-bg/70 rounded-lg overflow-hidden border border-topic-card-border hover:border-secondary transition-colors "
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-4 flex flex-row h-[200px] justify-between gap-2">
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
          
          <div className="flex flex-wrap justify-center items-center gap-2 w-1/2">
            {/* Display actual subreddit icons if available */}
            {displayIcons.length > 0 ? (
              displayIcons.map((iconUrl: string, index: number) => (
                console.log("iconUrl: ", iconUrl),
                <div
                key={`icon-${index}`}
                className="w-15 h-15 bg-gray-800 rounded-sm flex items-center justify-center overflow-hidden"
              >
                <img 
                  src={iconUrl} 
                  alt="Subreddit icon" 
                  className="w-full h-full object-cover opacity-70"
                  onError={(e) => {
                    // Replace with placeholder if image fails to load
                    e.currentTarget.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 8v8M8 12h8'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            )) 
            ) : (
              <div className="w-15 h-15 bg-gray-800 rounded-sm flex items-center justify-center overflow-hidden">
                <span className="text-gray-400 text-xl">+</span>
              </div>
            )}
            
            {/* Add placeholders if we don't have enough icons */}
            {/* {Array.from({ length: placeholdersNeeded }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="w-15 h-15 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden"
              >
                <div className="w-6 h-6 flex items-center justify-center text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#374151"/>
                    <path d="M12 8V16M8 12H16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            ))} */}
          </div>
{/* 
          <div className={`${topic.color} text-black font-semibold py-2 px-4 inline-block mb-1 text-center overflow-hidden`}>
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.5rem,4vw,1.25rem)]">
                    {topic.title}
                </div>
            </div> */}
          <div className="flex flex-col justify-center max-w-1/2">
            <div className={`${topic.color} text-black text-xl font-bold py-2 px-4 inline-block mb-1 text-center`}>
                {topic.title}
                {/* {Array.isArray(topic.subreddit) && topic.subreddit.length > 1 && (
                  <span className="absolute  bg-zinc-700 text-white text-xs px-1 rounded-full">
                    {topic.subreddit.length}
                  </span>
                )} */}
            </div>

            <div className="text-gray-400 flex items-center mt-2 justify-center">
                <User className="w-4 h-4 mr-1" />
                {formatSubscriberCount(topic.subscribers)} subscribers
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SubredditInfo[]>([]);
  const [selectedSubreddits, setSelectedSubreddits] = useState<SubredditInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [step, setStep] = useState<"search" | "confirm">("search");
  
  
  // Reset modal state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep("search");
      setSearchQuery("");
      setSearchResults([]);
      setSelectedSubreddits([]);
      setSearchError("");
    }
  }, [isOpen]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term");
      return;
    }
    
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);
    
    try {
      const response = await fetch("/api/search-subreddits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: SubredditSearchResponse = await response.json();
      setSearchResults(data.subreddits || []);
      
      if (data.subreddits.length === 0) {
        setSearchError("No subreddits found matching your search");
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to search subreddits");
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleToggleSubreddit = (subreddit: SubredditInfo) => {
    setSelectedSubreddits(prev => {
      // Check if this subreddit is already selected
      const isAlreadySelected = prev.some(sr => sr.name === subreddit.name);
      
      if (isAlreadySelected) {
        // Remove it if already selected
        return prev.filter(sr => sr.name !== subreddit.name);
      } else {
        // Add it if not selected
        return [...prev, subreddit];
      }
    });
  };
  
  const handleConfirm = () => {
    console.log("selectedSubreddits: ", selectedSubreddits)
    if (selectedSubreddits.length === 0) {
      setSearchError("Please select at least one subreddit");
      return;
    }
    
    // Join all selected subreddit names with commas for display
    const selectedNames = selectedSubreddits.map(sr => sr.display_name).join(", ");
    setSubredditName(selectedNames);
    setStep("confirm");
  };
  
  const handleConfirmSubreddit = (e: React.FormEvent) => {
    onSubmit(e);
  };
  
  const handleBack = () => {
    setStep("search");
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {step === "search" ? "Search Subreddits" : "Confirm Subreddits"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {step === "search" ? (
          <>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="mb-4">
                <label htmlFor="subreddit-search" className="block text-sm font-medium text-gray-300 mb-2">
                  Search for Subreddits
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="subreddit-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. programming, science, music"
                    className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-white"
                    disabled={isSearching}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand text-black font-medium rounded-r-md hover:bg-opacity-90 disabled:opacity-50"
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </div>
                {searchError && <p className="mt-2 text-red-400 text-sm">{searchError}</p>}
              </div>
            </form>
            
            {selectedSubreddits.length > 0 && (
              <div className="bg-zinc-800 p-3 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-300">Selected Subreddits:</h3>
                  <span className="text-sm text-gray-400">{selectedSubreddits.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSubreddits.map((subreddit) => (
                    <div 
                      key={`selected-${subreddit.name}`}
                      className="flex items-center bg-zinc-700 text-sm rounded-full px-3 py-1 gap-2"
                    >
                      <span>r/{subreddit.display_name}</span>
                      <button 
                        onClick={() => handleToggleSubreddit(subreddit)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isSearching ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Select subreddits to analyze:</h3>
                {searchResults.map((subreddit) => {
                  console.log("subreddit: ", subreddit)
                  const isSelected = selectedSubreddits.some(sr => sr.name === subreddit.name);
                  return (
                    
                    <div 
                      key={subreddit.name}
                      className={`bg-zinc-800 hover:bg-zinc-700 p-3 rounded-md cursor-pointer transition-colors ${isSelected ? 'border border-brand' : ''}`}
                      onClick={() => handleToggleSubreddit(subreddit)}
                    >
                      <div className="flex justify-between items-center">
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4 w-4 rounded accent-brand"
                          />
                          
                          {subreddit.subreddit_icon ? (
                            console.log("subreddit.subreddit_icon: ", subreddit.subreddit_icon),
                            <img 
                              src={subreddit.subreddit_icon} 
                              alt={`r/${subreddit.display_name} icon`} 
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 8v8M8 12h8'/%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-white">r/</span>
                            </div>
                          )}
                          <h4 className="font-medium">r/{subreddit.display_name}</h4>
                        </div>
                        <span className="text-gray-400 text-sm">{subreddit.subscribers.toLocaleString()} members</span>
                      </div>
                      {subreddit.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2 ml-10">{subreddit.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
            
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              {selectedSubreddits.length > 0 && (
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-brand text-black font-medium rounded-md hover:bg-opacity-90"
                >
                  Continue with {selectedSubreddits.length} {selectedSubreddits.length === 1 ? 'subreddit' : 'subreddits'}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-3">Selected Subreddits</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedSubreddits.map((subreddit) => (
                    <div key={subreddit.name} className="flex items-center gap-3 p-2 bg-zinc-700 rounded-md">
                      {subreddit.subreddit_icon ? (
                        <img 
                          src={subreddit.subreddit_icon} 
                          alt={`r/${subreddit.display_name} icon`} 
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 8v8M8 12h8'/%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">r/</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">r/{subreddit.display_name}</h4>
                        <p className="text-gray-400 text-xs">{subreddit.subscribers.toLocaleString()} members</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-300 mt-4">
                  You've selected {selectedSubreddits.length} {selectedSubreddits.length === 1 ? 'subreddit' : 'subreddits'} to analyze. This will find common themes and pain points across these communities.
                </p>
                
                {/* Hidden input to store all subreddit data in JSON format */}
                <input 
                  type="hidden" 
                  id="selected-subreddit-data" 
                  value={JSON.stringify(selectedSubreddits.map(sr => ({
                    name: sr.display_name,
                    icon: sr.subreddit_icon || "",
                    subscribers: sr.subscribers || 0
                  })))} 
                />
              </div>
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-gray-300 hover:text-white"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleConfirmSubreddit}
                className="px-4 py-2 bg-brand text-black font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze Subreddits"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

