import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    points: number;
    badges: string[];
    impactStats: {
        treesSaved: number;
        plasticDiverted: number;
        co2Reduced: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        points: { type: Number, default: 0 },
        badges: [{ type: String }],
        impactStats: {
            treesSaved: { type: Number, default: 0 },
            plasticDiverted: { type: Number, default: 0 },
            co2Reduced: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
