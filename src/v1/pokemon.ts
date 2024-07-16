import { Router, Request, Response } from "express";
import axios from "axios";
import { env } from "../env";

type Ability = {
    name: string,
}

type Move = {
  name: string,
}

type Sprites = {
	backDefault: string,
	backShiny: string,
	FrontDefault: 	string,
	FrontShiny: string,
}

type Pokemon = {
  name: string,
	abilities: string[],
	baseExperience: number,
	forms: string[],
	height: number,
	weight: number,
	moves: string[],
	sprites?: Sprites
}

const router = Router();

const POKEMON_SPECIES_API = env.POKEMON_V2_BASEURL + "/pokemon-species";
const POKEMON_CREATURES_API = env.POKEMON_V2_BASEURL + "/pokemon";

router.post("/", async (req: Request, res: Response) => {
  const { name, max_moves } = req.body;
  
  // Validate request body
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "name" field in request body.' });
  }
  
  const response = await axios.get(`${POKEMON_SPECIES_API}/${name}`);
  if (response.status === 404) {
    // Not Found Error
    return res.status(400).json({ error: 'Invalid "name" field in request body. Not Found error' });
  }

  if (!max_moves || typeof max_moves !== 'number' || max_moves <= 0) {
    return res.status(400).json({ error: 'Invalid or missing "max_moves" field in request body. Must be a positive number.' });
  }

  try {
    const { data } = await axios.get(`${POKEMON_CREATURES_API}/${name}`);
    const pokemonRes: Pokemon = {
      name: name.toLowerCase(),
      abilities: data.abilities.map(({ ability }: { ability: Ability }) => ability.name.toLowerCase()),
      baseExperience: data.base_experience,
      forms: data.forms.map(({ name }: { name: string}) => name.toLowerCase()),
      height: data.height,
      weight: data.weight,
      moves: data.moves.slice(0, max_moves).map(({ move }: { move: Move}) => move.name.toLowerCase()),
      sprites: data.sprites && {
        backDefault: data.sprites.back_default,
        backShiny: data.sprites.back_shiny,
        FrontDefault: data.sprites.front_default,
        FrontShiny: data.sprites.front_shiny,
      },
    };
    res.json({
      message: `Successfully fetch pokemon with name ${name}`,
      status: 200,
      data: pokemonRes,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err
    });
  }
});

export default router;