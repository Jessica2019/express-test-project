// __tests__/testServer.ts
import app from './index';

const TEST_PORT = 3006;

export const APP_URL = `http://localhost:${TEST_PORT}`;

export const startServer = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const server = app.listen(TEST_PORT, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
      }
    });
  });
};

export const stopServer = (server: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err: any) => (err ? reject(err) : resolve()));
    } else {
      resolve();
    }
  });
};


