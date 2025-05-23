import { RedditAnalysisResponse } from "@/types/reddit";
export interface UserProfile {
    id?: string | null;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    career: string;
    is_premium?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
  }


export interface Topic {
    id: string;
    title: string;
    subscribers: number;
    color: string;
    subreddit: string[];
    subreddit_icons?: string[];
    apiData: RedditAnalysisResponse; // You can further type this if you want
    created_at?: string;
    updated_at?: string;
    user_id?: string;
  }
  