// __tests__/testServer.ts
import app from './index';


export const startServer = (port: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, (err?: Error) => {
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


