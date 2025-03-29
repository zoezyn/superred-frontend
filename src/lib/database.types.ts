export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: {
          id: string
          user_id: string
          title: string
          subreddit: string[]
          members: string
          color: string
          api_data: Json
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          title: string
          subreddit: string[]
          members: string
          color: string
          api_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          members?: string
          color?: string
          api_data?: Json
          created_at?: string
        }
      }
    }
  }
} 