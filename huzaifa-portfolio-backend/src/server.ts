import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down...');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (e) {
    logger.error('Failed:', e);
    process.exit(1);
  }
};

startServer();