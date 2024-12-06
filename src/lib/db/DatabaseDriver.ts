import { AnyBulkWriteOperation, connect, connection, ConnectionStates, Model, PipelineStage } from "mongoose";
import { Logger } from "../helpers/logger";
import { Config } from "../../configuration";
import { Restaurant } from "../models/restaurant.model";

interface IDataBase {
    find(query: object):any;
    aggregate(pipeLine: PipelineStage[],location: any):any;
    bulkWrite(data: any):any;
    findOne(query:object): any;
}

export class DataBase implements IDataBase{
    logger: Logger;
    model: Model<any>;
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

     find(query:object) {
        return this.model.find(query);
    }

    async aggregate(pipeLine: PipelineStage[],location: any) {
        return this.model.aggregate().near(location).append(...pipeLine);
    }

    async bulkWrite(data: AnyBulkWriteOperation<any>[]) {
        return this.model.bulkWrite(data)
    }
}