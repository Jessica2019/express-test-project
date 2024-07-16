import { Router, Request, Response } from "express";
import { env } from '../env';
import axios from "axios";

type Species = {
  name: string,
  url: string,
}
type PokemonSpeciesDetail = {
  id: string,
  name: string,
  image: string,
  baseHappiness: number,
  captureRate: number,
  colors: string[],
  growthRates: string[],
  habitats: string[],
  isLegendary: boolean,
  eggGroups: string[],
  shapes: string[],
} | {
  name: string,
  error: string,
}

const router = Router();

const POKEMON_SPECIES_API = env.POKEMON_V2_BASEURL + "/pokemon-species";
const POKEMON_ASSETS_BASE = env.POKEMON_ASSETS_BASE;

function getImageLink(id: string) {
  if (id.length < 3) {
    return `${POKEMON_ASSETS_BASE}/${id.padStart(3, "0")}.png`;
  }
  return `${POKEMON_ASSETS_BASE}/${id}.png`;
}

router.get("/", async (req: Request, res: Response) => {
  let limit: number = 20; //default count
  let offset: number = 0;
  const { count, index } = req.query;

  // Validate 
  if (count !== undefined) {
    const parsedCount = parseInt(count as string, 10); 
    if (!isNaN(parsedCount) && parsedCount > 0) {
      limit = parsedCount;
    } else {
      return res.status(400).json({ error: 'Invalid count parameter. Must be a positive number.' });
    }
  }
  if (index !== undefined) {
    const parsedIndex = parseInt(index as string, 10);
    if (!isNaN(parsedIndex) && parsedIndex >= 0) {
      offset = parsedIndex;
    } else {
      return res.status(400).json({ error: 'Invalid index parameter. Must be a non-negative number.' });
    }
  }

  const params = {
    limit,
    offset,
  }

  try {
    const { data: { count: totalCount, results } } = await axios.get(POKEMON_SPECIES_API, { params });
    if(totalCount === 0) {
      res.status(204).end();
      return;
    }

    const speciesDetails: PokemonSpeciesDetail[] = await Promise.all(results.map((async(species: Species) => {
      try {
        const { data } = await axios.get(`${species.url}`);
        const imageUrl = getImageLink(data.id.toString());
        return {
          id: data.id,
          name: data.name.toLowerCase(),
          image: imageUrl,
          baseHappiness: data.base_happiness,
          captureRate: data.capture_rate,
          colors: data.color?.name ? [data.color.name.toLowerCase()]: [],
          growthRates: data.growth_rate?.name ? [data.growth_rate.name.toLowerCase()] : [],
          habitats: data.habitat?.name ? [data.habitat.name.toLowerCase()]: [],
          isLegendary: data.is_legendary,
          eggGroups: data.egg_groups.map(({ name }: { name: string }) => name.toLowerCase()),
          shapes: data.shape?.name ? [data.shape.name.toLowerCase()] : [],
        };
      } catch {
        return { name: species.name, error: `Failed to fetch details of species for ${species.name}`};
      };
    })));
    res.json({
      message: "Successfully fetch species list with details",
      status: 200,
      data: speciesDetails,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err
    });
  }
});

export default router;