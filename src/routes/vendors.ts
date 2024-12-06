import { Router } from "express";
import { uploadRestaurantsInfo } from "../controllers/vendor.controller";
import { filesHandler } from "../middlewares/multer.middleware";

export const vendorsRoutre = Router();

vendorsRoutre.post("/upload", filesHandler.single("restaurants"), uploadRestaurantsInfo)