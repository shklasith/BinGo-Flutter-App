import { useEffect, useState } from 'react';
import { Battery, Bell, GlassWater, Leaf, Navigation, Package, Search, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
    _id: string;
    name: string;
    address: string;
}

interface ApiEnvelope<T> {
    success: boolean;
    data: T;
}

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<AppUser | null>(null);
    const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
    const [nearbyCenter, setNearbyCenter] = useState<Center | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const session = getSession();
        if (!session) {
            navigate('/login');
            return;
        }

        const loadHomeData = async () => {
            try {
                const [profileRes, tipRes, centerRes] = await Promise.all([
                    api.get<ApiEnvelope<AppUser>>(`/api/users/${session.userId}`),
                    api.get<ApiEnvelope<DailyTip>>('/api/education/daily-tip'),
                    api.get<ApiEnvelope<Center[]>>('/api/centers/nearby', {
                        params: { lat: 6.9271, lng: 79.8612 }
                    })
                ]);

                setUser(profileRes.data.data);
                setDailyTip(tipRes.data.data);
                setNearbyCenter(centerRes.data.data[0] ?? null);
            } catch (loadError) {
                const message = loadError instanceof Error ? loadError.message : 'Failed to load home data';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        void loadHomeData();
    }, [navigate]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <div className="bg-gradient-to-br from-primary to-green-600 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-green-50 text-sm font-medium">Good Morning,</p>
                            <h2 className="text-white font-bold text-xl">{user?.username ?? 'Recycler'}</h2>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md text-white">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search how to recycle items..."
                        className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                </div>

                {dailyTip && (
                    <div className="mt-4 bg-white/90 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Daily Tip</p>
                        <p className="text-sm font-bold text-gray-800">{dailyTip.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{dailyTip.content}</p>
                    </div>
                )}
            </div>

            <div className="px-6 mt-6">
                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Your Impact</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {(user?.points ?? 0).toLocaleString()} <span className="text-sm text-primary font-semibold">pts</span>
                            </h3>
                        </div>
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center"><Leaf className="w-4 h-4 text-primary" /></div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"><GlassWater className="w-4 h-4 text-blue-500" /></div>
                            <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center"><Trophy className="w-4 h-4 text-yellow-500" /></div>
                        </div>
                    </div>

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

                <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Guide</h3>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { id: 1, name: 'Plastic', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { id: 2, name: 'Glass', icon: GlassWater, color: 'text-teal-500', bg: 'bg-teal-50' },
                        { id: 3, name: 'Paper', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
                        { id: 4, name: 'E-Waste', icon: Battery, color: 'text-orange-500', bg: 'bg-orange-50' }
                    ].map((category) => (
                        <div key={category.id} className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center mb-2 shadow-sm`}>
                                <category.icon className={`w-6 h-6 ${category.color}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{category.name}</span>
                        </div>
                    ))}
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
