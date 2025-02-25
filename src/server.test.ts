import { app, initializeApp } from './app';
import { initializeDB } from './config/database';
import { startServer } from './server';

jest.mock('./app', () => ({
  app: {
    listen: jest.fn((port: number, callback: Function) => callback()),
  },
  initializeApp: jest.fn(),
}));

jest.mock('./config/database', () => ({
  initializeDB: jest.fn(),
}));

describe('Server', () => {
  let exitSpy: jest.SpyInstance;

  beforeAll(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    exitSpy.mockRestore();
  });

  it('should start the server successfully when initializeApp resolves', async () => {
    (initializeDB as jest.Mock).mockResolvedValue(undefined);
    (initializeApp as jest.Mock).mockResolvedValue(undefined);

    await startServer();

    expect(initializeApp).toHaveBeenCalled();
    expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should handle app initialization failure and exit with code 1', async () => {
    (initializeDB as jest.Mock).mockResolvedValue(undefined);
    (initializeApp as jest.Mock).mockRejectedValue(new Error('App initialization failed'));

    await startServer();

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
