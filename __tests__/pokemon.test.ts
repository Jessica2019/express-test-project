import request from "supertest";
import axios from "axios";
import { mocked } from "jest-mock";
import { startServer, stopServer } from "../src/testSetup";

jest.mock("axios");
const mockedAxios = mocked(axios);

const pokemonPort = 3004;
const APP_URL = `http://localhost:${pokemonPort}`;
let server: any;

beforeAll(async () => {
  server = await startServer(pokemonPort);
});

afterAll(async () => {
  await stopServer(server);
});

describe("POST /pokemon", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the pokemon details for a valid request", async () => {
    const mockSpeciesApiResponse = { status: 200, data: {} };
    const mockPokemonApiResponse = {
      data: {
        abilities: [{ ability: { name: "overgrow" } }],
        base_experience: 64,
        forms: [{ name: "bulbasaur" }],
        height: 7,
        weight: 69,
        moves: [{ move: { name: "tackle" } }, { move: { name: "growl" } }],
        sprites: {
          back_default: "back.png",
          back_shiny: "back_shiny.png",
          front_default: "front.png",
          front_shiny: "front_shiny.png"
        }
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockSpeciesApiResponse) // Mock species API response
      .mockResolvedValueOnce(mockPokemonApiResponse); // Mock pokemon details API response

    const response = await request(APP_URL)
      .post("/v1/pokemon")
      .send({ name: "bulbasaur", max_moves: 2 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully fetch pokemon with name bulbasaur");
    expect(response.body.data).toEqual({
      name: "bulbasaur",
      abilities: ["overgrow"],
      baseExperience: 64,
      forms: ["bulbasaur"],
      height: 7,
      weight: 69,
      moves: ["tackle", "growl"],
      sprites: {
        backDefault: "back.png",
        backShiny: "back_shiny.png",
        FrontDefault: "front.png",
        FrontShiny: "front_shiny.png"
      }
    });
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(APP_URL)
      .post("/v1/pokemon")
      .send({ max_moves: 2 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid or missing "name" field in request body.');
  });

  it("should return 400 if max_moves is missing", async () => {
    const response = await request(APP_URL)
      .post("/v1/pokemon")
      .send({ name: "bulbasaur" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid or missing "max_moves" field in request body. Must be a positive number.');
  });

  it("should return 400 if the name is not found", async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 404 });

    const response = await request(APP_URL)
      .post("/v1/pokemon")
      .send({ name: "unknown", max_moves: 2 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid "name" field in request body. Not Found error');
  });

  it("should return 500 if there is an internal server error", async () => {
    mockedAxios.get
    .mockResolvedValueOnce({ status: 200}) 
    .mockResolvedValueOnce( { status: 200 });
    mockedAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const response = await request(APP_URL)
      .post("/v1/pokemon")
      .send({ name: "bulbasaur", max_moves: 2 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
