import mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
  title: string;
  slug: string;
  client: string;
  location: string;
  category: 'Construction' | 'Logistics' | 'Electricity' | 'Mining';
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  images: { url: string; public_id: string }[];
  featuredImage: string;
  startDate?: Date;
  endDate?: Date;
  projectValue?: string;
  featured: boolean;
  completed: boolean;
  testimonial?: {
    clientName: string;
    clientPosition: string;
    content: string;
    rating?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  client: { type: String, required: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Construction', 'Logistics', 'Electricity', 'Mining'],
    required: true 
  },
  description: { type: String, required: true },
  challenge: { type: String, required: true },
  solution: { type: String, required: true },
  results: [{ type: String }],
  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }],
  featuredImage: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  projectValue: { type: String },
  featured: { type: Boolean, default: false },
  completed: { type: Boolean, default: true },
  testimonial: {
    clientName: { type: String },
    clientPosition: { type: String },
    content: { type: String },
    rating: { type: Number, min: 1, max: 5 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);