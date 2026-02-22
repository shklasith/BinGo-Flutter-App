import { useState, useEffect } from 'react';
import { Leaf, Navigation, Bell, Search, Trophy, Package, Battery, GlassWater } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            {/* Header section with gradient */}
            <div className="bg-gradient-to-br from-primary to-green-600 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-green-50 text-sm font-medium">Good Morning,</p>
                            <h2 className="text-white font-bold text-xl">{user.username}</h2>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md text-white">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search how to recycle items..."
                        className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                </div>
            </div>

            <div className="px-6 mt-6">
                {/* Your Impact Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Your Impact</p>
                            <h3 className="text-3xl font-bold text-gray-900">{user.points.toLocaleString()} <span className="text-sm text-primary font-semibold">pts</span></h3>
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
                            <p className="text-sm font-bold text-gray-800 mt-1">{user.impactStats.plasticDiverted} kg</p>
                        </div>
                        <div className="w-px bg-gray-100"></div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 font-medium">CO2 Reduced</p>
                            <p className="text-sm font-bold text-gray-800 mt-1">{user.impactStats.co2Reduced} kg</p>
                        </div>
                        <div className="w-px bg-gray-100"></div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 font-medium">Trees Saved</p>
                            <p className="text-sm font-bold text-gray-800 mt-1">{user.impactStats.treesSaved}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Guide</h3>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { id: 1, name: 'Plastic', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { id: 2, name: 'Glass', icon: GlassWater, color: 'text-teal-500', bg: 'bg-teal-50' },
                        { id: 3, name: 'Paper', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
                        { id: 4, name: 'E-Waste', icon: Battery, color: 'text-orange-500', bg: 'bg-orange-50' }
                    ].map(cat => (
                        <div key={cat.id} className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-2 shadow-sm`}>
                                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{cat.name}</span>
                        </div>
                    ))}
                </div>

                {/* Nearby Center */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Nearby Center</h3>
                    <Link to="/map" className="text-xs font-bold text-primary">View All</Link>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <Navigation className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">City Eco Hub</h4>
                        <p className="text-sm text-gray-500">1.2 km away • Open till 5 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
