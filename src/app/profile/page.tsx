"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { UserProfile } from "@/types/tables"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [downgradeLoading, setDowngradeLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    career: ''
  })

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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(data)
        setIsPremium(data.is_premium || false)
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          career: data.career
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          career: formData.career,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile({
        ...profile,
        ...formData
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  // const handleSignOut = async () => {
  //   try {
  //     await supabase.auth.signOut()
  //     window.location.href = '/'
  //   } catch (error) {
  //     console.error('Error signing out:', error)
  //   }
  // }

  const handleSignOut = async () => {
    try {
      // First clear the local session to prevent subsequent requests
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      // Always redirect regardless of logout success or failure
      window.location.replace('/')
    }
  }

  // At the top with other hooks
  useEffect(() => {
    // Only run this check after loading is complete
    if (!loading && user && !profile) {
      window.location.href = '/complete-profile'

    }
  }, [user, profile, loading])

  const handleCheckout = async () => {
    try {
      // Call the API endpoint to create a Stripe checkout session
      if (!user) return
      
      console.log('Starting checkout process for user:', user.id)
      
      const response = await fetch(`/api/create-checkout-session?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', response.status, errorData)
        throw new Error(`Failed to create checkout session: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Checkout session response:', data)
      
      if (data.url) {
        // Redirect to Stripe Checkout
        console.log('Redirecting to:', data.url)
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session, no URL returned')
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
      alert('There was an error starting the checkout process. Please try again.')
    }
  }

  const handleDowngrade = async () => {
    if (!user) return
    
    try {
      setDowngradeLoading(true)
      
      // Update user profile to free plan status
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_premium: false,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error downgrading subscription:', error)
        alert('There was an error downgrading your subscription. Please try again.')
        return
      }
      
      // Update local state
      setIsPremium(false)
      alert('Your subscription has been downgraded to the free plan.')
    } catch (error) {
      console.error('Error downgrading subscription:', error)
      alert('There was an error downgrading your subscription. Please try again.')
    } finally {
      setDowngradeLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p>Please sign in to view your profile.</p>
          <Link href="/" className="text-brand hover:underline mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    )
  }  else if (user && profile) {
    return (
      <div className="container mx-auto px-6 py-8 ">
      <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      {/* <div > */}
      <div className="flex gap-6 justify-center lg:flex-row flex-col">
      <div className="bg-zinc-900/95 rounded-lg p-6 border border-zinc-800 w-full lg:w-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-brand text-black text-sm font-medium rounded-md hover:bg-opacity-90 cursor-pointer hover:bg-brand/80 transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Career</label>
                <select
                  value={formData.career}
                  onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                  required
                >
                  <option value="">Select your career</option>
                  {careerOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-black font-medium rounded-md hover:bg-opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm text-gray-400">Name</h2>
              <p className="mt-1">{profile.first_name} {profile.last_name}</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-400">Email</h2>
              <p className="mt-1">{user.email}</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-400">Date of Birth</h2>
              <p className="mt-1">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-400">Career</h2>
              <p className="mt-1">{profile.career}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800">
              <button
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Section */}
      <div className="bg-zinc-900/95 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-bold mb-6">Subscription</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`rounded-lg p-5 border ${!isPremium ? 'border-brand bg-zinc-800/50' : 'border-zinc-700'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">Free Plan</h3>
                <p className="text-gray-400 text-sm mt-1">Basic features for personal use</p>
              </div>
              {!isPremium && (
                <span className="bg-brand text-black text-xs font-medium px-2 py-1 rounded">Current</span>
              )}
            </div>
            
            <p className="text-2xl font-bold mb-4">€0 <span className="text-gray-400 text-sm font-normal">/month</span></p>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Up to 2 topics</span>
              </li>
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Analyze 2 subreddits per topic</span>
              </li>
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Basic analytics</span>
              </li>
            </ul>
          </div>
          
          {/* Premium Plan */}
          <div className={`rounded-lg p-5 border ${isPremium ? 'border-brand bg-zinc-800/50' : 'border-zinc-700'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">Premium Plan</h3>
                <p className="text-gray-400 text-sm mt-1">Advanced features for power users</p>
              </div>
              {isPremium && (
                <span className="bg-brand text-black text-xs font-medium px-2 py-1 rounded">Current</span>
              )}
            </div>
            
            <p className="text-2xl font-bold mb-4">€10 <span className="text-gray-400 text-sm font-normal">/month</span></p>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Up to 20 topics</span>
              </li>
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Analyze 4 subreddits per topic</span>
              </li>
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Advanced analytics and insights</span>
              </li>
              <li className="flex items-center text-sm">
                <Check size={16} className="text-brand mr-2" />
                <span>Priority support</span>
              </li>
            </ul>
            
            {!isPremium && (
              <button
                onClick={handleCheckout}
                className="w-full py-2 bg-brand text-black text-sm font-medium rounded-md hover:bg-brand/80 transition-colors transition-all duration-300 cursor-pointer"
              >
                Upgrade to Premium
              </button>
            )}
            
            {isPremium && (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-400 mb-2">
                  Your premium subscription is active
                </div>
                <button
                  onClick={handleDowngrade}
                  disabled={downgradeLoading}
                  className="w-full py-2 bg-transparent border border-red-500 text-red-500 text-sm font-medium rounded-md hover:bg-red-500/10 transition-colors"
                >
                  {downgradeLoading ? 'Processing...' : 'Downgrade to Free Plan'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
  }
}
