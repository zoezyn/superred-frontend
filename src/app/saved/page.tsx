"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Bookmark } from "lucide-react"

interface SavedItem {
  id: string
  topic_id: string
  category_name: string
  pain_point: string
  created_at: string
}

export default function Saved() {
  const { user } = useAuth()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSavedItems = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('saved_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setSavedItems(data || [])
      } catch (error) {
        console.error('Error loading saved items:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSavedItems()
  }, [user])

  const handleUnsave = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', itemId)
      
      if (error) throw error
      
      setSavedItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing saved item:', error)
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

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Saved Items</h1>
      
      {savedItems.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
          <p>No saved items yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <div key={item.id} className="bg-zinc-900/95 rounded-lg p-6 border border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <Link 
                    href={`/topics/${item.topic_id}`}
                    className="text-xl font-bold hover:text-brand transition-colors"
                  >
                    {item.category_name}
                  </Link>
                  <p className="text-gray-400 mt-2">
                    {item.pain_point}
                  </p>
                  <div className="mt-4 text-gray-500 text-sm">
                    Saved {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleUnsave(item.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Bookmark size={20} className="fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 