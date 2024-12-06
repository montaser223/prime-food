import { Transform } from "class-transformer";
import { IsInt, IsLatitude, IsLongitude, IsOptional, Max, Min } from "class-validator"
export class BaseDto {
    @Transform(({ value }) => {
        const number = parseInt(value);
        return isNaN(number) ? value : number;
    })
    @IsOptional()
    @IsInt()
    @Min(5)
    @Max(50)
    limit?:number;
    
    @Transform(({ value }) => {
        const number = parseInt(value);
        return isNaN(number) ? value : number;
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @IsLongitude()
    longitude?:number;
    @IsLatitude()
    latitude?: number;

}