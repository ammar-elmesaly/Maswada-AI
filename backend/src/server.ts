import { createApp } from './app';
import { config } from './config/env';
import { initializeDatabase } from './db/sequelize';

async function start() {
  try {
    // Initialize database
    await initializeDatabase();

    // Create and start Express app
    const app = createApp();
    
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🤖 Gemini: ${config.gemini.apiKey ? 'Configured ✓' : 'Not configured (set GEMINI_API_KEY)'}`);
      if (config.gemini.apiKey) {
        console.log(`🎯 Gemini Model: ${config.gemini.model}`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
