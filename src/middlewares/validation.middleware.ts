import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
// import { Exposed, plainToInstance, instanceToPlain } from "class-transform";

import { plainToInstance } from "class-transformer"


export const validateRequest = (type:any) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = await validateToDto(type, req.query);
        if(!errors[0]) return next();
        
        const error: any = {status: 400, messages: []}

        errors.forEach(validationError=>{
            Object.values(validationError?.constraints!).forEach(value=>{
                error.messages.push(value)
            }) 
        })
        next(error)
        
        
    };

const validateToDto= (type:any,body:any): Promise<ValidationError[]> =>{
    const dto = plainToInstance(type, body);
    
    return validate(dto,{
        validationError: { target: false },
        whitelist: true,
        forbidNonWhitelisted: true
    })
}
