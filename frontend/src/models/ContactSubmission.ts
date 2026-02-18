import mongoose from 'mongoose';

export interface IContactSubmission extends mongoose.Document {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new mongoose.Schema<IContactSubmission>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

export default mongoose.models.ContactSubmission || 
  mongoose.model<IContactSubmission>('ContactSubmission', contactSubmissionSchema);