import { NextResponse } from 'next/server';
import { mockCommunityPosts } from '@/lib/api';

export async function GET() {
  try {
    return NextResponse.json({ posts: mockCommunityPosts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch community posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = {
      id: Date.now(),
      userId: 999,
      username: body.username || 'anonymous',
      content: body.content,
      location: body.location,
      aqi: body.aqi,
      likes: 0,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
