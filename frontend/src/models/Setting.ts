import mongoose from 'mongoose';

export interface ISetting extends mongoose.Document {
  key: string;
  value: any;
  type: 'text' | 'image' | 'number' | 'boolean' | 'json';
  group: 'general' | 'homepage' | 'contact' | 'seo';
  label: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new mongoose.Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['text', 'image', 'number', 'boolean', 'json'], default: 'text' },
  group: { type: String, enum: ['general', 'homepage', 'contact', 'seo'], default: 'general' },
  label: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', settingSchema);