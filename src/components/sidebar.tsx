"use client"

// import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Bookmark } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from "react"
import { UserProfile } from "@/types/tables"

export default function Sidebar() {
  const pathname = usePathname();
//   const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { user } = useAuth()

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
     
    <div className="w-[192px] h-full border-r flex flex-col bg-sidebar-bg border-sidebar-border">
      <div className="p-6">
        <Link href="/dashboard">
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
              {isLoggedIn ? <>{profile?.first_name[0]}{profile?.last_name[0]}</> : ""}
            </div>
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
          </div>
        </Link>
      </div>
    </div>
  )
}
