import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    points: number;
    badges: string[];
    settings: {
        darkMode: boolean;
        scanReminders: boolean;
        recyclingTips: boolean;
    };
    impactStats: {
        treesSaved: number;
        plasticDiverted: number;
        co2Reduced: number;
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        points: { type: Number, default: 0 },
        badges: [{ type: String }],
        settings: {
            darkMode: { type: Boolean, default: false },
            scanReminders: { type: Boolean, default: true },
            recyclingTips: { type: Boolean, default: true },
        },
        impactStats: {
            treesSaved: { type: Number, default: 0 },
            plasticDiverted: { type: Number, default: 0 },
            co2Reduced: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

// Pre-save hook to hash password if it's new or modified
UserSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
