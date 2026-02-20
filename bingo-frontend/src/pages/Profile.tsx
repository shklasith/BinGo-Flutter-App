import { Settings, Award, History, Leaf, CircleCheck, BarChart4 } from 'lucide-react';

export default function Profile() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <div className="bg-white px-6 pt-12 pb-6 flex justify-between items-center shadow-sm relative z-10">
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                <button className="text-gray-500 hover:text-gray-900 transition-colors">
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            <div className="px-6 mt-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-lg shrink-0">
                        <Leaf className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Eco Warrior</h2>
                        <p className="text-gray-500 font-medium">Joined Feb 2026</p>
                        <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 font-bold px-2.5 py-1 rounded-full text-xs mt-2">
                            <Award className="w-3.5 h-3.5" />
                            Level 4 Recycler
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 text-lg">Overall Impact</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                            <BarChart4 className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">142</p>
                        <p className="text-sm font-medium text-gray-500">Items Scanned</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                            <CircleCheck className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">92%</p>
                        <p className="text-sm font-medium text-gray-500">Sorting Accuracy</p>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 text-lg">Badges Earned</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {/* Badges */}
                    {['Glass Guardian', 'Plastic Hero', 'Compost Pro'].map((badge, i) => (
                        <div key={i} className="flex flex-col items-center shrink-0 w-24">
                            <div className="w-20 h-20 rounded-full border-4 border-primary/20 bg-white flex items-center justify-center shadow-sm mb-2 relative">
                                <Award className={`w-8 h-8 ${i === 0 ? 'text-blue-500' : i === 1 ? 'text-teal-500' : 'text-green-600'}`} />
                                <div className="absolute -bottom-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                                    x{i + 1}
                                </div>
                            </div>
                            <p className="text-xs font-bold text-gray-700 text-center">{badge}</p>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 bg-white border border-gray-200 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.99] transition-all shadow-sm">
                    <History className="w-5 h-5" />
                    View Full Scan History
                </button>
            </div>
        </div>
    );
}
