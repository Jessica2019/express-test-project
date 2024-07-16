import { Router } from 'express';
import healthRoutes from './health';
import speciesRoutes from './species';
import pokemonRoutes from "./pokemon";

const v1Router = Router();

v1Router.use("/health", healthRoutes);
v1Router.use("/species", speciesRoutes);
v1Router.use("/pokemon", pokemonRoutes);

export default v1Router;
