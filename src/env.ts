import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Env {
  POKEMON_V2_BASEURL: string,
  POKEMON_ASSETS_BASE: string
}

const getEnv = (): Env => {
  if (!process.env.POKEMON_V2_BASEURL || !process.env.POKEMON_ASSETS_BASE) {
    throw new Error('Missing required environment variables');
  }

  return {
    POKEMON_V2_BASEURL: process.env.POKEMON_V2_BASEURL,
    POKEMON_ASSETS_BASE: process.env.POKEMON_ASSETS_BASE,
  };
};

export const env = getEnv();
