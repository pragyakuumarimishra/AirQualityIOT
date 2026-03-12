'use client';

import { useState, useEffect } from 'react';
import CommunityFeed from '@/components/CommunityFeed';
import { CommunityPost } from '@/types';

const mockBadges = [
  { icon: '🌱', name: 'Green Starter', description: 'First data contribution', earned: true },
  { icon: '📡', name: 'Sensor Champion', description: '10 sensor reports', earned: true },
  { icon: '🔬', name: 'Citizen Scientist', description: '50 data points submitted', earned: false },
  { icon: '🏆', name: 'Air Guardian', description: '100 community actions', earned: false },
  { icon: '🌍', name: 'Earth Defender', description: 'Top 10 contributor this month', earned: false },
  { icon: '⚡', name: 'Data Streamer', description: '30-day contribution streak', earned: false },
];

const leaderboard = [
  { rank: 1, username: 'eco_warrior_nyc', points: 1250, badge: '🥇' },
  { rank: 2, username: 'clean_air_advocate', points: 980, badge: '🥈' },
  { rank: 3, username: 'citizen_scientist_42', points: 845, badge: '🥉' },
  { rank: 4, username: 'green_guardian_bk', points: 720, badge: '4️⃣' },
  { rank: 5, username: 'air_monitor_pro', points: 650, badge: '5️⃣' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'badges'>('feed');

  useEffect(() => {
    fetch('/api/community/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Community Hub</h1>
        <p className="text-gray-500 text-sm">Join the citizen science movement for cleaner air</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Members', value: '2,847', icon: '👥' },
          { label: 'Data Points', value: '48,291', icon: '📊' },
          { label: 'Reports Filed', value: '1,203', icon: '📝' },
          { label: 'Trees Planted', value: '342', icon: '🌳' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: 'feed', label: '💬 Community Feed' },
          { key: 'leaderboard', label: '🏆 Leaderboard' },
          { key: 'badges', label: '🎖️ Badges' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'feed' && (
        <div className="max-w-2xl">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <CommunityFeed posts={posts} />
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h3 className="font-semibold">Top Contributors This Month</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {leaderboard.map(entry => (
                <div key={entry.rank} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{entry.badge}</span>
                    <div>
                      <p className="font-medium text-gray-800">@{entry.username}</p>
                      <p className="text-xs text-gray-400">Rank #{entry.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your stats placeholder */}
          <div className="mt-4 bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-800 mb-1">Your Stats</p>
            <p className="text-sm text-blue-700">Sign in to track your contributions and rank!</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Join Community
            </button>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {mockBadges.map(badge => (
            <div
              key={badge.name}
              className={`bg-white rounded-xl p-4 shadow-sm text-center ${!badge.earned ? 'opacity-50 grayscale' : ''}`}
            >
              <p className="text-3xl mb-2">{badge.icon}</p>
              <p className="text-sm font-semibold text-gray-800">{badge.name}</p>
              <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              {badge.earned && (
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Earned!
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
