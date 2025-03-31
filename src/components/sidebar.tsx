"use client"

// import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, LucideUser, Settings, HelpCircle, Bookmark, RedoDotIcon as RedditIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from "react"

export default function Sidebar() {
  const pathname = usePathname();
//   const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const { user } = useAuth()

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
        
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Exception fetching profile:', error)
      return null
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id).then(data => setProfile(data))
    }
  }, [user])

//   const [isClient, setIsClient] = useState(true)

//   const [loading, setLoading] = useState(true)

  
  // Set isClient to true when component mounts (client-side only)
//   useEffect(() => {
//     setIsClient(true)
//   }, [])
  
//   useEffect(() => {
//     if (!isClient) return;
    


//     // Get current user
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (_event, session) => {
//         // setLoading(true)
//         const currentUser = session?.user || null
//         setUser(currentUser)
        
//         if (currentUser) {
//           // Fetch user profile
//           const { data } = await supabase
//             .from('user_profiles')
//             .select('*')
//             .eq('id', currentUser.id)
//             .single()
          
//           setProfile(data)
//         } else {
//           setProfile(null)
//         //   setLoading(false)
//         }
//       }
//     )

//     // Initial fetch
//     const fetchUser = async () => {
//         // setLoading(true)
//         const { data: { session } } = await supabase.auth.getSession()
//         const currentUser = session?.user || null
//         setUser(currentUser)
        
//         if (currentUser) {
//           // Fetch user profile
//           const { data } = await supabase
//             .from('user_profiles')
//             .select('*')
//             .eq('id', currentUser.id)
//             .single()
          
//           setProfile(data)
//         }
//         else {
//           setProfile(null)
//         }
//         // setLoading(false)
//       }
      
//       fetchUser()
//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [isClient])

  const isLoggedIn = Boolean(user && profile)

//   console.log("user1: ", user)
//   console.log("profile: ", profile)
  console.log("sidebar-isLoggedIn: ", isLoggedIn)
//   console.log("profile.first_name: ", profile?.first_name)
// //   console.log("loading: ", loading)
// //   console.log("pathname: ", pathname)
// //   console.log("isClient: ", isClient)
//   console.log("#########################")


  const mainNavItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/saved', label: 'Saved', icon: <Bookmark size={18} /> },
    // { path: '/search', label: 'Search', icon: <Search size={20} /> },
    // { path: '/account', label: 'Account', icon: <LucideUser size={18} /> },
  ];




  return (
    // <nav className="inset-y-0 left-0 z-[70] w-[192px] border-r bg-sidebar-bg border-sidebar-border">
    //     <div className="h-full flex flex-col">
    //         <div className="p-6 mb-5">
    //             <Link href="/">
    //                 <h1 className="text-2xl font-black font-roboto italic cursor-pointer">
    //                     <span className="text-brand" >Super</span>
    //                     <br />
    //                     <span className="text-brand" >Red</span>
    //                 </h1>
    //             </Link>
    //         </div>
    //         <div className="flex-1 overflow-y-auto px-3 ">
    //             <ul className="space-y-1">
    //             {mainNavItems.map((item) => {
    //                 const isActive = pathname === item.path;
    //                 return (
    //                 <li key={item.path}>
    //                     <Link 
    //                     href={item.path} 
    //                     className={`flex items-center p-2 px-4 text-sm rounded-xl transition-colors ${
    //                         isActive 
    //                         ? 'text-accent  bg-sidebar-item-bg' 
    //                         : 'text-secondary hover:bg-sidebar-item-bg'
    //                     }`}

    //                     >
    //                     <span className="mr-3">
    //                         {item.icon}
    //                     </span>
    //                     {item.label}
    //                     </Link>
    //                 </li>
    //                 );
    //             })}
    //             </ul>
    //         </div>
    //         <div className="px-4 py-3 border-t border-sidebar-border">
    //             <div className="flex items-center">
    //                 <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-medium bg-accent">
    //                     {isLoggedIn && isClient ? <>{profile.first_name[0]}{profile.last_name[0]}</> : ""}
    //                 </div>
    //                 <div className="ml-3">
    //                     {/* <p>hi</p> */}
    //                     {isLoggedIn && isClient ? 
                        
    //                     <div>
    //                         <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
    //                         <p className="text-xs text-gray-400">{profile.career}</p>
    //                     </div>
    //                     :
    //                     <p className="text-sm font-medium text-primary">Username</p>
                        
    //                     }
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </nav>
        
    <div className="w-[192px] h-full border-r flex flex-col bg-sidebar-bg border-sidebar-border">
      <div className="p-6">
        <Link href="/">
          <h1 className="text-2xl font-black font-roboto italic cursor-pointer">
            <span className="text-brand" >Super</span>
            <br />
            <span className="text-brand" >Red</span>
          </h1>
        </Link>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={`flex items-center p-2 px-4 text-sm rounded-xl transition-colors ${
                    isActive 
                      ? 'text-accent  bg-sidebar-item-bg' 
                      : 'text-secondary hover:bg-sidebar-item-bg'
                  }`}
                >
                  <span className="mr-3">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <Link href="/profile" className="block">
          <div className="flex items-center group cursor-pointer">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-medium bg-accent">
              {isLoggedIn ? <>{profile.first_name[0]}{profile.last_name[0]}</> : ""}
            </div>
            <div className="ml-3">
              {isLoggedIn ? 
                <div>
                  <p className="text-sm font-medium group-hover:text-white transition-colors">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs text-gray-400">{profile.career}</p>
                </div>
                :
                <p className="text-sm font-medium text-primary">Username</p>
              }
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
