import graphqlApp from './app';
import { connectDB } from '../config/database';
import { config } from '../config/config';
import { ensureBootstrapAdmin } from '../services/AdminBootstrapService';

const PORT = config.graphqlPort;

async function startGraphqlServer() {
  try {
    await connectDB();
    await ensureBootstrapAdmin();

    graphqlApp.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  LIBRARY RESOURCE CENTER                      ║
║                     GraphQL Server Running                    ║
╠════════════════════════════════════════════════════════════════╣
║ Server: http://localhost:${PORT}                             ║
║ GraphQL: http://localhost:${PORT}/api/graphql                ║
║ Environment: ${config.nodeEnv}                                          ║
╚════════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start GraphQL server:', error);
    process.exit(1);
  }
}

startGraphqlServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down GraphQL server gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down GraphQL server gracefully...');
  process.exit(0);
});
