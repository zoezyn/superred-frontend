"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from '@/context/AuthContext'
import { UserProfile } from "@/types/tables"

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!profile && window.location.pathname !== '/complete-profile') {
        // Redirect to complete profile page
        window.location.href = '/complete-profile'
      }
        
      // if (error) {
      //   console.error('Error fetching profile:', error)
      //   return null
      // }
      
      return profile
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


  const isLoggedIn = Boolean(user && profile)

  // console.log("sidebar-isLoggedIn: ", isLoggedIn)

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/saved', label: 'Saved', icon: <Bookmark size={18} /> },
    // { path: '/search', label: 'Search', icon: <Search size={20} /> },
    // { path: '/account', label: 'Account', icon: <LucideUser size={18} /> },
  ];

  return (
    <div className={`h-full border-r flex flex-col bg-sidebar-bg border-sidebar-border transition-all duration-200 ${isCollapsed ? "w-[64px]" : "w-[192px]"}`}>
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard">
          <h1 className={`font-black font-roboto italic cursor-pointer transition-all duration-200 text-2xl`}>
            <span className="text-brand">S</span>
            {!isCollapsed && <span className="text-brand">uper</span>}
            <br />
            <span className="text-brand">R</span>
            {!isCollapsed && <span className="text-brand">ed</span>}
          </h1>
        </Link>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="ml-2 p-1 rounded hover:bg-sidebar-item-bg transition"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-2 ${isCollapsed ? "justify-center" : "px-4"} text-sm rounded-xl transition-colors ${
                    isActive
                      ? 'text-accent  bg-sidebar-item-bg'
                      : 'text-secondary hover:bg-sidebar-item-bg'
                  }`}
                >
                  <span>{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`border-t border-sidebar-border ${isCollapsed ? "px-2 py-3" : "px-4 py-3"}`}>
        <Link href="/profile" className="block">
          <div className="flex items-center group cursor-pointer">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-medium bg-accent">
              {isLoggedIn ? <>{profile?.first_name[0]}{profile?.last_name[0]}</> : ""}
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                {isLoggedIn ?
                  <div>
                    <p className="text-sm font-medium group-hover:text-white transition-colors">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{profile?.career}</p>
                  </div>
                  :
                  <p className="text-sm font-medium text-primary">Username</p>
                }
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
