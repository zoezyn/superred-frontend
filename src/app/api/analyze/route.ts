import { NextResponse } from 'next/server'
import { RedditAnalysisRequest, RedditAnalysisResponse } from '@/types/reddit'

// TypeScript interfaces matching your Pydantic models
// interface RedditAnalysisRequest {
//   subreddits: string[];
//   search_limit?: number; // Optional field
// }

interface RedditPost {
  subreddit: string;
  title: string;
  content: string;
  url: string;
  score: number;
  num_comments: number;
}

interface Category {
  category_info: string;
  posts: RedditPost[];
}

// interface RedditAnalysisResponse {
//   categories: Record<string, Category>;
//   total_posts: number;
// }

export async function POST(request: Request) {
  try {
    const body: RedditAnalysisRequest = await request.json();
    
    // Validate request
    if (!body.subreddits || !Array.isArray(body.subreddits)) {
      return NextResponse.json(
        { error: 'Invalid request: subreddits must be an array' },
        { status: 400 }
      );
    }

    console.log("body: ", body)
    // Call your backend API
    const response = await fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data: RedditAnalysisResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze subreddit' },
      { status: 500 }
    );
  }
}

// Add health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'healthy' });
} 