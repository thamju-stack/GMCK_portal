import mongoose from 'mongoose';

export async function tryConnect(uri: string | undefined): Promise<boolean> {
  if (!uri) return false;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('[db] connected to MongoDB');
    return true;
  } catch {
    console.warn('[db] MongoDB unreachable — falling back to in-memory store');
    return false;
  }
}