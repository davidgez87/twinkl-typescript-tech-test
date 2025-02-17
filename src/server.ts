import { app, initializeApp } from './app';

const port = process.env.PORT || 3000;

export const startServer = async () => {
  try {
    await initializeApp();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();

export default { startServer };
