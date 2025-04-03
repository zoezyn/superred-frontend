import { NextResponse } from 'next/server';
import { SubredditSearchRequest, SubredditSearchResponse } from '@/types/reddit';

export async function POST(request: Request) {
  try {
    const body: SubredditSearchRequest = await request.json();
    
    // Validate request
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: query must be a string' },
        { status: 400 }
      );
    }

    console.log("Search subreddits request:", body);
    
    // Call your backend API
    const response = await fetch('http://127.0.0.1:8000/search-subreddits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data: SubredditSearchResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to search subreddits' },
      { status: 500 }
    );
  }
}

// Add health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'healthy' });
} 