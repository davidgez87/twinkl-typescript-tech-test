// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { Express, Request, Response } from 'express';
import { initializeDB } from './config/database';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

initializeDB()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('Error initializing database:', error);
  });
