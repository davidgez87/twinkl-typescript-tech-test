import express, { Express } from 'express';
import { initializeDB } from './config/database';
import routes from './routes';

const app: Express = express();

app.use(express.json());

const initializeApp = async () => {
  await initializeDB();
  app.use(routes);
};

export { app, initializeApp };
