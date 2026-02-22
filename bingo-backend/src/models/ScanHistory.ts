import mongoose, { Document, Schema } from 'mongoose';

export interface IScanHistory extends Document {
    userId: mongoose.Types.ObjectId;
    imageUrl: string;
    classificationResult: {
        itemName: string;
        isWaste: boolean;
        category: 'Recyclable' | 'Compost' | 'E-Waste' | 'Landfill' | 'Special' | 'Unknown';
        prepSteps: string[];
        confidence: number;
    };
    location?: {
        lat: number;
        lng: number;
    };
    pointsEarned: number;
    createdAt: Date;
}

const ScanHistorySchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
        imageUrl: { type: String, required: true }, // URL after uploading to cloud storage or local path
        classificationResult: {
            itemName: { type: String },
            isWaste: { type: Boolean, default: true },
            category: {
                type: String,
                enum: ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown'],
                required: true,
            },
            prepSteps: [{ type: String }],
            confidence: { type: Number },
        },
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
        pointsEarned: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IScanHistory>('ScanHistory', ScanHistorySchema);
