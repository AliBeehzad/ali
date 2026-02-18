import mongoose from 'mongoose';

export interface ICareer extends mongoose.Document {
  title: string;
  slug: string;
  department: 'Construction' | 'Logistics' | 'Electricity' | 'Mining' | 'Corporate';
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'hour' | 'month' | 'year';
  };
  deadline: Date;
  isActive: boolean;
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
}

const careerSchema = new mongoose.Schema<ICareer>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  department: { 
    type: String, 
    enum: ['Construction', 'Logistics', 'Electricity', 'Mining', 'Corporate'],
    required: true 
  },
  location: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    required: true 
  },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  qualifications: [{ type: String }],
  benefits: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hour', 'month', 'year'], default: 'year' }
  },
  deadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Career || mongoose.model<ICareer>('Career', careerSchema);