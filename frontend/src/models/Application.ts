import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
  careerId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: {
    url: string;
    public_id: string;
    filename: string;
  };
  coverLetter?: string;
  experience: number;
  qualifications: string[];
  expectedSalary?: string;
  startDate?: Date;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const applicationSchema = new mongoose.Schema<IApplication>({
  careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    filename: { type: String, required: true }
  },
  coverLetter: { type: String },
  experience: { type: Number },
  qualifications: [{ type: String }],
  expectedSalary: { type: String },
  startDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  notes: { type: String },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);