import mongoose from 'mongoose';

export interface IService extends mongoose.Document {
  title: string;
  slug: string;
  category: 'Construction' | 'Logistics' | 'Electricity' | 'Mining' | 'Other';
  description: string;
  image: string;
  icon?: string;
  features: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new mongoose.Schema<IService>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Construction', 'Logistics', 'Electricity', 'Mining', 'Other'],
    required: true,
    default: 'Other'
  },
  description: { type: String, required: true },
  image: { type: String, required: true },
  icon: { type: String },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);