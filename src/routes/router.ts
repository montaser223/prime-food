import { Router } from "express";
import { vendorsRoutre } from "./vendors";
import { restaurantsRouter } from "./restaurants";
import { healthCheck } from "../controllers/base.controller";

export const mainRouter = Router();

mainRouter.use("/vendors", vendorsRoutre)
mainRouter.use("/restaurants", restaurantsRouter)
mainRouter.use("/", healthCheck)