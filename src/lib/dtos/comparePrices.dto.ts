import { IsString, MinLength } from "class-validator";
import { BaseDto } from "./baseRequest.dto";

export class ComparePricesDto extends BaseDto{
    @IsString()
    @MinLength(3)
    item_name?: string;
}