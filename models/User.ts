// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import { hash } from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  level: 'user' | 'IT' | 'admin';
  pinned?: string[];
  preferences?: {
    theme?: string;
    lastAgeFilter?: string;
    lastStatusFilter?: string;
  };
  notifications?: {
    unread: any[];
    read: any[];
  };
  streak?: {
    active: boolean;
    streak: number;
    lastDate: string;
    longestStreak: number;
    longestStreakDate: string;
  };
  password: string;
  username?: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  emailVerified: {
    type: Date,
    default: null
  },
  level: {
    type: String,
    enum: ['user', 'IT', 'admin'],
    default: 'user'
  },
  pinned: {
    type: [String],
    default: []
  },
  preferences: {
    theme: { type: String, default: '' },
    lastAgeFilter: { type: String, default: '' },
    lastStatusFilter: { type: String, default: '' }
  },
  notifications: {
    unread: { type: [Schema.Types.Mixed], default: [] },
    read: { type: [Schema.Types.Mixed], default: [] }
  },
  streak: {
    active: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    lastDate: { type: String, default: '' },
    longestStreak: { type: Number, default: 0 },
    longestStreakDate: { type: String, default: '' }
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  username: {
    type: String,
    sparse: true,
    trim: true
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hash(this.password, 12);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Create only the necessary indexes - removed duplicates
UserSchema.index({ name: 'text', email: 'text', username: 'text' });

// Create the model
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);