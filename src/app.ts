import "reflect-metadata";
import express, {  type Express } from "express";
import { mainRouter } from "./routes/router";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerDoc from "./swagger-doc.json"
import swaggerUi from 'swagger-ui-express'
import { reqResInterceptor } from "./middlewares/req_res.Interceptor.middleware";
import cors from 'cors'

export const app: Express = express();

app.use(cors())
app.use(reqResInterceptor)
app.use("/v1", mainRouter);
process.env.NODE_ENV === "development" && app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use(errorHandler);
