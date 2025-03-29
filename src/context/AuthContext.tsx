'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  profile: any | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Function to fetch user profile
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
    if (!isClient) return
    
    
    // Initial fetch
    const fetchUser = async () => {
      try {
        
        const { data: { session } } = await supabase.auth.getSession()
        console.log("AuthContext useEffect running");
        const currentUser = session?.user || null
        
        console.log("Initial auth check - User:", currentUser?.id)
        setUser(currentUser)
        
        if (currentUser) {
          const profileData = await fetchUserProfile(currentUser.id)
          console.log("Initial profile fetch:", profileData)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error in initial auth check:', error)
      }
    }
    
    fetchUser()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event)
        const currentUser = session?.user || null
        setUser(currentUser)
        console.log("AuthContext-currentUser: ", currentUser)
        
        if (currentUser) {
          const profileData = await fetchUserProfile(currentUser.id)
          console.log("Profile after auth change:", profileData)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [isClient])
  
  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      // Force page refresh to clear all states
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  console.log("AuthContext render - User:", user?.id)
  console.log("AuthContext render - Profile:", profile?.first_name)
  
  return (
    <AuthContext.Provider value={{ user, profile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 