import { IsString, MinLength } from "class-validator";
import { BaseDto } from "./baseRequest.dto";

export class RestaurantByCatDto extends BaseDto{
    @IsString()
    @MinLength(3)
    category_name?: string;
}