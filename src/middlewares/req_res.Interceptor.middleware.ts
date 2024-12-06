import { NextFunction, Request, Response, Send } from "express";
import { Config } from "../configuration"
import { Logger } from "../lib/helpers/logger"

const logger = new Logger(Config.logs);

export const reqResInterceptor =  (req: Request, res: Response, next: NextFunction)=>{
    logger.info(`start hadnle request at ${req.path} with following data params: ${JSON.stringify(req.params)}, query ${JSON.stringify(req.query)}`);
    const originalSend = res.send;
    res.send = function (data): Response<any, Record<string, any>>{
		logger.info('request handled successfully')
		return originalSend.call(this, data);
	};
    next();
}