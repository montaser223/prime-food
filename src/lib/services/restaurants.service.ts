import { PipelineStage, Types } from "mongoose";
import { Config } from "../../configuration";
import { DataBase } from "../db/DatabaseDriver";
import { Logger } from "../helpers/logger";
import { menuCategoryPath, offer, selectedDataFilter } from "../../consts";
import { query } from "express";

const DB_URL = process.env.DB_URL!

export class RestaurantService {
    private db: DataBase
    private logger: Logger;

    constructor() {
       this.db = new DataBase(DB_URL);
       this.logger = new Logger(Config.logs);
    }

    public getNearbyRestaurants(filters:any): Promise<any>[]{
        const { query: {longitude, latitude}} = filters;
        const [skip, limit] = this.paginationFilters(filters.query)
        const location = this.geoLocationFilter(longitude, latitude);
        const query = { location }
        return [
            this.getResturents(query, skip, limit),
            this.getCategories(query),
            this.getOffers({...query,  offer: {$exists: true, $nin: [{}, null]}}, skip, limit)
        ]
    }
    
    public getResturentById(filters:any): Promise<any>[]{
        const { query: {longitude, latitude}} = filters;
        const geoLocation = this.geoLocationFilter(longitude, latitude);
        const query :{_id: any, location?: any} =  { _id: new Types.ObjectId(filters.params.id)};

        const aggregates = [
            {$match: {...query}},
            { $project: { vendor: { $arrayElemAt: ["$vendors", 0] } } },
            { $unwind: "$vendor.menu" },
            { $group: {
                _id: "$vendor.menu.MenuCategory",
              category: { $first: "$vendor.menu.MenuCategory" },
                items: { $push: "$vendor.menu.Items" }
            } },
            { $unwind: "$items" },
            { $project: { _id: 0 }  },
        ];
        query.location = geoLocation;
        const location = {near: { type: 'Point', coordinates: [+longitude!, +latitude!] }, distanceField: "location"};

        return [
            this.getResturentItemsByCategory(aggregates,location),
            this.findResturentById(query)
        ]
    }

    public comparePrices(filters: any): Promise<any>{
        const { query: {longitude, latitude}} = filters;
        
        const aggregates: PipelineStage[] = [
            { $match: {_id: new Types.ObjectId(filters.params.id)}},
            { $unwind: '$vendors'},
            { $unwind: "$vendors.menu" },
            { $unwind: "$vendors.menu.Items" },
            { $match: {'vendors.menu.Items.item_name': filters.query.item_name}},
            {$project: {_id: 0,price: "$vendors.menu.Items.price", modifiers: "$vendors.menu.Items.modifiers", name: "$vendors.name", url: "$vendors.url"}}
        ];
        const location = {near: { type: 'Point', coordinates: [+longitude!, +latitude!] }, distanceField: "location"};
        return this.db.aggregate(aggregates,location)
    }

    public getResturentByCategory(filters:any): Promise<any>{
        const [skip, limit] = this.paginationFilters(filters.query);
        const { query: {longitude, latitude, name}} = filters;
        const location = this.geoLocationFilter(longitude, latitude)
        const query = {
            location,
            $or: [{"vendors.menu.MenuCategory": filters.query.category_name}, {name}]
        }
        return this.db.find({query, limit, select: selectedDataFilter, page:skip})
    }

    private async getResturentItemsByCategory(aggregates:any, location: any){
        return this.db.aggregate(aggregates, location);
    }

    private async findResturentById(filters: any){
        return this.db.findOne(filters);
    }

    private async getResturents(filters:any, skip:number, limit:number) {        
        return this.db.find({query: filters,limit, select: selectedDataFilter, page: skip})
    }

    private async getCategories(filters:any) {
        return this.db.distinct(menuCategoryPath, filters);
    }

    private async getOffers(filters:any, skip:number, limit:number) {
        return this.db.find({query: filters, limit, page: skip, select: offer});
    }

    private paginationFilters(params:any): [number, number]{
        const skip = params.page || 1;
        const limit = params.limit || 10;
        return [skip, limit]
    }

    private geoLocationFilter(lng:number,lat: number){
        return {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat],
                     5 / 6378.1,
                ],
              }
        }
    }

    private getGeoLocationFilter(lng:number,lat: number){
        return {$near: {
            $geometry: { type: "Point",  coordinates: [ lng, lat ] },
            $maxDistance: 5000
        }}
    }
}