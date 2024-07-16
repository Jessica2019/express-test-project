import request from "supertest";
import { APP_URL, startServer, stopServer } from "../src/testSetup";

let server: any;

beforeAll(async () => {
  server = await startServer();
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