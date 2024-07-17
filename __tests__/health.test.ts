import request from "supertest";
import { startServer, stopServer } from "../src/testSetup";

const healthPort = 3002;
const APP_URL = `http://localhost:${healthPort}`;
let server: any;

beforeAll(async () => {
  server = await startServer(healthPort);
});

afterAll(async () => {
  await stopServer(server);
});

describe("v1 endpoints test", () => {
  // health endpoint test
  test("health endpoint test", async() => {
    const response = await request(APP_URL).get('/v1/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Ok',
            status: 200
        });
  });
})