import { useEffect, useMemo, useState } from 'react';
import { ListFilter, MapPin, Search } from 'lucide-react';

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
    const load = async () => {
      try {
        const response = await api.get<ApiEnvelope<Center[]>>('/api/centers/nearby', {
          params: { lat: 6.9271, lng: 79.8612 },
        });
        setCenters(response.data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load centers';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredCenters = useMemo(
    () =>
      centers.filter((center) => center.name.toLowerCase().includes(query.toLowerCase())),
    [centers, query],
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 pt-8 pb-20">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search centers..."
            className="w-full bg-white rounded-full py-3.5 pl-12 pr-4 text-gray-800 shadow border border-gray-100 focus:outline-none"
          />
        </div>
        <button className="w-14 h-[52px] bg-white rounded-full flex items-center justify-center shadow border border-gray-100 text-gray-600">
          <ListFilter className="w-5 h-5" />
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading centers...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {filteredCenters.map((center) => (
            <div key={center._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900">{center.name}</h3>
                  <p className="text-sm text-gray-500">{center.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepts: {center.acceptedMaterials.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
