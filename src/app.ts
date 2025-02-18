import express, { Express } from 'express';
import { initializeDB } from './config/database';
import routes from './routes/apiRoutes';
import errorHandler from './middleware/errorHandler';

const app: Express = express();

app.use(express.json());

const initializeApp = async () => {
  await initializeDB();
  app.use(routes);
  app.use(errorHandler);
};

export { app, initializeApp };
