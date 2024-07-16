import request from "supertest";
import axios from "axios";
import  { mocked } from "jest-mock";
import { APP_URL, startServer, stopServer } from "../src/testSetup";

let server: any;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await stopServer(server);
});

jest.mock("axios"); 
const mockedAxios = mocked(axios); 

describe("GET /v1/species", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  it("should return species list with details", async () => {
    const mockSpeciesApiResponse = {
      data: {
        count: 2,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
        ],
      },
    };

    const mockSpeciesDetailsResponse = {
      id: "1",
      name: "bulbasaur",
      base_happiness: 70,
      capture_rate: 45,
      color: { name: "green" },
      growth_rate: { name: "medium-slow" },
      habitat: { name: "grassland" },
      is_legendary: false,
      egg_groups: [{ name: "monster" }, { name: "grass" }],
      shape: { name: "quadruped" },
    };

    mockedAxios.get.mockResolvedValueOnce(mockSpeciesApiResponse); // Mock species API response
    mockedAxios.get.mockResolvedValueOnce({ data: mockSpeciesDetailsResponse }); // Mock details API response

    const response = await request(APP_URL).get("/v1/species");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully fetch species list with details");
    expect(response.body.status).toBe(200);
    expect(response.body.data).toHaveLength(2); // Assuming two species were returned

    // Assuming structure of returned data matches your PokemonSpeciesDetail type
    expect(response.body.data[0]).toEqual({
      id: "1",
      name: "bulbasaur",
      image: expect.stringContaining("/001.png"), // Assuming getImageLink behaves predictably
      baseHappiness: 70,
      captureRate: 45,
      colors: ["green"],
      growthRates: ["medium-slow"],
      habitats: ["grassland"],
      isLegendary: false,
      eggGroups: ["monster", "grass"],
      shapes: ["quadruped"],
    });
  });

  it("should handle no species found (return 204)", async () => {
    const mockSpeciesApiResponse = {
      data: {
        count: 0,
        results: [],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockSpeciesApiResponse);

    const response = await request(APP_URL).get("/v1/species");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should handle invalid count parameter (return 400)", async () => {
    const response = await request(APP_URL).get("/v1/species?count=invalid");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid count parameter. Must be a positive number." });
  });

  it("should handle invalid index parameter (return 400)", async () => {
    const response = await request(APP_URL).get("/v1/species?index=-1");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid index parameter. Must be a non-negative number." });
  });

  it("should handle failed species detail fetch (return error object)", async () => {
    const mockSpeciesApiResponse = {
      data: {
        count: 1,
        results: [{ name: "invalidspecies", url: "https://pokeapi.co/api/v2/pokemon-species/999/" }],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockSpeciesApiResponse);
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed to fetch details"));

    const response = await request(APP_URL).get("/v1/species");

    expect(response.status).toBe(200);
    expect(response.body.data[0]).toEqual({
      name: "invalidspecies",
      error: "Failed to fetch details of species for invalidspecies",
    });
  });

  it("should handle internal server error (return 500)", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const response = await request(APP_URL).get("/v1/species");

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual("Internal Server Error");
  });
});
