import { Router } from "express";
import { comparePrices, getNearbyRestaurants, getResturentByCategory, getResturentById } from "../controllers/restaurants.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import { BaseDto } from "../lib/dtos/baseRequest.dto";
import { RestaurantByCatDto } from "../lib/dtos/resturentByCategory.dto";
import { ComparePricesDto } from "../lib/dtos/comparePrices.dto";

export const restaurantsRouter = Router();

restaurantsRouter.get("/", validateRequest(BaseDto), getNearbyRestaurants)
restaurantsRouter.get("/category", validateRequest(RestaurantByCatDto),getResturentByCategory)
restaurantsRouter.get("/:id", validateRequest(BaseDto), getResturentById)
restaurantsRouter.get("/:id/compare", validateRequest(ComparePricesDto), comparePrices)