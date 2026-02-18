import { IUser } from '@/models/User';

declare module 'mongoose' {
  interface Model<T> {
    // Add any custom static methods here
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      // Add other env vars
    }
  }
}