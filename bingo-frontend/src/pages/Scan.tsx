import { useRef, useState } from 'react';
import { Camera as CameraIcon, Image as ImageIcon, X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { api } from '../lib/api';
import { getSession } from '../lib/session';

interface ScanResultData {
    classification: {
        category: string;
        confidence: number;
        prepSteps: string[];
    };
    pointsEarned: number;
    scanId: string;
    newTotalPoints: number;
}

interface ApiEnvelope<T> {
    success: boolean;
    data: T;
}

export default function Scan() {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCapture = async (file: File) => {
        const session = getSession();
        if (!session) {
            navigate('/login');
            return;
        }

        setIsScanning(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post<ApiEnvelope<ScanResultData>>('/api/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const previewUrl = URL.createObjectURL(file);
                navigate('/scan/result', {
                    state: {
                        result: response.data.data,
                        imagePreview: previewUrl
                    }
                });
            }
        } catch (error) {
            console.error('Scanning Error:', error);
            alert('Failed to analyze image. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            void handleCapture(event.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-black relative">
            <div className="absolute top-0 w-full z-10 p-6 flex justify-between items-center text-white">
                <button onClick={() => navigate(-1)} className="p-2 bg-black/20 backdrop-blur-md rounded-full">
                    <X className="w-6 h-6" />
                </button>
                <button className="p-2 bg-black/20 backdrop-blur-md rounded-full">
                    <Zap className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center pt-10">
                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-3xl -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-3xl -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-3xl -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-3xl -mb-1 -mr-1"></div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <p className="absolute bottom-[-40px] w-full text-center text-white/70 text-sm font-medium">Position item in frame</p>
                </div>

                {isScanning && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="w-16 h-16 border-4 border-white border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-bold text-lg animate-pulse">Analyzing Material with AI...</p>
                    </div>
                )}
            </div>

            <div className="h-40 bg-black/80 backdrop-blur-md w-full rounded-t-[2.5rem] flex items-center justify-center gap-12 px-8 pb-8">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                <button
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-1 active:scale-95 transition-transform"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-full h-full rounded-full border-2 border-black flex items-center justify-center bg-gray-100">
                        <CameraIcon className="w-8 h-8 text-black" />
                    </div>
                </button>

                <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white opacity-0 pointer-events-none"></button>
            </div>

            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
}
