import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Recycle, Info, Flame, AlertTriangle, Leaf } from 'lucide-react';

export default function ScanResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, imagePreview } = location.state || {};

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">No Scan Data</h2>
                <p className="text-gray-500 mb-6">Please scan an item first to see the analysis.</p>
                <button onClick={() => navigate('/scan')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg">Start Scanning</button>
            </div>
        );
    }

    const { classification, pointsEarned } = result;

    // Visual cues based on category
    const getCategoryTheme = (cat: string) => {
        switch (cat) {
            case 'Recyclable': return { color: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50', icon: Recycle, text: 'Blue Bin' };
            case 'Compost': return { color: 'text-green-500', bg: 'bg-green-500', lightBg: 'bg-green-50', icon: Leaf, text: 'Green Bin' };
            case 'Landfill': return { color: 'text-gray-800', bg: 'bg-gray-800', lightBg: 'bg-gray-100', icon: Flame, text: 'Black Bin' };
            default: return { color: 'text-orange-500', bg: 'bg-orange-500', lightBg: 'bg-orange-50', icon: AlertTriangle, text: 'Special Drop-off' };
        }
    };

    const theme = getCategoryTheme(classification.category);
    const Icon = theme.icon;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-8">
            {/* Header Image Area */}
            <div className="h-64 relative bg-gray-200">
                {imagePreview ? (
                    <img src={imagePreview} alt="Scanned item" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}

                {/* Dark gradient overlay for header controls */}
                <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent"></div>
                <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Prediction Badge */}
                <div className={`absolute -bottom-6 right-6 ${theme.bg} text-white px-4 py-2 rounded-xl shadow-xl font-bold flex items-center gap-2`}>
                    <CheckCircle2 className="w-5 h-5" />
                    {classification.category} {(classification.confidence * 100).toFixed(0)}%
                </div>
            </div>

            <div className="px-6 pt-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{classification.category} Item</h1>

                <div className={`inline-flex items-center gap-2 ${theme.lightBg} ${theme.color} font-bold px-3 py-1.5 rounded-lg text-sm mb-8`}>
                    <Icon className="w-4 h-4" />
                    Dispose in {theme.text}
                </div>

                {/* Preparation Steps */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900 text-lg">Preparation Steps</h3>
                    </div>

                    <ul className="space-y-4">
                        {classification.prepSteps.map((step: string, index: number) => (
                            <li key={index} className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">
                                    {index + 1}
                                </div>
                                <p className="text-gray-600 font-medium leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Rewards earned */}
                {pointsEarned > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-yellow-100 flex items-center justify-between mb-8">
                        <div>
                            <p className="text-yellow-800 font-bold">Awesome job!</p>
                            <p className="text-sm text-yellow-600 font-medium">You earned points for sorting.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl font-bold text-yellow-500 shadow-sm border border-yellow-100">
                            +{pointsEarned} pts
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-900/20 active:scale-95 transition-transform"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
