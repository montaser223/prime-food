import { configure, getLogger, Logger as logger } from "log4js";

export class Logger implements ILogger {
    private logger: logger;
    constructor(config: any) {
        configure(config)
        this.logger = getLogger("prime-food");
    }

    info(message: string): void {
        this.logger.info(message);
    }

    warn(message: string): void {
        this.logger.warn(message);
    }

    error(message: string): void {
        this.logger.error(message);
    }

    debug(message: string): void {
        this.logger.debug(message);
    }
}

interface ILogger {
    info(message:string): void;
    warn(message:string): void;
    error(message:string): void;
    debug(message:string): void;
}