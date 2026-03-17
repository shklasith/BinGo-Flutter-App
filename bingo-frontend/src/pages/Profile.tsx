import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, History, LogOut, Settings } from 'lucide-react';

import { api } from '../lib/api';
import { clearSession, getSession } from '../lib/session';

interface ImpactStats {
  treesSaved: number;
  plasticDiverted: number;
  co2Reduced: number;
}

interface UserProfile {
  _id: string;
  username: string;
  points: number;
  badges: string[];
  impactStats: ImpactStats;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const response = await api.get<ApiEnvelope<UserProfile>>(`/api/users/${session.userId}`);
        setUser(response.data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load profile';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [navigate]);

  const onLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-6 pt-12 pb-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <Settings className="w-6 h-6 text-gray-500" />
      </div>

      <div className="px-6 mt-6">
        {loading && <p className="text-gray-500">Loading profile...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {user && (
          <>
            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-500 mt-1">Total points: {user.points}</p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">Trees</p>
                <p className="font-bold text-gray-900">{user.impactStats.treesSaved}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">Plastic</p>
                <p className="font-bold text-gray-900">{user.impactStats.plasticDiverted}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">CO2</p>
                <p className="font-bold text-gray-900">{user.impactStats.co2Reduced}</p>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mt-6 mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {(user.badges.length ? user.badges : ['Starter']).map((badge) => (
                <div key={badge} className="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  <Award className="inline w-3 h-3 mr-1" />
                  {badge}
                </div>
              ))}
            </div>
          </>
        )}

        <button className="w-full mt-8 bg-white border border-gray-200 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-700 shadow-sm">
          <History className="w-5 h-5" />
          View Full Scan History
        </button>

        <button
          onClick={onLogout}
          className="w-full mt-3 bg-red-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
