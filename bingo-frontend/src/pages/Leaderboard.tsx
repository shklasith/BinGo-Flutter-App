import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import axios from 'axios';

export default function Leaderboard() {
    const [leaderData, setLeaderData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/users/leaderboard');
                if (response.data.success) {
                    setLeaderData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-gradient-to-br from-primary to-green-600 px-6 pt-12 pb-24 rounded-b-[2.5rem] relative text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Leaderboard</h1>
                <p className="text-green-100 text-sm">Top recylers in your area</p>

                {/* Top 3 Podium (visual) */}
                <div className="flex justify-center items-end gap-4 mt-8 h-32 relative z-10">
                    {/* 2nd Place */}
                    {leaderData[1] && (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg -mb-6 z-20">
                                <span className="font-bold text-slate-500">2</span>
                            </div>
                            <div className="h-24 w-20 bg-white/20 backdrop-blur-md rounded-t-xl border border-white/30 flex flex-col items-center justify-end pb-2">
                                <p className="text-white font-bold text-sm">{(leaderData[1].points / 1000).toFixed(1)}k</p>
                            </div>
                        </div>
                    )}
                    {/* 1st Place */}
                    {leaderData[0] && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 -mb-8 z-20">
                                <Trophy className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div className="h-32 w-20 bg-white/30 backdrop-blur-md rounded-t-xl border border-white/40 flex flex-col items-center justify-end pb-2">
                                <p className="text-white font-bold text-sm">{(leaderData[0].points / 1000).toFixed(1)}k</p>
                            </div>
                        </div>
                    )}
                    {/* 3rd Place */}
                    {leaderData[2] && (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full border-4 border-amber-600 flex items-center justify-center shadow-lg -mb-6 z-20">
                                <span className="font-bold text-amber-700">3</span>
                            </div>
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-t-xl border border-white/20 flex flex-col items-center justify-end pb-2">
                                <p className="text-white font-bold text-sm">{(leaderData[2].points / 1000).toFixed(1)}k</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    {leaderData.map((user, idx) => (
                        <div key={user._id} className={`flex items-center justify-between p-4 ${idx !== leaderData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold w-6 text-center ${idx < 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {idx + 1}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <UserAvatar name={user.username} />
                                    </div>
                                    <span className="font-bold text-gray-800">{user.username}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-primary">{user.points} <span className="text-xs text-gray-400 font-medium">pts</span></span>
                            </div>
                        </div>
                    ))}
                    {leaderData.length === 0 && (
                        <div className="p-8 text-center text-gray-500 italic">No users found yet. Be the first!</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function UserAvatar({ name }: { name: string }) {
    return <span className="font-bold">{name?.charAt(0) || '?'}</span>;
}

