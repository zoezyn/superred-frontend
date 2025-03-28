// Shared types for Reddit API
export interface RedditAnalysisRequest {
  subreddits: string[];
  search_limit?: number;
}

export interface RedditPost {
  subreddit: string;
  title: string;
  content: string;
  url: string;
  score: number;
  num_comments: number;
}

export interface Category {
  category_info: string;
  posts: RedditPost[];
}

export interface RedditAnalysisResponse {
  categories: Record<string, Category>;
  total_posts: number;
} 