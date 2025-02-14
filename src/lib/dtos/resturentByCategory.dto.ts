import { IsOptional, IsString, MinLength } from "class-validator";
import { BaseDto } from "./baseRequest.dto";

export class RestaurantByCatDto extends BaseDto{
    @IsString()
    @MinLength(3)
    @IsOptional()
    category_name?: string;
    @IsString()
    @IsOptional()
    name?:string;
}