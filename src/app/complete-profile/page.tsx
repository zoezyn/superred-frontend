"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { User } from "@supabase/supabase-js"

// Career options for the dropdown
const careerOptions = [
  "Student",
  "Developer",
  "Designer",
  "Marketer",
  "Founder",
  "Product Manager",
  "Data Scientist",
  "Researcher",
  "Educator",
  "Content Creator",
  "Other"
]

export default function CompleteProfile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [career, setCareer] = useState("")
  
  // Check if user is logged in and doesn't have a profile
  useEffect(() => {
    const checkUserAndProfile = async () => {
      setLoading(true)
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        // Not logged in, redirect to home
        router.push("/")
        return
      }
      
      setUser(session.user)
      
      // Check if user already has a profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (profile) {
        // User already has a profile, redirect to home
        router.push("/")
        return
      }
      
      setLoading(false)
    }
    
    checkUserAndProfile()
  }, [router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    // Validate form
    if (!firstName.trim()) {
      setError("First name is required")
      return
    }
    
    if (!lastName.trim()) {
      setError("Last name is required")
      return
    }
    
    if (!dateOfBirth) {
      setError("Date of birth is required")
      return
    }
    
    if (!career) {
      setError("Please select your career")
      return
    }
    
    setSubmitting(true)
    setError("")
    
    try {
      // console.log("Saving profile...", { firstName, lastName, dateOfBirth, career })
      
      // Insert user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          career: career
        })
      
      if (profileError) {
        console.error("Profile error:", profileError)
        throw profileError
      }
      
      // console.log("Profile saved successfully")
      
      // TODO: Update user metadata
      // Update user metadata
      // const { error: userUpdateError } = await supabase.auth.updateUser({
      //   data: {
      //     first_name: firstName,
      //     last_name: lastName
      //   }
      // })
      
      // if (userUpdateError) {
      //   console.error("User update error:", userUpdateError)
      //   // Continue even if metadata update fails
      // } else {
      //   console.log("User metadata updated successfully")
      // }
      
      setSuccess(true)
      // console.log("Redirecting to home page...")
      
      // Redirect immediately instead of waiting
      router.push("/")
    } catch (error) {
      console.error("Error saving profile:", error)
      if (error instanceof Error) {
        setError(error.message || "Failed to save profile")
      } else {
        setError("An unknown error occurred")
      }
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-md">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-md">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
        
        {success ? (
          <div className="bg-green-900/20 border border-green-800 text-green-300 p-4 rounded-md mb-6">
            Profile saved successfully! Redirecting you to the dashboard...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                    disabled={submitting}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                  disabled={submitting}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="career" className="block text-sm font-medium mb-1">
                  Career
                </label>
                <select
                  id="career"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                  disabled={submitting}
                  required
                >
                  <option value="">Select your career</option>
                  {careerOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="mt-6 flex justify-between items-center">
              <Link 
                href="/"
                className="text-zinc-400 text-sm hover:text-white transition-colors"
              >
                Skip for now
              </Link>
              
              <button
                type="submit"
                className="px-3 py-2 bg-brand text-black text-sm font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 