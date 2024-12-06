import { PipelineStage, Types } from "mongoose";
import { Config } from "../../configuration";
import { DataBase } from "../db/DatabaseDriver";
import { Logger } from "../helpers/logger";
import { menuCategoryPath, offer, selectedDataFilter } from "../../consts";

const DB_URL = process.env.DB_URL!

export class RestaurantService {
    private db: DataBase
    private logger: Logger;

    constructor() {
       this.db = new DataBase(DB_URL);
       this.logger = new Logger(Config.logs);
    }

    public getNearbyRestaurants(filters:any): Promise<any>[]{
        const { query: {longitude, latitude}, params} = filters;
        const [skip, limit] = this.paginationFilters(params)
        const location = this.geoLocationFilter(longitude, latitude);
        const query = { location }
        return [
            this.getResturents(query, skip, limit),
            this.getCategories(query),
            this.getOffers({...query,  offer: {$exists: true, $ne: {}}}, skip, limit)
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
                items: { $push: "$vendor.menu.items" }
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
            { $unwind: "$vendors.menu.items" },
            { $match: {'vendors.menu.items.item_name': filters.query.item_name}},
            {$project: {_id: 0,price: "$vendors.menu.items.price", modifiers: "$vendors.menu.items.modifiers", name: "$vendors.name", url: "$vendors.url"}}
        ];
        const location = {near: { type: 'Point', coordinates: [+longitude!, +latitude!] }, distanceField: "location"};
        return this.db.aggregate(aggregates,location)
    }

    public getResturentByCategory(filters:any): Promise<any>{
        const [skip, limit] = this.paginationFilters(filters.params);
        const { query: {longitude, latitude}} = filters;
        const location = this.geoLocationFilter(longitude, latitude)
        const query = {
            location,
            "vendors.menu.MenuCategory": filters.query.category_name
        }
        return this.db.find(query).skip(skip).limit(limit).select(selectedDataFilter);
    }

    private async getResturentItemsByCategory(aggregates:any, location: any){
        return this.db.aggregate(aggregates, location);
    }

    private async findResturentById(filters: any){
        return this.db.findOne(filters);
    }

    private async getResturents(filters:any, skip:number, limit:number) {
        return this.db.find(filters).skip(skip).limit(limit).select(selectedDataFilter)
    }

    private async getCategories(filters:any) {
        return this.db.find(filters).distinct(menuCategoryPath);
    }

    private async getOffers(filters:any, skip:number, limit:number) {
        return this.db.find(filters).skip(skip).limit(limit).select(offer)
    }

    private paginationFilters(params:any): [number, number]{
        const skip = (params.limit * (params.page - 1)) || 0;
        const limit = params.limit || 10;

        return [skip, limit]
    }

    private geoLocationFilter(lng:number,lat: number){
        return {$near: {
            $geometry: { type: "Point",  coordinates: [ lng, lat ] },
            $maxDistance: 5000
        }}
    }
}