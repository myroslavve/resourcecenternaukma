import restApp from './app';
import { connectDB } from '../config/database';
import { config } from '../config/config';
import { ensureBootstrapAdmin } from '../services/AdminBootstrapService';

const PORT = config.port;

async function startRestServer() {
  try {
    await connectDB();
    await ensureBootstrapAdmin();

    restApp.listen(PORT, () => {
      console.log(`
Server: http://localhost:${PORT}                            
Health: http://localhost:${PORT}/api/health                 
Environment: ${config.nodeEnv}                                          

      `);
    });
  } catch (error) {
    console.error('Failed to start REST server:', error);
    process.exit(1);
  }
}

startRestServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down REST server gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down REST server gracefully...');
  process.exit(0);
});
