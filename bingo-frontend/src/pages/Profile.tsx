import { useState, useEffect } from 'react';
import { Settings, Award, History, Leaf, CircleCheck, BarChart4, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userData = JSON.parse(storedUser);
                const response = await axios.get(`/api/users/${userData._id}`);
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <div className="bg-white px-6 pt-12 pb-6 flex justify-between items-center shadow-sm relative z-10">
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                <div className="relative">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                    {showSettings && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <button 
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-red-600 flex items-center gap-2 hover:bg-gray-50 font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 mt-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-lg shrink-0">
                        <Leaf className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                        <p className="text-gray-500 font-medium">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 font-bold px-2.5 py-1 rounded-full text-xs mt-2">
                            <Award className="w-3.5 h-3.5" />
                            {user.points > 1000 ? 'Level 4 Recycler' : 'Level 1 Eco Starter'}
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 text-lg">Overall Impact</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                            <BarChart4 className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{user.points}</p>
                        <p className="text-sm font-medium text-gray-500">Total Points</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                            <CircleCheck className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{user.impactStats.plasticDiverted} kg</p>
                        <p className="text-sm font-medium text-gray-500">Plastic Diverted</p>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 text-lg">Badges Earned</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {user.badges.length > 0 ? (
                        user.badges.map((badge: string, i: number) => (
                            <div key={i} className="flex flex-col items-center shrink-0 w-24">
                                <div className="w-20 h-20 rounded-full border-4 border-primary/20 bg-white flex items-center justify-center shadow-sm mb-2 relative">
                                    <Award className={`w-8 h-8 ${i % 3 === 0 ? 'text-blue-500' : i % 3 === 1 ? 'text-teal-500' : 'text-green-600'}`} />
                                </div>
                                <p className="text-xs font-bold text-gray-700 text-center">{badge}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm italic">Scan items to earn badges!</p>
                    )}
                </div>

                <button className="w-full mt-6 bg-white border border-gray-200 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.99] transition-all shadow-sm">
                    <History className="w-5 h-5" />
                    View Full Scan History
                </button>
            </div>
        </div>
    );
}

