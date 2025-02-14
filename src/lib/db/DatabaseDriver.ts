import { AnyBulkWriteOperation, connect, connection, ConnectionStates, Model, PipelineStage } from "mongoose";
import { Logger } from "../helpers/logger";
import { Config } from "../../configuration";
import { Restaurant } from "../models/restaurant.model";
import { Pagination } from "mongoose-paginate-ts";

interface IDataBase {
    find(query: object):any;
    aggregate(pipeLine: PipelineStage[],location: any):any;
    bulkWrite(data: any):any;
    findOne(query:object): any;
    distinct(field: string, query: object): any;
    findOneAndUpdate(query: any, data: any, options: any): any;
}

export class DataBase implements IDataBase{
    logger: Logger;
    model: Pagination<any>;
    constructor(DB_URL:string) {
        this.logger= new Logger(Config.logs);
        connection.on('connected', () => this.logger.info("data base connected successfully"));
        connection.on('disconnected', () => this.logger.error("data base is disconnected!"));
        connection.on('reconnected', () => this.logger.info("data base is back to work"));
        connection.on("error",(error)=>{
            this.logger.error(`[ERROR] an error occurred while executing operation on DB ${JSON.stringify({error})}`)
        });

        connect(DB_URL);
        this.model = Restaurant;
    }

    static isDBConnected (){
        return connection.readyState === ConnectionStates.connected
    }

    findOne(query: object) {
        return this.model.findOne(query);
    }

     find(query:any) {
        const {query:filters, ...rest}= query;
        const options = {
            query: filters,
            ...rest

        }         
        return this.model.paginate(options)
    }

    distinct(field: string, query: object){
        return this.model.distinct(field, query)
    }

    async aggregate(pipeLine: PipelineStage[],location: any) {
        return this.model.aggregate().near(location).append(...pipeLine);
    }

    async bulkWrite(data: AnyBulkWriteOperation<any>[]) {
        return this.model.bulkWrite(data)
    }

    async findOneAndUpdate(query: any, data: any, options: any) {
        return this.model.findOneAndUpdate(query, data, options)
    }
}