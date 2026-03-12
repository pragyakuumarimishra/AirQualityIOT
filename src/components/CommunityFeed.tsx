'use client';

import { CommunityPost } from '@/types';
import { getAQIInfo, formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';

interface CommunityFeedProps {
  posts: CommunityPost[];
}

export default function CommunityFeed({ posts: initialPosts }: CommunityFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));

    const post: CommunityPost = {
      id: Date.now(),
      userId: 999,
      username: 'you',
      content: newPost,
      likes: 0,
      timestamp: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* New post form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share your air quality observations..."
          className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={submitting || !newPost.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Posting...' : 'Post Update'}
          </button>
        </div>
      </form>

      {/* Posts list */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                {post.username[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">@{post.username}</p>
                {post.location && <p className="text-xs text-gray-400">📍 {post.location}</p>}
              </div>
            </div>
            {post.aqi && (
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: getAQIInfo(post.aqi).color + '30',
                  color: getAQIInfo(post.aqi).color,
                }}
              >
                AQI {post.aqi}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-3">{post.content}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <span>❤️</span>
              <span>{post.likes}</span>
            </button>
            <span>{formatRelativeTime(post.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
