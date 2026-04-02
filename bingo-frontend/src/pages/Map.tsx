import { useEffect, useState } from 'react';
import { ListFilter, Map as MapIcon, Search } from 'lucide-react';

import { api } from '../lib/api';

interface Center {
    _id: string;
    name: string;
    address: string;
    acceptedMaterials: string[];
}

interface ApiEnvelope<T> {
    success: boolean;
    data: T;
}

export default function MapView() {
    const [query, setQuery] = useState('');
    const [centers, setCenters] = useState<Center[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const response = await api.get<ApiEnvelope<Center[]>>('/api/centers/nearby', {
                    params: { lat: 6.9271, lng: 79.8612 }
                });
                if (response.data.success) {
                    setCenters(response.data.data);
                }
            } catch (loadError) {
                const message = loadError instanceof Error ? loadError.message : 'Failed to load centers';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        void fetchCenters();
    }, []);

    const filteredCenters = centers.filter((center) => {
        const value = query.trim().toLowerCase();
        if (!value) {
            return true;
        }

        return (
            center.name.toLowerCase().includes(value) ||
            center.address.toLowerCase().includes(value) ||
            center.acceptedMaterials.some((material) => material.toLowerCase().includes(value))
        );
    });

    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            <div className="absolute top-0 w-full z-10 p-4 pt-8">
                <div className="flex gap-2">
                    <div className="relative flex-1 opacity-95">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search centers..."
                            className="w-full bg-white rounded-full py-3.5 pl-12 pr-4 text-gray-800 shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button className="w-14 h-[52px] bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 opacity-95">
                        <ListFilter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-[#e0f7ef] to-[#d8ebff] relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                {filteredCenters.map((center, idx) => (
                    <div
                        key={center._id}
                        className="absolute"
                        style={{
                            top: `${30 + (idx * 15)}%`,
                            left: `${20 + (idx * 25)}%`
                        }}
                    >
                        <div className="relative group cursor-pointer">
                            <MapIcon className="w-10 h-10 text-primary drop-shadow-md z-10 relative" />
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl font-bold text-sm text-gray-900 opacity-100 transition-opacity whitespace-nowrap border border-gray-100">
                                {center.name}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-gray-500 font-medium">Loading centers...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {!loading && !error && filteredCenters.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-gray-500 font-medium">No centers found for that search.</p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-20 w-full px-4 text-center">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-50 inline-block w-full max-w-sm">
                    <h3 className="font-bold text-gray-900 mb-1">
                        {loading ? 'Searching...' : `${filteredCenters.length} Centers Near You`}
                    </h3>
                    <p className="text-sm text-gray-500">Tap a pin to see dropping rules</p>
                </div>
            </div>
        </div>
    );
}
