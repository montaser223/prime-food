import 'dotenv/config';
import { app } from "./app";
import { Config } from "./configuration";
import { Logger } from "./lib/helpers/logger";

const logger = new Logger(Config.logs);

const PORT = process.env.PORT ||3000;

app.listen(PORT, () => {
  logger.info(`[server]: Server is running at http://localhost:${PORT}`);
})