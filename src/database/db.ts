import mongoose from 'mongoose';

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */

const mongoConnection = {
  isConnected: 0
}

export const connect = async() => {
  if (mongoConnection.isConnected) {
    console.log('We were connected');
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      console.log('Using last connection');
      return;
    }

    await mongoose.disconnect();
  }

  await mongoose.connect(process.env.MONGODB_URI || '');
  mongoConnection.isConnected = 1;
  console.log('MongoDB connected:', process.env.MONGODB_URI);
}

export const disconnect = async() => {
  return;
  if (process.env.NODE_ENV === 'development') return;
  if (!mongoConnection.isConnected) return;

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;

  console.log('MongoDB disconnected');
}