import { type NextFunction , type Request, type Response} from "express";
import { DataBase } from "../lib/db/DatabaseDriver";

export const healthCheck = (_: Request, res: Response, next:NextFunction)=>{
   try {
        if(!DataBase.isDBConnected()) throw new Error("database is down")
        res.send("Ok")
   } catch (error) {
    next(error)
   }
}