import { app, initializeApp } from './app';
import logger from './logger/pino';

const port = process.env.PORT || 3000;

export const startServer = async () => {
  try {
    await initializeApp();

    logger.info('App Initilized');

    app.listen(port, () => {
      logger.info(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();

export default { startServer };
