import { Trophy } from 'lucide-react';

const leaderData = [
    { rank: 1, name: 'Eco Warrior', points: 4250, change: 'up' },
    { rank: 2, name: 'Green Thumb', points: 3900, change: 'same' },
    { rank: 3, name: 'Recycle King', points: 3100, change: 'up' },
    { rank: 4, name: 'Planet Saver', points: 2800, change: 'down' },
    { rank: 5, name: 'Glass Master', points: 2200, change: 'same' },
];

export default function Leaderboard() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-gradient-to-br from-primary to-green-600 px-6 pt-12 pb-24 rounded-b-[2.5rem] relative text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Leaderboard</h1>
                <p className="text-green-100 text-sm">Top recylers in your area</p>

                {/* Top 3 Podium (visual) */}
                <div className="flex justify-center items-end gap-4 mt-8 h-32 relative z-10">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg -mb-6 z-20">
                            <span className="font-bold text-slate-500">2</span>
                        </div>
                        <div className="h-24 w-20 bg-white/20 backdrop-blur-md rounded-t-xl border border-white/30 flex flex-col items-center justify-end pb-2">
                            <p className="text-white font-bold text-sm">3.9k</p>
                        </div>
                    </div>
                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 -mb-8 z-20">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="h-32 w-20 bg-white/30 backdrop-blur-md rounded-t-xl border border-white/40 flex flex-col items-center justify-end pb-2">
                            <p className="text-white font-bold text-sm">4.2k</p>
                        </div>
                    </div>
                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full border-4 border-amber-600 flex items-center justify-center shadow-lg -mb-6 z-20">
                            <span className="font-bold text-amber-700">3</span>
                        </div>
                        <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-t-xl border border-white/20 flex flex-col items-center justify-end pb-2">
                            <p className="text-white font-bold text-sm">3.1k</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    {leaderData.map((user, idx) => (
                        <div key={user.rank} className={`flex items-center justify-between p-4 ${idx !== leaderData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold w-6 text-center ${user.rank <= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {user.rank}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <UserAvatar name={user.name} />
                                    </div>
                                    <span className="font-bold text-gray-800">{user.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-primary">{user.points} <span className="text-xs text-gray-400 font-medium">pts</span></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function UserAvatar({ name }: { name: string }) {
    return <span className="font-bold">{name.charAt(0)}</span>;
}
