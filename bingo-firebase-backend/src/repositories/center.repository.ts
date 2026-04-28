import { db, serverTimestamp } from '../config/firebase';
import { Center } from '../types/domain';
import { distanceInMeters } from '../utils/distance';

const centers = db.collection('centers');

const toCenter = (id: string, data: FirebaseFirestore.DocumentData): Center => ({
  _id: id,
  name: data.name,
  address: data.address,
  lat: data.lat,
  lng: data.lng,
  acceptedMaterials: data.acceptedMaterials ?? [],
  operatingHours: data.operatingHours,
  contactNumber: data.contactNumber,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const seedCenters = async (): Promise<void> => {
  const dummyCenters = [
    {
      name: 'Colombo Recycling Hub',
      address: '123 Main St, Colombo',
      lat: 6.9271,
      lng: 79.8612,
      acceptedMaterials: ['Recyclable', 'E-Waste'],
      operatingHours: '9 AM - 5 PM',
      contactNumber: '0112345678',
    },
    {
      name: 'Green Compost Center',
      address: '45 Park Rd, Colombo',
      lat: 6.93,
      lng: 79.87,
      acceptedMaterials: ['Compost'],
      operatingHours: '8 AM - 4 PM',
      contactNumber: '0112345679',
    },
  ];

  const existing = await centers.limit(100).get();
  const batch = db.batch();
  existing.docs.forEach((doc) => batch.delete(doc.ref));
  dummyCenters.forEach((center) => batch.set(centers.doc(), { ...center, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  await batch.commit();
};

export const getNearbyCenters = async (lat: number, lng: number, radius: number): Promise<Center[]> => {
  const snapshot = await centers.limit(100).get();
  return snapshot.docs
    .map((doc) => {
      const center = toCenter(doc.id, doc.data());
      return { center, distance: distanceInMeters(lat, lng, center.lat, center.lng) };
    })
    .filter(({ distance }) => distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .map(({ center }) => center);
};
