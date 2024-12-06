import { NextFunction, Request, Response } from "express";
import { Logger } from "../lib/helpers/logger";
import { Config } from "../configuration";
const logger = new Logger(Config.logs);

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    logger.error(`[Error] - ${error.message || error.messages} `)
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || error.messages
    });
};
