import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'SuperAdmin';
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Admin', 'SuperAdmin', 'SUPER_ADMIN', 'ADMIN'], default: 'Admin' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  if (!this.password.startsWith('$2b$') && !this.password.startsWith('$2a$')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
