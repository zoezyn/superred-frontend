// Shared types for Reddit API
export interface RedditAnalysisRequest {
  subreddits: string[];
  search_limit?: number;
}

export interface RedditPost {
  subreddit: string;
  // subreddit_icon: string | null;
  title: string;
  content: string;
  url: string;
  score: number;
  num_comments: number;
}

export interface Category {
//   category_info: string;
  category: string;
  pain_points: string;
  posts: RedditPost[];
}

export interface RedditAnalysisResponse {
  categories: Record<string, Category>;
  total_posts: number;
}

// Subreddit Search API types
export interface SubredditSearchRequest {
  query: string;
  limit?: number;
}

export interface SubredditInfo {
  name: string;
  display_name: string;
  description?: string;
  subscribers: number;
  url: string;
  subreddit_icon?: string;
}

export interface SubredditSearchResponse {
  subreddits: SubredditInfo[];
  count: number;
} 