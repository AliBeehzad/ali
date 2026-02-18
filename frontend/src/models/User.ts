import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

// NO PRE-SAVE HOOK - we hash in the script only!

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;