'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
//   profile: any | null
//   signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
//   profile: null,
//   signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // const [profile, setProfile] = useState<any>(null)
  // const [isClient, setIsClient] = useState(false)
  
  
useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
//   // Sign out function
//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut()
//       // Force page refresh to clear all states
//       window.location.href = '/'
//     } catch (error) {
//       console.error('Error signing out:', error)
//     }
//   }
  
//   console.log("AuthContext render - User:", user?.id)
//   console.log("AuthContext render - Profile:", profile?.first_name)
  
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 