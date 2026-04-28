import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type WasteCategory = 'Recyclable' | 'Compost' | 'E-Waste' | 'Landfill' | 'Special' | 'Unknown';

export interface AppSettings {
  darkMode: boolean;
  scanReminders: boolean;
  recyclingTips: boolean;
}

export interface ImpactStats {
  treesSaved: number;
  plasticDiverted: number;
  co2Reduced: number;
}

export interface UserProfile {
  _id: string;
  uid: string;
  username: string;
  email: string;
  photoUrl?: string;
  points: number;
  badges: string[];
  settings: AppSettings;
  impactStats: ImpactStats;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface ClassificationResult {
  itemName: string;
  isWaste: boolean;
  category: WasteCategory;
  prepSteps: string[];
  confidence: number;
}

export interface ScanHistory {
  _id: string;
  userId?: string;
  storagePath: string;
  imageUrl: string;
  classificationResult: ClassificationResult;
  location?: {
    lat: number;
    lng: number;
  };
  pointsEarned: number;
  createdAt?: Timestamp | FieldValue;
}

export interface Center {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  acceptedMaterials: string[];
  operatingHours?: string;
  contactNumber?: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface EducationTip {
  _id: string;
  title: string;
  content: string;
  keywords: string[];
  active: boolean;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}
