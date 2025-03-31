"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'

export function AuthModal({ 
  isOpen, 
  onClose,
  onSuccess
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  if (!isOpen) return null
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        // Show success message for sign up
        alert('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        onSuccess()
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/complete-profile`,
        }
      })
      
      if (error) throw error
      
      // The redirect will happen automatically
    } catch (error: any) {
      setError(error.message || 'An error occurred with Google sign in')
      setLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              {isSignUp ? 'Create Password' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              disabled={loading}
              required
            />
          </div>
          
          {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-brand text-black font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50 mb-4"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          
          <div className="flex justify-center  mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-zinc-300 text-sm hover:text-white transition-colors duration-200 underline"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t border-zinc-700">
          <p className="text-center text-sm text-zinc-400 mb-4">Or continue with</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-2 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function UserProfile({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  return (
    <div className="flex items-center">
      {/* <div className="mr-4">
        <p className="text-sm font-medium">{user.email}</p>
      </div> */}
      <button 
        onClick={onSignOut}
        className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-md cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  )
} 