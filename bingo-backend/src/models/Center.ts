import mongoose, { Document, Schema } from 'mongoose';

export interface ICenter extends Document {
    name: string;
    address: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    acceptedMaterials: string[];
    operatingHours: string;
    contactNumber: string;
}

const CenterSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: true, // [longitude, latitude]
            },
        },
        acceptedMaterials: [{ type: String }],
        operatingHours: { type: String },
        contactNumber: { type: String },
    },
    { timestamps: true }
);

// Create a geospatial index for queries calculating "near"
CenterSchema.index({ location: '2dsphere' });

export default mongoose.model<ICenter>('Center', CenterSchema);
