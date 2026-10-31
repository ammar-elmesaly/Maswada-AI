import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  clerk: {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
    secretKey: process.env.CLERK_SECRET_KEY || '',
  },
  sqlitePath: process.env.SQLITE_PATH || path.join(__dirname, '../../data/maswada.db'),
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  },
};

// Validate required config
if (!config.clerk.secretKey && config.nodeEnv !== 'test') {
  console.warn('⚠️  CLERK_SECRET_KEY is not set. Authentication will fail.');
}
if (!config.clerk.publishableKey && config.nodeEnv !== 'test') {
  console.warn('⚠️  CLERK_PUBLISHABLE_KEY is not set.');
}
