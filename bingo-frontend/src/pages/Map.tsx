import { useState, useEffect } from 'react';
import { Map as MapIcon, Search, ListFilter } from 'lucide-react';
import axios from 'axios';

export default function MapView() {
    const [centers, setCenters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                // For prototype, using fixed coords if geolocation fails
                const lat = 0; 
                const lng = 0;
                const response = await axios.get(`/api/centers/nearby?lat=${lat}&lng=${lng}`);
                if (response.data.success) {
                    setCenters(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching centers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCenters();
    }, []);

    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            {/* Search Header overlay */}
            <div className="absolute top-0 w-full z-10 p-4 pt-8">
                <div className="flex gap-2">
                    <div className="relative flex-1 opacity-95">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search centers..."
                            className="w-full bg-white rounded-full py-3.5 pl-12 pr-4 text-gray-800 shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button className="w-14 h-[52px] bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 opacity-95">
                        <ListFilter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Map visual placeholder */}
            <div className="flex-1 bg-blue-50 relative overflow-hidden">
                {/* Placeholder for actual map canvas (like Leaflet or Google Maps) */}
                <div className="absolute inset-0 pattern-grid-lg text-blue-100 opacity-50"></div>

                {/* Markers for real centers */}
                {centers.map((center, idx) => (
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

                {centers.length === 0 && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-gray-500 font-medium">No centers found. Try seeding the database.</p>
                    </div>
                )}
            </div>

            {/* Bottom info panel */}
            <div className="absolute bottom-20 w-full px-4 text-center">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-50 inline-block w-full max-w-sm">
                    <h3 className="font-bold text-gray-900 mb-1">
                        {loading ? 'Searching...' : `${centers.length} Centers Near You`}
                    </h3>
                    <p className="text-sm text-gray-500">Tap a pin to see dropping rules</p>
                </div>
            </div>
        </div>
    );
}

