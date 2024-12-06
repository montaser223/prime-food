import { NextFunction, Request, Response } from "express";
import { VendorService } from "../lib/services/vendor.service";
import { Logger } from "../lib/helpers/logger";
import { Config } from "../configuration";
import { CustomError } from "../lib/helpers/customError";
import { errorCodes } from "../consts";

const logger = new Logger(Config.logs);
const service = new VendorService();

export const uploadRestaurantsInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    if(process.env.VENDOR_KEY !== req.headers.authorization) throw new CustomError(errorCodes.unauthorized)
    const vendorName: string = req.file?.originalname
      .split("_")[0]
      .toLowerCase()!;
    logger.debug(
      `[vendor][uploadRestaurantsInfo][${vendorName}] start uploading restaurants info`
    );
    await service.handleRestaurants(req.file?.buffer!, vendorName);
    res.end();
    logger.info(`[vendor][uploadRestaurantsInfo][${vendorName}] restaurants uploaded successfully`);
  } catch (error) {
    next(error);
  }
};
