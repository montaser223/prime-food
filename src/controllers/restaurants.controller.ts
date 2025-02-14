import { NextFunction, Request, Response } from "express";
import { Config } from "../configuration";
import { Logger } from "../lib/helpers/logger";
import { RestaurantService } from "../lib/services/restaurants.service";
import { CustomError } from "../lib/helpers/customError";
import { errorCodes } from "../consts";

const logger = new Logger(Config.logs);
const service = new RestaurantService();

export const  getNearbyRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {query: req.query, params: req.params};
        const [restaurants, categories, offers] = await Promise.all(service.getNearbyRestaurants(filters))
        res.json({data: {restaurants, categories, offers}});
    } catch (error) {
        next(error);
    }
}

export const getResturentById = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const filters = {query: req.query, params: req.params};
        const [categories, offers] = await Promise.all(service.getResturentById(filters));
        if(!categories.length) throw new CustomError(errorCodes.notFound)
        res.json({data: {categories, offers:offers?.offer}});
    } catch (error) {
        next(error);
    }
}

export const comparePrices =  async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const filters = {query: req.query, params: req.params};
        const prices =   await service.comparePrices(filters);
        if(!prices.length) throw new CustomError(errorCodes.notFound);
        res.json({data: prices});
    } catch (error) {
        next(error);
    }   
}

export const getResturentByCategory = async (req: Request, res: Response, next:NextFunction) =>{
    try {
        const filters = {query: req.query, params: req.params};
        const restaurants = await service.getResturentByCategory(filters);
        
        if(!restaurants.docs.length) throw new CustomError(errorCodes.notFound);
        res.json({data: restaurants});
    } catch (error) {
        next(error);
    }
}
