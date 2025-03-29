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
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          career: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          career: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          career?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 

