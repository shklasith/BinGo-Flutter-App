import { useEffect, useState } from 'react';

import { api } from '../lib/api';

interface LeaderboardUser {
  _id: string;
  username: string;
  points: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<ApiEnvelope<LeaderboardUser[]>>('/api/users/leaderboard');
        setUsers(response.data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load leaderboard';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leaderboard</h1>

      {loading && <p className="text-gray-500">Loading leaderboard...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {users.map((user, index) => (
            <div
              key={user._id}
              className={`flex items-center justify-between px-4 py-3 ${index < users.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 text-center font-bold text-gray-700">{index + 1}</div>
                <div className="font-semibold text-gray-900">{user.username}</div>
              </div>
              <div className="font-bold text-primary">{user.points} pts</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
