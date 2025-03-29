"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Bookmark, User as LucideUser } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!isClient) return;
    
    // Get current user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null
        setUser(currentUser)
        
        if (currentUser) {
          // Fetch user profile
          const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()
          
          setProfile(data)
        }
      }
    )
    
    // Initial fetch
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user || null
      setUser(currentUser)
      
      if (currentUser) {
        // Fetch user profile
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        
        setProfile(data)
      }
    }
    
    fetchUser()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [isClient])
  
  const mainNavItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/saved', label: 'Saved', icon: <Bookmark size={18} /> },
    { path: '/account', label: 'Account', icon: <LucideUser size={18} /> },
  ];
  

  return (
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
      
      <div className="p-4 border-t border-sidebar-border">
        {isClient && user && profile ? (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-black font-medium mr-3">
              {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-xs text-gray-400">{profile.career}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-medium mr-3">
              ZY
            </div>
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-xs text-gray-400">Not logged in</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

