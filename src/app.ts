import express, { Express } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import expressPinoLogger from 'express-pino-logger';
import { initializeDB } from './config/database';
import routes from './routes/apiRoutes';
import errorHandler from './middleware/errorHandler';
import logger from './logger/pino';

const app: Express = express();

app.use(expressPinoLogger({ logger: logger as any }));

app.use(express.json());

const initializeApp = async () => {
  await initializeDB();
  app.use(routes);
  app.use(errorHandler);
};

export { app, initializeApp };
