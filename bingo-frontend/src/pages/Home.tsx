import { useEffect, useState } from 'react';
import { Bell, Leaf, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

import { api } from '../lib/api';
import { getSession } from '../lib/session';

interface ImpactStats {
  treesSaved: number;
  plasticDiverted: number;
  co2Reduced: number;
}

interface AppUser {
  _id: string;
  username: string;
  points: number;
  impactStats: ImpactStats;
}

interface DailyTip {
  title: string;
  content: string;
}

interface Center {
  name: string;
  address: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export default function Home() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const [nearbyCenter, setNearbyCenter] = useState<Center | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      return;
    }

    const load = async () => {
      try {
        const [profileRes, tipRes, centerRes] = await Promise.all([
          api.get<ApiEnvelope<AppUser>>(`/api/users/${session.userId}`),
          api.get<ApiEnvelope<DailyTip>>('/api/education/daily-tip'),
          api.get<ApiEnvelope<Center[]>>('/api/centers/nearby', {
            params: { lat: 6.9271, lng: 79.8612 },
          }),
        ]);

        setUser(profileRes.data.data);
        setDailyTip(tipRes.data.data);
        setNearbyCenter(centerRes.data.data[0] ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load home data';
        setError(message);
      }
    };

    void load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-primary to-green-600 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-50 text-sm font-medium">Welcome back,</p>
              <h2 className="text-white font-bold text-xl">{user?.username ?? 'Recycler'}</h2>
            </div>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md text-white">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {dailyTip && (
          <div className="bg-white/90 rounded-2xl p-4">
            <p className="text-xs text-gray-500 font-semibold mb-1">Daily Tip</p>
            <p className="text-sm font-bold text-gray-800">{dailyTip.title}</p>
            <p className="text-xs text-gray-600 mt-1">{dailyTip.content}</p>
          </div>
        )}
      </div>

      <div className="px-6 mt-6">
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Your Impact</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {user?.points ?? 0} <span className="text-sm text-primary font-semibold">pts</span>
          </h3>

          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50">
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">Plastic Diverted</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{user?.impactStats.plasticDiverted ?? 0} kg</p>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">CO2 Reduced</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{user?.impactStats.co2Reduced ?? 0} kg</p>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">Trees Saved</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{user?.impactStats.treesSaved ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Nearby Center</h3>
          <Link to="/map" className="text-xs font-bold text-primary">View All</Link>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <Navigation className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{nearbyCenter?.name ?? 'No center loaded'}</h4>
            <p className="text-sm text-gray-500">{nearbyCenter?.address ?? 'Try opening map to refresh centers'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
